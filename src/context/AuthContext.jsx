import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('fixify_token')
    return token ? { token } : null
  })

  const login = (data) => {
    localStorage.setItem('fixify_token', data.token)
    setAuth(data)
  }

  const logout = () => {
    localStorage.removeItem('fixify_token')
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
