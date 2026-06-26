import { createContext, useContext, useState } from 'react'
import { darkTheme, lightTheme } from '../styles/colors'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('fixify_theme') || 'dark'
  )

  const colors = theme === 'dark' ? darkTheme : lightTheme

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('fixify_theme', next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
