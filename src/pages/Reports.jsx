import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { BLOCKS, CATEGORIES, STATUS_COLOR_MAP } from '../constants'
import { REPORT_PREVIEW } from '../data/mockData'
import Card from '../components/Card'

const REPORT_TYPES = ['Complaint Summary', 'Resolution Rate', 'Pending Only']

function ChevronDown() {
  const { colors: C } = useTheme()
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function StatusBadge({ status }) {
  const { colors: C } = useTheme()
  const color = STATUS_COLOR_MAP[status] ?? C.textDim
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: 100,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.6px',
      background: color + '21',
      color,
      border: `1px solid ${color}45`,
    }}>
      {status}
    </span>
  )
}

export default function Reports() {
  const { colors: C } = useTheme()

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [blockFilter, setBlockFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [reportType, setReportType] = useState('Complaint Summary')
  const [format, setFormat] = useState('PDF')
  const [preview, setPreview] = useState(null)
  const [activeType, setActiveType] = useState('')
  const [toast, setToast] = useState(false)

  const generateReport = () => {
    setPreview(REPORT_PREVIEW[reportType])
    setActiveType(reportType)
  }

  const showToast = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  const INPUT = {
    background: C.surfaceHigh,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    color: C.text,
    fontFamily: 'Outfit',
    fontSize: 13,
    padding: '8px 12px',
    outline: 'none',
    colorScheme: 'dark',
    width: '100%',
  }

  const SELECT = { ...INPUT, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: 32 }
  const LABEL = { fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6, display: 'block' }
  const TH = { fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 12px 12px', textAlign: 'left', whiteSpace: 'nowrap' }
  const TD = { fontSize: 13, color: C.text, padding: '12px', borderTop: `1px solid ${C.border}`, verticalAlign: 'middle' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Reports</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
          Generate and export complaint reports by block, category, and date range
        </div>
      </div>

      {/* Filter form */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 20 }}>Report Filters</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>

          <div>
            <label style={LABEL}>From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={INPUT}
            />
          </div>

          <div>
            <label style={LABEL}>To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={INPUT}
            />
          </div>

          <div>
            <label style={LABEL}>Block</label>
            <div style={{ position: 'relative' }}>
              <select value={blockFilter} onChange={(e) => setBlockFilter(e.target.value)} style={SELECT}>
                <option value="">All Blocks</option>
                {BLOCKS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown />
            </div>
          </div>

          <div>
            <label style={LABEL}>Category</label>
            <div style={{ position: 'relative' }}>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={SELECT}>
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown />
            </div>
          </div>

          <div>
            <label style={LABEL}>Report Type</label>
            <div style={{ position: 'relative' }}>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} style={SELECT}>
                {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown />
            </div>
          </div>

          <div>
            <label style={LABEL}>Export Format</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['PDF', 'Excel'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 8,
                    fontFamily: 'Outfit',
                    fontSize: 13,
                    fontWeight: format === f ? 700 : 400,
                    cursor: 'pointer',
                    background: format === f ? C.primaryGlow : 'transparent',
                    border: `1px solid ${format === f ? C.primary : C.border}`,
                    color: format === f ? C.primary : C.textDim,
                    transition: 'all 0.15s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

        </div>

        <button
          onClick={generateReport}
          style={{
            background: C.primary,
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontFamily: 'Outfit',
            fontSize: 13,
            fontWeight: 700,
            padding: '10px 24px',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Generate Report
        </button>
      </Card>

      {/* Preview table */}
      {preview && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{activeType} — Preview</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                {blockFilter || 'All Blocks'} · {categoryFilter || 'All Categories'} · Format: {format}
              </div>
            </div>
            <button
              onClick={showToast}
              style={{
                background: C.primaryGlow,
                border: `1px solid ${C.primary}44`,
                color: C.primary,
                fontFamily: 'Outfit',
                fontSize: 12,
                fontWeight: 700,
                padding: '8px 18px',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              ↓ Download {format}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {activeType !== 'Resolution Rate' ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['ID', 'Title', 'Block', 'Category', 'Status', 'Date'].map((h) => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row) => (
                    <tr key={row.id}>
                      <td style={{ ...TD, color: C.textMuted }}>{row.id}</td>
                      <td style={{ ...TD, maxWidth: 320 }}>{row.title}</td>
                      <td style={TD}>{row.block}</td>
                      <td style={TD}>{row.category}</td>
                      <td style={TD}><StatusBadge status={row.status} /></td>
                      <td style={{ ...TD, color: C.textDim, whiteSpace: 'nowrap' }}>{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Block', 'Total Complaints', 'Resolved', 'Pending', 'Resolution Rate'].map((h) => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row) => (
                    <tr key={row.block}>
                      <td style={TD}>{row.block}</td>
                      <td style={TD}>{row.total}</td>
                      <td style={{ ...TD, color: C.green, fontWeight: 600 }}>{row.resolved}</td>
                      <td style={{ ...TD, color: C.amber, fontWeight: 600 }}>{row.pending}</td>
                      <td style={{ ...TD, color: C.primary, fontWeight: 700 }}>{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          background: C.surfaceHigh,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: '14px 20px',
          color: C.text,
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          transition: 'opacity 0.2s',
        }}>
          <span style={{ color: C.amber }}>⚠</span>
          Download available when backend is connected
        </div>
      )}

    </div>
  )
}
