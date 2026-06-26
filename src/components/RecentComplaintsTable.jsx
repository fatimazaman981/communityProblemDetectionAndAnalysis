import { useTheme } from '../context/ThemeContext'
import Badge from './Badge'
import { STATUS_COLOR_MAP } from '../constants'

const COLUMNS = ['ID', 'Resident', 'Block', 'Category', 'Status', 'Date']

export default function RecentComplaintsTable({ complaints, onViewAll, onRowClick }) {
  const { colors: C } = useTheme()

  const TH = {
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 700,
    color: C.textMuted,
    padding: '6px 12px',
    borderBottom: `1px solid ${C.border}`,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    whiteSpace: 'nowrap',
  }

  const TD = {
    padding: '11px 12px',
    fontSize: 13,
    color: C.textDim,
    whiteSpace: 'nowrap',
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Recent Complaints</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Latest submissions from residents</div>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            style={{
              background: C.primaryGlow,
              border: `1px solid ${C.primary}44`,
              color: C.primary,
              fontFamily: 'Outfit',
              fontSize: 12,
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            View All
          </button>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {COLUMNS.map((h) => (
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, i) => (
              <tr
                key={c.id ?? i}
                style={{ cursor: onRowClick ? 'pointer' : 'default', transition: 'background 0.12s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHigh)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                onClick={() => onRowClick?.(c)}
              >
                <td style={{ ...TD, color: C.primary, fontWeight: 600 }}>#{c.id}</td>
                <td style={{ ...TD, color: C.text, fontWeight: 500 }}>{c.resident}</td>
                <td style={TD}>{c.block}</td>
                <td style={TD}>{c.category}</td>
                <td style={TD}>
                  <Badge color={STATUS_COLOR_MAP[c.status] ?? C.textMuted}>{c.status}</Badge>
                </td>
                <td style={{ ...TD, color: C.textMuted, fontSize: 12 }}>{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
