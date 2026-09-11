import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'haishin-bingo:theme'

function applyThemeClass(theme: Theme) {
  const root = document.documentElement
  if (theme === 'light') {
    root.classList.add('theme-light')
  } else {
    root.classList.remove('theme-light')
  }
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return 'dark'
}

/** ライト/ダークテーマの状態管理。選択結果はlocalStorageに保存し、次回訪問時も維持する。 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyThemeClass(theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
