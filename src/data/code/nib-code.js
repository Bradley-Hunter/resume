export const nibCode = [
{ name: 'll_keyboard_proc', language: 'rust', code: `// Magic value set in dwExtraInfo to tag our own synthetic keystrokes
// so the hook ignores them and doesn't re-trigger.
const NIB_INJECTED_TAG: usize = 0x4E49425F; // "NIB_"

unsafe extern "system" fn ll_keyboard_proc(
    n_code: i32,
    wparam: WPARAM,
    lparam: LPARAM,
) -> LRESULT {
    if n_code >= 0 {
        let kb = &*(lparam.0 as *const KBDLLHOOKSTRUCT);
        let vk = kb.vkCode as u16;
        let msg = wparam.0 as u32;

        // Ignore our own synthetic keystrokes (from send_ctrl_v)
        if kb.dwExtraInfo == NIB_INJECTED_TAG {
            return CallNextHookEx(KEYBOARD_HOOK.unwrap_or(HHOOK::default()), n_code, wparam, lparam);
        }

        match msg {
            WM_KEYDOWN | WM_SYSKEYDOWN => {
                if vk == VK_LWIN || vk == VK_RWIN {
                    WIN_KEY_DOWN = true;
                    WIN_V_CONSUMED = false;
                } else if vk == VK_V.0 && WIN_KEY_DOWN {
                    // Win+V detected — suppress and notify
                    WIN_V_CONSUMED = true;
                    WIN_KEY_DOWN = false;
                    if EFRAME_ACTIVE.load(Ordering::SeqCst) {
                        // Popup is open — signal it to close (toggle)
                        CLOSE_POPUP_SIGNAL.store(true, Ordering::SeqCst);
                    } else if let Some(hwnd) = HOOK_TARGET_HWND {
                        let _ = PostMessageW(hwnd, WM_HOTKEY, WPARAM(HOTKEY_ID as usize), LPARAM(0));
                    }
                    return LRESULT(1); // Suppress
                } else {
                    // Any other key while Win is held — not our combo, reset
                    // (Win is still physically down, but we only care about Win+V)
                }

                // Intercept navigation keys while popup is over the Start menu
                if INTERCEPT_NAV_KEYS.load(Ordering::SeqCst) {
                    use windows::Win32::UI::Input::KeyboardAndMouse::{VK_UP, VK_DOWN, VK_RETURN, VK_ESCAPE};
                    let flag = match vk {
                        v if v == VK_UP.0 => Some(INJECTED_KEY_UP),
                        v if v == VK_DOWN.0 => Some(INJECTED_KEY_DOWN),
                        v if v == VK_RETURN.0 => Some(INJECTED_KEY_ENTER),
                        v if v == VK_ESCAPE.0 => Some(INJECTED_KEY_ESCAPE),
                        _ => None,
                    };
                    if let Some(f) = flag {
                        INJECTED_KEYS.fetch_or(f, Ordering::SeqCst);
                        return LRESULT(1); // Suppress — don't send to Start menu
                    }
                }
            }
            WM_KEYUP | WM_SYSKEYUP => {
                if vk == VK_LWIN || vk == VK_RWIN {
                    let was_consumed = WIN_V_CONSUMED;
                    WIN_KEY_DOWN = false;
                    WIN_V_CONSUMED = false;
                    if was_consumed {
                        // Suppress the Win key-up to prevent Start menu from flashing
                        return LRESULT(1);
                    }
                }
            }
            _ => {}
        }
    }
    CallNextHookEx(KEYBOARD_HOOK.unwrap_or(HHOOK::default()), n_code, wparam, lparam)
}

/// Resets the hook's internal state without sending any synthetic key events.
/// Safe to call before the popup opens — won't trigger Start menu.
unsafe fn reset_hook_state() {
    WIN_KEY_DOWN = false;
    WIN_V_CONSUMED = false;
}

/// Resets hook state AND sends synthetic Win key-up events so the OS
/// doesn't think Win is still held. Only call after the popup closes —
/// calling before open can trigger the Start menu.
unsafe fn release_stuck_win_key() {
    reset_hook_state();

    use windows::Win32::UI::Input::KeyboardAndMouse::{
        SendInput, INPUT, INPUT_KEYBOARD, KEYBDINPUT, KEYEVENTF_KEYUP, VIRTUAL_KEY,
    };

    let inputs = [
        INPUT {
            r#type: INPUT_KEYBOARD,
            Anonymous: windows::Win32::UI::Input::KeyboardAndMouse::INPUT_0 {
                ki: KEYBDINPUT {
                    wVk: VIRTUAL_KEY(VK_LWIN),
                    wScan: 0,
                    dwFlags: KEYEVENTF_KEYUP,
                    time: 0,
                    dwExtraInfo: NIB_INJECTED_TAG,
                },
            },
        },
        INPUT {
            r#type: INPUT_KEYBOARD,
            Anonymous: windows::Win32::UI::Input::KeyboardAndMouse::INPUT_0 {
                ki: KEYBDINPUT {
                    wVk: VIRTUAL_KEY(VK_RWIN),
                    wScan: 0,
                    dwFlags: KEYEVENTF_KEYUP,
                    time: 0,
                    dwExtraInfo: NIB_INJECTED_TAG,
                },
            },
        },
    ];

    let size = std::mem::size_of::<INPUT>() as i32;
    SendInput(&inputs, size);
}` },
{ name: 'detection.rs', language: 'rust', code: `use windows::Win32::Foundation::{CloseHandle, BOOL, HWND, LPARAM, MAX_PATH};
use windows::Win32::System::Threading::{
    OpenProcess, QueryFullProcessImageNameW, PROCESS_NAME_WIN32, PROCESS_QUERY_LIMITED_INFORMATION,
};
use windows::Win32::UI::WindowsAndMessaging::{
    EnumChildWindows, GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId,
};
use windows::core::PWSTR;

#[derive(Clone)]
pub struct SourceApp {
    pub process_name: String,
    pub window_title: String,
}

pub fn get_foreground_app() -> Option<SourceApp> {
    unsafe {
        let hwnd = GetForegroundWindow();
        if hwnd == HWND::default() {
            return None;
        }

        let window_title = get_window_title(hwnd);

        let mut pid: u32 = 0;
        GetWindowThreadProcessId(hwnd, Some(&mut pid));
        if pid == 0 {
            return Some(SourceApp {
                process_name: "unknown".to_string(),
                window_title,
            });
        }

        let process_name = get_process_name(pid).unwrap_or_else(|| "unknown".to_string());

        // Handle UWP apps (ApplicationFrameHost.exe)
        let final_name = if process_name.eq_ignore_ascii_case("ApplicationFrameHost.exe") {
            get_uwp_child_process_name(hwnd).unwrap_or(process_name)
        } else {
            process_name
        };

        Some(SourceApp {
            process_name: final_name,
            window_title,
        })
    }
}

unsafe fn get_window_title(hwnd: HWND) -> String {
    let mut buffer = [0u16; 512];
    let len = GetWindowTextW(hwnd, &mut buffer);
    if len > 0 {
        String::from_utf16_lossy(&buffer[..len as usize])
    } else {
        String::new()
    }
}

unsafe fn get_process_name(pid: u32) -> Option<String> {
    let handle = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, false, pid).ok()?;
    let mut buffer = [0u16; MAX_PATH as usize];
    let mut size = buffer.len() as u32;
    let result = QueryFullProcessImageNameW(
        handle,
        PROCESS_NAME_WIN32,
        PWSTR(buffer.as_mut_ptr()),
        &mut size,
    );
    let _ = CloseHandle(handle);
    result.ok()?;

    let path = String::from_utf16_lossy(&buffer[..size as usize]);
    path.rsplit('\\').next().map(|s| s.to_string())
}

unsafe fn get_uwp_child_process_name(hwnd: HWND) -> Option<String> {
    struct CallbackData {
        parent_pid: u32,
        child_name: Option<String>,
    }

    unsafe extern "system" fn enum_callback(child: HWND, lparam: LPARAM) -> BOOL {
        let data = &mut *(lparam.0 as *mut CallbackData);
        let mut child_pid: u32 = 0;
        GetWindowThreadProcessId(child, Some(&mut child_pid));
        if child_pid != 0 && child_pid != data.parent_pid {
            if let Some(name) = get_process_name(child_pid) {
                data.child_name = Some(name);
                return false.into();
            }
        }
        true.into()
    }

    let mut pid: u32 = 0;
    GetWindowThreadProcessId(hwnd, Some(&mut pid));

    let mut data = CallbackData {
        parent_pid: pid,
        child_name: None,
    };

    let _ = EnumChildWindows(
        hwnd,
        Some(enum_callback),
        LPARAM(&mut data as *mut _ as isize),
    );

    data.child_name
}` },
{ name: 'sensitive.rs', language: 'rust', code: `use crate::config::NibConfig;

/// Known password manager process names (lowercase for comparison).
const DEFAULT_PASSWORD_MANAGERS: &[&str] = &[
    "1password.exe",
    "bitwarden.exe",
    "keepass.exe",
    "keepassxc.exe",
    "lastpass.exe",
    "dashlane.exe",
    "roboform.exe",
    "enpass.exe",
];

/// Token prefixes that indicate secrets.
const SECRET_PREFIXES: &[&str] = &[
    "ghp_",   // GitHub personal access token
    "gho_",   // GitHub OAuth token
    "ghs_",   // GitHub server-to-server token
    "ghu_",   // GitHub user-to-server token
    "sk-",    // OpenAI / Stripe secret key
    "pk_",    // Stripe publishable key
    "Bearer ", // Authorization header
    "eyJ",    // JWT (base64-encoded JSON)
    "AKIA",   // AWS access key ID
    "xox",    // Slack tokens (xoxb-, xoxp-, xoxa-, xoxs-)
];

/// Checks if a clipboard entry appears to be sensitive content.
///
/// Detection heuristics:
/// 1. Source app is a known password manager
/// 2. Content matches known secret token prefixes
/// 3. Content looks like a high-entropy short string (password-like)
pub fn is_sensitive(plain_text: Option<&str>, source_app: &str, config: &NibConfig) -> bool {
    // Check source app against password manager list
    if is_password_manager(source_app, config) {
        return true;
    }

    // Check content patterns
    if let Some(text) = plain_text {
        if matches_secret_pattern(text) {
            return true;
        }
        if is_high_entropy_short_string(text) {
            return true;
        }
    }

    false
}

fn is_password_manager(source_app: &str, config: &NibConfig) -> bool {
    let app_lower = source_app.to_lowercase();

    // Check user-configured list first
    for pm in &config.password_manager_apps {
        if app_lower == pm.to_lowercase() {
            return true;
        }
    }

    // Fall back to built-in list
    DEFAULT_PASSWORD_MANAGERS
        .iter()
        .any(|pm| app_lower == *pm)
}

fn matches_secret_pattern(text: &str) -> bool {
    let trimmed = text.trim();
    // Only check single-line strings (secrets are typically one line)
    if trimmed.contains('\\n') {
        return false;
    }
    SECRET_PREFIXES.iter().any(|prefix| trimmed.starts_with(prefix))
}

/// Detects high-entropy short strings that look like passwords or API keys.
/// Criteria: 8-128 chars, single line, high character diversity, no spaces.
fn is_high_entropy_short_string(text: &str) -> bool {
    let trimmed = text.trim();

    // Must be a single line, 8-128 characters, no spaces
    if trimmed.contains('\\n') || trimmed.contains(' ') {
        return false;
    }
    let len = trimmed.len();
    if len < 8 || len > 128 {
        return false;
    }

    // Calculate Shannon entropy
    let entropy = shannon_entropy(trimmed);

    // Typical passwords/tokens have entropy > 3.5 bits per character
    // English words average ~4.0-4.5 but always have spaces; single words rarely exceed 3.0
    entropy > 3.5
}

fn shannon_entropy(s: &str) -> f64 {
    let len = s.len() as f64;
    if len == 0.0 {
        return 0.0;
    }

    let mut freq = [0u32; 256];
    for &b in s.as_bytes() {
        freq[b as usize] += 1;
    }

    freq.iter()
        .filter(|&&count| count > 0)
        .map(|&count| {
            let p = count as f64 / len;
            -p * p.log2()
        })
        .sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_shannon_entropy() {
        // All same character = 0 entropy
        assert!((shannon_entropy("aaaaaaaaaa") - 0.0).abs() < 0.01);
        // High entropy string
        assert!(shannon_entropy("aB3$xK9!mN") > 3.0);
    }

    #[test]
    fn test_matches_secret_pattern() {
        assert!(matches_secret_pattern("ghp_abc123def456"));
        assert!(matches_secret_pattern("sk-proj-abc123"));
        assert!(matches_secret_pattern("Bearer eyJhbGciOiJ"));
        assert!(matches_secret_pattern("AKIAIOSFODNN7EXAMPLE"));
        assert!(!matches_secret_pattern("Hello world"));
        assert!(!matches_secret_pattern("normal text\\nwith newline"));
    }

    #[test]
    fn test_high_entropy_short() {
        // Password-like
        assert!(is_high_entropy_short_string("xK9!mN2@pQ4#"));
        // Normal word — low entropy
        assert!(!is_high_entropy_short_string("password"));
        // Too long
        assert!(!is_high_entropy_short_string(&"a".repeat(200)));
        // Has spaces
        assert!(!is_high_entropy_short_string("hello world foo"));
    }
}` },
]
