import { useTheme } from '../context/ThemeContext'

export default function DonutChart({ slices, size = 100 }) {
  const { colors: C } = useTheme()
  const total = slices.reduce((a, s) => a + s.value, 0)
  const r = 38
  const cx = 50
  const cy = 50
  const circ = 2 * Math.PI * r

  let accumulated = 0
  const segments = slices.map((s) => {
    const pct = s.value / total
    const dash = pct * circ
    const gap = circ - dash
    const rotate = accumulated * 360 - 90
    accumulated += pct
    return { ...s, dash, gap, rotate }
  })

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.surfaceHigh} strokeWidth="12" />
      {segments.map((s, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth="12"
          strokeDasharray={`${s.dash} ${s.gap}`}
          transform={`rotate(${s.rotate} ${cx} ${cy})`}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  )
}
