import { createContext, useContext, useEffect, useState } from 'react'

interface DarkModeContextValue {
  darkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextValue | null>(null)

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  // localStorage에서 초기 다크모드 설정을 불러옵니다.
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('backteam-dark-mode')
    return stored === 'true'
  })

  useEffect(() => {
    // 다크모드 상태에 따라 html 요소에 dark 클래스를 토글합니다.
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('backteam-dark-mode', String(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode(): DarkModeContextValue {
  const context = useContext(DarkModeContext)
  if (!context) throw new Error('useDarkMode must be used within DarkModeProvider')
  return context
}
