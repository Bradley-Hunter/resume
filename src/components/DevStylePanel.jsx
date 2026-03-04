import { useState, useEffect } from 'react'

const STORAGE_KEY = 'dev-style-panel'

const FONTS = [
  { name: 'Inconsolata', value: '"Inconsolata", monospace' },
  { name: 'Fira Code', value: '"Fira Code", monospace' },
  { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { name: 'Source Code Pro', value: '"Source Code Pro", monospace' },
  { name: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace' },
  { name: 'Space Mono', value: '"Space Mono", monospace' },
  { name: 'Roboto Mono', value: '"Roboto Mono", monospace' },
  { name: 'Ubuntu Mono', value: '"Ubuntu Mono", monospace' },
]

const PRIMARY_PRESETS = [
  { name: 'Gold', color: '#d4c88a', dark: '#c6b67d' },
  { name: 'Blue', color: '#3b82f6', dark: '#60a5fa' },
  { name: 'Indigo', color: '#6366f1', dark: '#818cf8' },
  { name: 'Violet', color: '#8b5cf6', dark: '#a78bfa' },
  { name: 'Emerald', color: '#10b981', dark: '#34d399' },
  { name: 'Rose', color: '#f43f5e', dark: '#fb7185' },
  { name: 'Amber', color: '#f59e0b', dark: '#fbbf24' },
]

const DEFAULTS = {
  font: 'Inconsolata',
  scale: 16,
  primaryColor: '#d4c88a',
  primaryDark: '#c6b67d',
  radius: 8,
}

function lightenHex(hex, amount = 0.15) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const lighten = (c) => Math.min(255, Math.round(c + (255 - c) * amount))
  return `#${lighten(r).toString(16).padStart(2, '0')}${lighten(g).toString(16).padStart(2, '0')}${lighten(b).toString(16).padStart(2, '0')}`
}

function applyStyles(settings) {
  const el = document.documentElement
  const font = FONTS.find((f) => f.name === settings.font)
  if (font) el.style.setProperty('--font-mono', font.value)
  el.style.fontSize = `${settings.scale}px`
  el.style.setProperty('--color-primary', settings.primaryColor)
  el.style.setProperty('--color-primary-dark', settings.primaryDark)
  el.style.setProperty('--dev-radius', `${settings.radius}px`)
}

function clearStyles() {
  const el = document.documentElement
  el.style.removeProperty('--font-mono')
  el.style.fontSize = ''
  el.style.removeProperty('--color-primary')
  el.style.removeProperty('--color-primary-dark')
  el.style.removeProperty('--dev-radius')
}

export default function DevStylePanel() {
  const [open, setOpen] = useState(false)
  const [loadedFonts, setLoadedFonts] = useState(new Set(['Inconsolata', 'Ubuntu Mono']))
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : { ...DEFAULTS }
    } catch {
      return { ...DEFAULTS }
    }
  })

  useEffect(() => {
    applyStyles(settings)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }))

  const loadFont = (name) => {
    if (!loadedFonts.has(name)) {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      setLoadedFonts((prev) => new Set([...prev, name]))
    }
  }

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY)
    clearStyles()
    setSettings({ ...DEFAULTS })
  }

  const labelClass = 'text-xs font-semibold text-gray-300 dark:text-gray-400 uppercase tracking-wider mb-1.5'
  const btnBase = 'px-2 py-1 rounded text-xs transition-colors'
  const btnActive = 'bg-primary dark:bg-primary-dark text-white'
  const btnInactive = 'bg-gray-600 dark:bg-gray-800 text-gray-200 dark:text-gray-300 hover:bg-gray-500 dark:hover:bg-gray-700'

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-2.5 rounded-full bg-gray-700 dark:bg-gray-900 border border-gray-500 dark:border-gray-700 text-gray-300 hover:text-white transition-colors shadow-lg"
        title="Dev Style Panel"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-700 dark:bg-gray-900 border border-gray-500 dark:border-gray-700 rounded-xl shadow-lg w-80 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-600 dark:border-gray-800">
        <span className="text-sm font-semibold text-white">Dev Style Panel</span>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="text-xs text-gray-400 hover:text-white transition-colors">
            Reset
          </button>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-3 space-y-4">
        {/* Font Family */}
        <div>
          <p className={labelClass}>Font: {settings.font}</p>
          <div className="flex flex-wrap gap-1.5">
            {FONTS.map((font) => (
              <button
                key={font.name}
                onClick={() => { loadFont(font.name); update('font', font.name) }}
                className={`${btnBase} ${settings.font === font.name ? btnActive : btnInactive}`}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>

        {/* Scale */}
        <div>
          <p className={labelClass}>Scale: {settings.scale}px</p>
          <input
            type="range"
            min="12"
            max="20"
            step="1"
            value={settings.scale}
            onChange={(e) => update('scale', Number(e.target.value))}
            className="w-full accent-primary dark:accent-primary-dark"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>12</span>
            <span>16</span>
            <span>20</span>
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <p className={labelClass}>Primary Color</p>
          <div className="flex flex-wrap gap-1.5 items-center">
            {PRIMARY_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => { update('primaryColor', p.color); update('primaryDark', p.dark) }}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  settings.primaryColor === p.color ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: p.color }}
                title={p.name}
              />
            ))}
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => { update('primaryColor', e.target.value); update('primaryDark', lightenHex(e.target.value)) }}
              className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              title="Custom color"
            />
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <p className={labelClass}>Border Radius: {settings.radius}px</p>
          <input
            type="range"
            min="0"
            max="24"
            step="1"
            value={settings.radius}
            onChange={(e) => update('radius', Number(e.target.value))}
            className="w-full accent-primary dark:accent-primary-dark"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0 (sharp)</span>
            <span>12</span>
            <span>24 (round)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
