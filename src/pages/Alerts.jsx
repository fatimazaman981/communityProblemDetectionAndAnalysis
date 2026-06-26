import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { BLOCKS } from '../constants'
import Badge from '../components/Badge'
import { ALL_COMPLAINTS } from '../data/mockData'

function timeAgo(dateStr) {
  const monthMap = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 }
  const [mon, dayRaw, year] = dateStr.split(' ')
  const then = new Date(+year, monthMap[mon], +dayRaw.replace(',', ''))
  const now = new Date(2026, 5, 26)
  const days = Math.round((now - then) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

const dropdownStyle = (C) => ({
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  color: C.text,
  fontFamily: 'Outfit',
  fontSize: 12,
  fontWeight: 500,
  padding: '7px 28px 7px 12px',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748b' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
})

export default function Alerts() {
  const { colors: C } = useTheme()
  const navigate = useNavigate()
  const [block, setBlock] = useState('All Blocks')

  const priorityColor = { Low: C.green, Medium: C.amber, High: C.red, Urgent: C.purple }

  const alerts = ALL_COMPLAINTS
    .filter(c => c.priority === 'High' || c.priority === 'Urgent')
    .filter(c => block === 'All Blocks' || c.block === block)

  const urgentCount = alerts.filter(a => a.priority === 'Urgent').length
  const highCount = alerts.filter(a => a.priority === 'High').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Urgent Alerts</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>
            High and urgent priority complaints requiring immediate attention
          </div>
        </div>
        <select value={block} onChange={e => setBlock(e.target.value)} style={dropdownStyle(C)}>
          <option value="All Blocks">All Blocks</option>
          {BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, color: C.textMuted }}>
          {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
        </span>
        {urgentCount > 0 && <Badge color={C.purple}>{urgentCount} Urgent</Badge>}
        {highCount > 0 && <Badge color={C.red}>{highCount} High</Badge>}
      </div>

      {alerts.length === 0 ? (
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 48,
          textAlign: 'center',
          color: C.textMuted,
          fontSize: 13,
        }}>
          No active alerts for {block === 'All Blocks' ? 'any block' : block}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {alerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              priorityColor={priorityColor[alert.priority]}
              C={C}
              onView={() => navigate(`/dashboard/complaints/${alert.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AlertCard({ alert, priorityColor, C, onView }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${priorityColor}`,
      borderRadius: 16,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 88 }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.textMuted,
          letterSpacing: 0.4,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {alert.id}
        </span>
        <Badge color={priorityColor}>{alert.priority}</Badge>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: C.text,
          marginBottom: 6,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {alert.title}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: C.textDim }}>{alert.block}</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>·</span>
          <span style={{ fontSize: 11, color: C.textDim }}>{alert.category}</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>·</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>{alert.resident}</span>
        </div>
      </div>

      <span style={{ fontSize: 12, color: C.textMuted, whiteSpace: 'nowrap', flexShrink: 0 }}>
        {timeAgo(alert.date)}
      </span>

      <button
        onClick={onView}
        style={{
          background: `${C.primary}22`,
          border: `1px solid ${C.primary}44`,
          color: C.primary,
          fontFamily: 'Outfit',
          fontSize: 12,
          fontWeight: 600,
          padding: '7px 14px',
          borderRadius: 8,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        View Complaint
      </button>
    </div>
  )
}
