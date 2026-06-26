import { useTheme } from '../context/ThemeContext'

export default function BarChart({ data, colors, height = 160 }) {
  const { colors: C } = useTheme()
  const max = Math.max(...data.map((d) => d.value))
  const W = 500
  const H = height
  const topPad = 16
  const bottomPad = 20
  const usableH = H - topPad - bottomPad
  const barZoneW = W - 40
  const barW = barZoneW / data.length
  const gap = barW * 0.3
  const rectW = barW - gap

  const getColor = (i) => {
    if (Array.isArray(colors)) return colors[i % colors.length]
    return colors || C.primary
  }

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ overflow: 'visible' }}
    >
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={20}
          y1={topPad + (1 - t) * usableH}
          x2={W - 20}
          y2={topPad + (1 - t) * usableH}
          stroke={C.border}
          strokeWidth="1"
        />
      ))}

      {data.map((d, i) => {
        const color = getColor(i)
        const barH = max > 0 ? (d.value / max) * usableH : 0
        const x = 20 + i * barW + gap / 2
        const y = topPad + usableH - barH

        return (
          <g key={i}>
            <text
              x={x + rectW / 2}
              y={y - 5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={C.textDim}
              fontFamily="Outfit"
            >
              {d.value}
            </text>
            <rect
              x={x}
              y={y}
              width={rectW}
              height={barH}
              rx="5"
              ry="5"
              fill={color}
              opacity="0.85"
            />
            <text
              x={x + rectW / 2}
              y={H - 3}
              textAnchor="middle"
              fontSize="10"
              fill={C.textMuted}
              fontFamily="Outfit"
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
