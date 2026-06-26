export default function Sparkline({ data, color, height = 40 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const W = 120
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W
      const y = height - ((v - min) / (max - min + 1)) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  const gradId = `sg-${color.replace('#', '')}`

  return (
    <svg width={W} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts} ${W},${height}`} fill={`url(#${gradId})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
