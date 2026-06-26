import { useTheme } from '../context/ThemeContext'

export default function Card({ children, style = {}, glow }) {
  const { colors: C } = useTheme()
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: 20,
        boxShadow: glow ? `0 0 40px ${glow}` : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
