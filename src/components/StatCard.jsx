import { useTheme } from '../context/ThemeContext'
import Card from './Card'
import Sparkline from './Sparkline'

export default function StatCard({ label, value, sub, delta, color, spark, icon }) {
  const { colors: C } = useTheme()
  return (
    <Card glow={color + '18'} style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div
            style={{
              fontSize: 11,
              color: C.textMuted,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 8,
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.text, lineHeight: 1 }}>
            {value}
          </div>
          <div
            style={{
              fontSize: 12,
              color: delta > 0 ? C.green : delta < 0 ? C.red : C.textMuted,
              marginTop: 8,
              fontWeight: 500,
            }}
          >
            {delta > 0 ? '↑' : delta < 0 ? '↓' : ''} {sub}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: color + '22',
              color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
          <Sparkline data={spark} color={color} />
        </div>
      </div>
    </Card>
  )
}
