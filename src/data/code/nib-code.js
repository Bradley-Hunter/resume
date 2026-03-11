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
{ name: 'paste.rs', language: 'rust', code: `use crate::storage::db::Clip;
use log::{debug, warn};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Duration;
use windows::Win32::Foundation::HWND;
use windows::Win32::System::DataExchange::{
    CloseClipboard, EmptyClipboard, OpenClipboard, RegisterClipboardFormatW, SetClipboardData,
};
use windows::Win32::System::Memory::{GlobalAlloc, GlobalLock, GlobalUnlock, GMEM_MOVEABLE};
use windows::Win32::UI::Input::KeyboardAndMouse::{
    GetKeyState, SendInput, INPUT, INPUT_KEYBOARD, KEYBDINPUT, KEYBD_EVENT_FLAGS,
    KEYEVENTF_KEYUP, VK_CONTROL, VK_LWIN, VK_MENU, VK_SHIFT, VK_V, VIRTUAL_KEY,
};
use windows::core::PCWSTR;

/// Writes a clip's formats to the clipboard without simulating a paste keystroke.
pub fn write_clip_to_clipboard(clip: &Clip, is_self_writing: &Arc<AtomicBool>) {
    unsafe {
        is_self_writing.store(true, Ordering::SeqCst);
        if !write_formats_to_clipboard(clip) {
            is_self_writing.store(false, Ordering::SeqCst);
        }
    }
}

/// Pastes a clip by writing all its formats to the clipboard and simulating Ctrl+V.
pub fn paste_clip(clip: &Clip, is_self_writing: &Arc<AtomicBool>) {
    unsafe {
        is_self_writing.store(true, Ordering::SeqCst);

        if !write_formats_to_clipboard(clip) {
            is_self_writing.store(false, Ordering::SeqCst);
            return;
        }

        std::thread::sleep(Duration::from_millis(50));
        send_ctrl_v();
    }
}

/// Writes all stored formats to the clipboard. Returns true on success.
unsafe fn write_formats_to_clipboard(clip: &Clip) -> bool {
    if OpenClipboard(HWND::default()).is_err() {
        warn!("write_formats_to_clipboard: failed to open clipboard");
        return false;
    }

    if EmptyClipboard().is_err() {
        warn!("write_formats_to_clipboard: failed to empty clipboard");
        let _ = CloseClipboard();
        return false;
    }

    for format in &clip.formats {
        let format_id = resolve_format_id(&format.format_type);
        if format_id == 0 {
            continue;
        }

        match GlobalAlloc(GMEM_MOVEABLE, format.content.len()) {
            Ok(hmem) => {
                let ptr = GlobalLock(hmem);
                if !ptr.is_null() {
                    std::ptr::copy_nonoverlapping(
                        format.content.as_ptr(),
                        ptr as *mut u8,
                        format.content.len(),
                    );
                    let _ = GlobalUnlock(hmem);

                    let handle = windows::Win32::Foundation::HANDLE(hmem.0);
                    if let Err(e) = SetClipboardData(format_id, handle) {
                        debug!("write_formats_to_clipboard: failed to set format {}: {}", format.format_type, e);
                    }
                }
            }
            Err(e) => {
                debug!("write_formats_to_clipboard: GlobalAlloc failed: {}", e);
            }
        }
    }

    let _ = CloseClipboard();
    true
}

fn resolve_format_id(format_type: &str) -> u32 {
    match format_type {
        "CF_TEXT" => 1,
        "CF_BITMAP" => 2,
        "CF_DIB" => 8,
        "CF_UNICODETEXT" => 13,
        "CF_HDROP" => 15,
        "CF_DIBV5" => 17,
        _ => {
            // Custom format — register by name
            let wide: Vec<u16> = format_type.encode_utf16().chain(std::iter::once(0)).collect();
            unsafe { RegisterClipboardFormatW(PCWSTR(wide.as_ptr())) }
        }
    }
}

fn send_ctrl_v() {
    unsafe {
        // Release any modifier keys that may still be physically held from the hotkey
        // (e.g. Shift from Ctrl+Shift+V, or Win from Win+V). If they stay "down",
        // the target app sees Ctrl+Shift+V (paste-as-plain-text) instead of Ctrl+V.
        let held_modifiers = get_held_modifiers();
        let mut inputs: Vec<INPUT> = Vec::new();

        // Release held modifiers first
        for &vk in &held_modifiers {
            inputs.push(make_key_input(vk, true));
        }

        // Ctrl+V press/release
        inputs.push(make_key_input(VK_CONTROL.0, false));
        inputs.push(make_key_input(VK_V.0, false));
        inputs.push(make_key_input(VK_V.0, true));
        inputs.push(make_key_input(VK_CONTROL.0, true));

        // Re-press modifiers so the user doesn't notice a stuck key on release
        for &vk in &held_modifiers {
            inputs.push(make_key_input(vk, false));
        }

        let size = std::mem::size_of::<INPUT>() as i32;
        SendInput(&inputs, size);
    }
}

/// Returns VK codes of modifier keys currently held down (excluding Ctrl, which we send ourselves).
fn get_held_modifiers() -> Vec<u16> {
    let mut held = Vec::new();
    unsafe {
        // High bit set = key is down
        if GetKeyState(VK_SHIFT.0 as i32) < 0 {
            held.push(VK_SHIFT.0);
        }
        if GetKeyState(VK_MENU.0 as i32) < 0 {
            held.push(VK_MENU.0);
        }
        if GetKeyState(VK_LWIN.0 as i32) < 0 {
            held.push(VK_LWIN.0);
        }
    }
    held
}

// Must match the tag in app.rs ll_keyboard_proc so the hook ignores our synthetic keys
const NIB_INJECTED_TAG: usize = 0x4E49425F; // "NIB_"

fn make_key_input(vk: u16, key_up: bool) -> INPUT {
    let flags = if key_up {
        KEYEVENTF_KEYUP
    } else {
        KEYBD_EVENT_FLAGS::default()
    };

    INPUT {
        r#type: INPUT_KEYBOARD,
        Anonymous: windows::Win32::UI::Input::KeyboardAndMouse::INPUT_0 {
            ki: KEYBDINPUT {
                wVk: VIRTUAL_KEY(vk),
                wScan: 0,
                dwFlags: flags,
                time: 0,
                dwExtraInfo: NIB_INJECTED_TAG,
            },
        },
    }
}` },
{ name: 'monitor.rs', language: 'rust', code: `use crate::clipboard::content::process_clipboard_data;
use crate::config::NibConfig;
use crate::storage::db::ClipDatabase;
use crate::toast::{ToastManager, ToastType};
use crate::window::detection::get_foreground_app;
use chrono::Utc;
use log::{debug, error, warn};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Instant;
use windows::Win32::Foundation::{HANDLE, HGLOBAL, HWND, LPARAM, LRESULT, WPARAM};
use windows::Win32::System::DataExchange::{
    AddClipboardFormatListener, CloseClipboard, EnumClipboardFormats, GetClipboardData,
    OpenClipboard, RegisterClipboardFormatW, RemoveClipboardFormatListener,
};
use windows::Win32::System::Memory::{GlobalLock, GlobalSize, GlobalUnlock};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, DispatchMessageW, GetMessageW,
    PostQuitMessage, RegisterClassExW, TranslateMessage, HMENU, HWND_MESSAGE, MSG,
    WINDOW_EX_STYLE, WINDOW_STYLE, WM_CLIPBOARDUPDATE, WM_DESTROY, WNDCLASSEXW,
};
use windows::core::PCWSTR;

struct MonitorState {
    is_self_writing: Arc<AtomicBool>,
    db: Arc<ClipDatabase>,
    config: Arc<std::sync::RwLock<NibConfig>>,
    toast: Arc<Mutex<ToastManager>>,
    last_event_hash: Option<String>,
    last_event_time: Option<Instant>,
}

static mut MONITOR_STATE: Option<*mut MonitorState> = None;

pub struct ClipboardMonitor {
    hwnd: HWND,
    pub is_self_writing: Arc<AtomicBool>,
}

impl ClipboardMonitor {
    pub fn new(
        db: Arc<ClipDatabase>,
        config: Arc<std::sync::RwLock<NibConfig>>,
        toast: Arc<Mutex<ToastManager>>,
    ) -> Option<Self> {
        let is_self_writing = Arc::new(AtomicBool::new(false));

        let state = Box::new(MonitorState {
            is_self_writing: is_self_writing.clone(),
            db,
            config,
            toast,
            last_event_hash: None,
            last_event_time: None,
        });

        unsafe {
            MONITOR_STATE = Some(Box::into_raw(state));
        }

        let hwnd = Self::create_hidden_window()?;

        unsafe {
            if AddClipboardFormatListener(hwnd).is_err() {
                error!("Failed to add clipboard format listener");
                let _ = DestroyWindow(hwnd);
                return None;
            }
        }

        debug!("Clipboard monitor started");

        Some(Self {
            hwnd,
            is_self_writing,
        })
    }

    fn create_hidden_window() -> Option<HWND> {
        unsafe {
            let class_name = wide_string("NibClipboardMonitor");

            let wc = WNDCLASSEXW {
                cbSize: std::mem::size_of::<WNDCLASSEXW>() as u32,
                lpfnWndProc: Some(wnd_proc),
                lpszClassName: PCWSTR(class_name.as_ptr()),
                ..Default::default()
            };

            let atom = RegisterClassExW(&wc);
            if atom == 0 {
                error!("Failed to register clipboard monitor window class");
                return None;
            }

            match CreateWindowExW(
                WINDOW_EX_STYLE::default(),
                PCWSTR(class_name.as_ptr()),
                PCWSTR::null(),
                WINDOW_STYLE::default(),
                0,
                0,
                0,
                0,
                HWND_MESSAGE,
                HMENU::default(),
                None,
                None,
            ) {
                Ok(hwnd) => Some(hwnd),
                Err(e) => {
                    error!("Failed to create clipboard monitor window: {}", e);
                    None
                }
            }
        }
    }

    pub fn run_message_loop(&self) {
        unsafe {
            let mut msg = MSG::default();
            while GetMessageW(&mut msg, self.hwnd, 0, 0).as_bool() {
                let _ = TranslateMessage(&msg);
                DispatchMessageW(&msg);
            }
        }
    }
}

impl Drop for ClipboardMonitor {
    fn drop(&mut self) {
        unsafe {
            let _ = RemoveClipboardFormatListener(self.hwnd);
            let _ = DestroyWindow(self.hwnd);
            if let Some(ptr) = MONITOR_STATE.take() {
                let _ = Box::from_raw(ptr);
            }
        }
    }
}

unsafe extern "system" fn wnd_proc(
    hwnd: HWND,
    msg: u32,
    wparam: WPARAM,
    lparam: LPARAM,
) -> LRESULT {
    match msg {
        WM_CLIPBOARDUPDATE => {
            handle_clipboard_update(hwnd);
            LRESULT(0)
        }
        WM_DESTROY => {
            PostQuitMessage(0);
            LRESULT(0)
        }
        _ => DefWindowProcW(hwnd, msg, wparam, lparam),
    }
}

unsafe fn handle_clipboard_update(hwnd: HWND) {
    let state_ptr = match MONITOR_STATE {
        Some(ptr) => &mut *ptr,
        None => return,
    };

    // Check self-writing flag
    if state_ptr.is_self_writing.load(Ordering::SeqCst) {
        state_ptr.is_self_writing.store(false, Ordering::SeqCst);
        return;
    }

    // Read clipboard formats
    let formats = read_clipboard_formats(hwnd);
    if formats.is_empty() {
        return;
    }

    // Get source app
    let source = match get_foreground_app() {
        Some(s) => s,
        None => return,
    };

    // Get config snapshot
    let config = match state_ptr.config.read() {
        Ok(c) => c.clone(),
        Err(_) => return,
    };

    // Process clipboard data
    let clip = match process_clipboard_data(formats, &source, &config) {
        Some(c) => c,
        None => return,
    };

    // Debounce check
    let now = Instant::now();
    if let (Some(ref last_hash), Some(last_time)) =
        (&state_ptr.last_event_hash, state_ptr.last_event_time)
    {
        if last_hash == &clip.content_hash && now.duration_since(last_time).as_millis() < 100 {
            return;
        }
    }

    state_ptr.last_event_hash = Some(clip.content_hash.clone());
    state_ptr.last_event_time = Some(now);

    // Duplicate detection & insertion
    match state_ptr.db.get_clip_by_hash(&clip.content_hash) {
        Ok(Some(existing)) => {
            if let Some(id) = existing.id {
                if let Err(e) = state_ptr.db.update_clip_timestamp(
                    id,
                    Utc::now(),
                    &clip.source_app,
                    &clip.source_title,
                ) {
                    warn!("Failed to update clip timestamp: {}", e);
                }
            }
        }
        Ok(None) => {
            if let Err(e) = state_ptr.db.insert_clip(&clip, &config) {
                warn!("Failed to insert clip: {}", e);
            }

            // Check if clipboard is full (all clips pinned, over limit)
            if config.max_clips > 0 {
                if let Ok((total, unpinned)) = state_ptr.db.get_clip_count() {
                    if total >= config.max_clips as u64 && unpinned == 0 {
                        if let Ok(mut toast) = state_ptr.toast.lock() {
                            toast.show(
                                ToastType::ClipboardFull,
                                &format!(
                                    "Clipboard full \u{2014} all {} clips are pinned. Unpin or delete a clip to make room for new entries.",
                                    total
                                ),
                            );
                        }
                    }
                }
            }
        }
        Err(e) => {
            warn!("Failed to check for duplicate: {}", e);
        }
    }
}

unsafe fn read_clipboard_formats(hwnd: HWND) -> Vec<(u32, String, Vec<u8>)> {
    let mut formats = Vec::new();

    if OpenClipboard(hwnd).is_err() {
        return formats;
    }

    // Register custom format names
    let rtf_format = register_format("Rich Text Format");
    let html_format = register_format("HTML Format");
    let png_format = register_format("PNG");

    let mut format_id = EnumClipboardFormats(0);
    while format_id != 0 {
        let format_name = get_format_name(format_id, rtf_format, html_format, png_format);

        if is_supported_format(format_id, rtf_format, html_format, png_format) {
            if let Some(data) = read_format_data(format_id) {
                formats.push((format_id, format_name, data));
            }
        }

        format_id = EnumClipboardFormats(format_id);
    }

    let _ = CloseClipboard();
    formats
}

unsafe fn register_format(name: &str) -> u32 {
    let wide = wide_string(name);
    RegisterClipboardFormatW(PCWSTR(wide.as_ptr()))
}

fn is_supported_format(id: u32, rtf: u32, html: u32, png: u32) -> bool {
    // CF_BITMAP (2) is an HBITMAP handle, not a global memory block — calling
    // GlobalLock/GlobalSize on it causes heap corruption. We capture image data
    // via CF_DIB (8), CF_DIBV5 (17), or PNG instead.
    matches!(id, 1 | 8 | 13 | 15 | 17) || id == rtf || id == html || id == png
}

fn get_format_name(id: u32, rtf: u32, html: u32, png: u32) -> String {
    if id == rtf {
        "Rich Text Format".to_string()
    } else if id == html {
        "HTML Format".to_string()
    } else if id == png {
        "PNG".to_string()
    } else {
        match id {
            1 => "CF_TEXT".to_string(),
            2 => "CF_BITMAP".to_string(),
            8 => "CF_DIB".to_string(),
            13 => "CF_UNICODETEXT".to_string(),
            15 => "CF_HDROP".to_string(),
            17 => "CF_DIBV5".to_string(),
            _ => format!("CF_{}", id),
        }
    }
}

unsafe fn read_format_data(format_id: u32) -> Option<Vec<u8>> {
    let handle: HANDLE = GetClipboardData(format_id).ok()?;
    let hglobal = HGLOBAL(handle.0);
    let ptr = GlobalLock(hglobal);
    if ptr.is_null() {
        return None;
    }

    let size = GlobalSize(hglobal);
    if size == 0 {
        let _ = GlobalUnlock(hglobal);
        return None;
    }

    let data = std::slice::from_raw_parts(ptr as *const u8, size).to_vec();
    let _ = GlobalUnlock(hglobal);
    Some(data)
}

fn wide_string(s: &str) -> Vec<u16> {
    s.encode_utf16().chain(std::iter::once(0)).collect()
}` },
]
