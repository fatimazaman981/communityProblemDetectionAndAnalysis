import { useTheme } from '../context/ThemeContext'

export default function LineChart({ datasets, labels, height = 140 }) {
  const { colors: C } = useTheme()
  const allVals = datasets.flatMap((d) => d.data)
  const max = Math.max(...allVals) * 1.1
  const min = 0
  const W = 500
  const H = height

  const px = (i) => (i / (labels.length - 1)) * (W - 40) + 20
  const py = (v) => H - 20 - ((v - min) / (max - min)) * (H - 30)

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H + 14}`}
      preserveAspectRatio="none"
      style={{ overflow: 'visible' }}
    >
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={20}
          y1={py(t * (max - min))}
          x2={W - 20}
          y2={py(t * (max - min))}
          stroke={C.border}
          strokeWidth="1"
        />
      ))}

      {labels.map((l, i) => (
        <text
          key={i}
          x={px(i)}
          y={H + 10}
          textAnchor="middle"
          fontSize="10"
          fill={C.textMuted}
          fontFamily="Outfit"
        >
          {l}
        </text>
      ))}

      {datasets.map((ds, di) => {
        const pts = ds.data.map((v, i) => `${px(i)},${py(v)}`).join(' ')
        const areaPoints = [
          `${px(0)},${py(0)}`,
          ...ds.data.map((v, i) => `${px(i)},${py(v)}`),
          `${px(ds.data.length - 1)},${py(0)}`,
        ].join(' ')
        const gradId = `lc-${di}-${ds.color.replace('#', '')}`

        return (
          <g key={di}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ds.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={ds.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={areaPoints} fill={`url(#${gradId})`} />
            <polyline
              points={pts}
              fill="none"
              stroke={ds.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {ds.data.map((v, i) => (
              <circle
                key={i}
                cx={px(i)}
                cy={py(v)}
                r="3.5"
                fill={ds.color}
                stroke={C.surface}
                strokeWidth="2"
              />
            ))}
          </g>
        )
      })}
    </svg>
  )
}
