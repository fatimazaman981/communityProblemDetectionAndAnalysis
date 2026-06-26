import { useTheme } from '../context/ThemeContext'
import Badge from './Badge'
import { STATUS_COLOR_MAP, PRIORITY_COLOR_MAP } from '../constants'

const COLUMNS = ['ID', 'Resident', 'Block', 'Category', 'Status', 'Priority', 'Date', 'Actions']

export default function ComplaintsTable({ complaints, onView }) {
  const { colors: C } = useTheme()

  const TH = {
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 700,
    color: C.textMuted,
    padding: '8px 12px',
    borderBottom: `1px solid ${C.border}`,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    whiteSpace: 'nowrap',
  }

  const TD = {
    padding: '12px 12px',
    fontSize: 13,
    color: C.textDim,
    whiteSpace: 'nowrap',
    borderBottom: `1px solid ${C.border}`,
  }

  if (complaints.length === 0) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: C.textMuted, fontSize: 13 }}>
        No complaints match the current filters.
      </div>
    )
  }

  return (
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
          {complaints.map((c) => (
            <tr
              key={c.id}
              style={{ transition: 'background 0.12s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.surfaceHigh)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ ...TD, color: C.primary, fontWeight: 600 }}>#{c.id}</td>
              <td style={{ ...TD, color: C.text, fontWeight: 500 }}>{c.resident}</td>
              <td style={TD}>{c.block}</td>
              <td style={TD}>{c.category}</td>
              <td style={TD}>
                <Badge color={STATUS_COLOR_MAP[c.status] ?? C.textMuted}>{c.status}</Badge>
              </td>
              <td style={TD}>
                <Badge color={PRIORITY_COLOR_MAP[c.priority] ?? C.textMuted}>{c.priority}</Badge>
              </td>
              <td style={{ ...TD, color: C.textMuted, fontSize: 12 }}>{c.date}</td>
              <td style={{ ...TD, borderBottom: `1px solid ${C.border}` }}>
                <button
                  onClick={() => onView?.(c)}
                  style={{
                    background: C.primaryGlow,
                    border: `1px solid ${C.primary}44`,
                    color: C.primary,
                    fontFamily: 'Outfit',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
