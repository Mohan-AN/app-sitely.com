import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'sitely_theme'

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}

function hasBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (!hasBrowserStorage()) return

    const stored = window.localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    } else {
      applyTheme('light')
    }

    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    applyTheme(theme)
    if (hasBrowserStorage() && isHydrated) {
      window.localStorage.setItem(THEME_KEY, theme)
    }
  }, [isHydrated, theme])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
