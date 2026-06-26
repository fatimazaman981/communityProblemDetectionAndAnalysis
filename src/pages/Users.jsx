import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { BLOCKS } from '../constants'
import { MOCK_USERS } from '../data/mockData'
import Card from '../components/Card'

const PAGE_SIZE = 10

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const delta = 2
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)
  const pages = [1]
  if (left > 2) pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push('...')
  pages.push(total)
  return pages
}

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

function SearchIcon() {
  const { colors: C } = useTheme()
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function StatMini({ label, value, color }) {
  const { colors: C } = useTheme()
  return (
    <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 18px' }}>
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: color ?? C.text, marginTop: 4 }}>
        {value}
      </div>
    </div>
  )
}

function PageBtn({ label, onClick, disabled, active }) {
  const { colors: C } = useTheme()
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: active ? C.primary : 'transparent',
        border: `1px solid ${active ? C.primary : C.border}`,
        color: active ? '#fff' : disabled ? C.textMuted : C.textDim,
        fontFamily: 'Outfit',
        fontSize: 12,
        fontWeight: active ? 700 : 400,
        padding: '5px 10px',
        borderRadius: 6,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.12s',
        minWidth: 34,
      }}
    >
      {label}
    </button>
  )
}

export default function Users() {
  const { colors: C } = useTheme()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [blockFilter, setBlockFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [banStates, setBanStates] = useState(() =>
    Object.fromEntries(MOCK_USERS.map((u) => [u.id, u.status]))
  )

  const filtered = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase())
      const matchBlock = !blockFilter || u.block === blockFilter
      const matchStatus = !statusFilter || banStates[u.id] === statusFilter
      return matchSearch && matchBlock && matchStatus
    })
  }, [search, blockFilter, statusFilter, banStates])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const pageNumbers = getPageNumbers(currentPage, totalPages)
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length)

  const activeCount = Object.values(banStates).filter((s) => s === 'Active').length
  const bannedCount = Object.values(banStates).filter((s) => s === 'Banned').length
  const blockCounts = BLOCKS.map((b) => ({ block: b, count: MOCK_USERS.filter((u) => u.block === b).length }))

  const toggleBan = (id) => {
    setBanStates((prev) => ({ ...prev, [id]: prev[id] === 'Banned' ? 'Active' : 'Banned' }))
  }

  const hasFilters = search || blockFilter || statusFilter

  const INPUT = {
    background: C.surfaceHigh,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    color: C.text,
    fontFamily: 'Outfit',
    fontSize: 13,
    padding: '8px 12px',
    outline: 'none',
    width: '100%',
  }

  const SELECT = { ...INPUT, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: 32 }
  const TH = { fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 12px 12px', textAlign: 'left', whiteSpace: 'nowrap' }
  const TD = { fontSize: 13, color: C.text, padding: '12px', borderTop: `1px solid ${C.border}`, verticalAlign: 'middle' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>User Management</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
          View and manage resident accounts across all blocks
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16 }}>
        <StatMini label="Total Residents" value={MOCK_USERS.length} color={C.purple} />
        <StatMini label="Active" value={activeCount} color={C.green} />
        <StatMini label="Banned" value={bannedCount} color={C.red} />
        {blockCounts.map(({ block, count }) => (
          <StatMini key={block} label={block} value={count} color={C.teal} />
        ))}
      </div>

      {/* Filter bar */}
      <Card>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>

          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              style={{ ...INPUT, paddingLeft: 34 }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={blockFilter}
              onChange={(e) => { setBlockFilter(e.target.value); setPage(1) }}
              style={{ ...SELECT, minWidth: 130 }}
            >
              <option value="">All Blocks</option>
              {BLOCKS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown />
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              style={{ ...SELECT, minWidth: 130 }}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Banned">Banned</option>
            </select>
            <ChevronDown />
          </div>

          <button
            onClick={() => { setSearch(''); setBlockFilter(''); setStatusFilter(''); setPage(1) }}
            disabled={!hasFilters}
            style={{
              background: hasFilters ? C.redGlow : 'transparent',
              border: `1px solid ${hasFilters ? C.red + '44' : C.border}`,
              color: hasFilters ? C.red : C.textMuted,
              fontFamily: 'Outfit',
              fontSize: 12,
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: 8,
              cursor: hasFilters ? 'pointer' : 'default',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            Clear Filters
          </button>

        </div>
      </Card>

      {/* Table */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>All Residents</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
              {filtered.length === 0 ? 'No results' : `Showing ${rangeStart}–${rangeEnd} of ${filtered.length}`}
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Name', 'Block', 'Unit', 'Phone', 'Complaints', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...TD, textAlign: 'center', color: C.textMuted, padding: '32px 12px' }}>
                    No residents match the current filters.
                  </td>
                </tr>
              ) : pageRows.map((u) => {
                const isBanned = banStates[u.id] === 'Banned'
                return (
                  <tr key={u.id}>
                    <td style={TD}>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{u.id}</div>
                    </td>
                    <td style={TD}>{u.block}</td>
                    <td style={TD}>{u.unit}</td>
                    <td style={{ ...TD, color: C.textDim }}>{u.phone}</td>
                    <td style={{ ...TD, color: C.primary, fontWeight: 700 }}>{u.complaintsCount}</td>
                    <td style={TD}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '3px 10px',
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.6px',
                        background: isBanned ? `${C.red}21` : `${C.green}21`,
                        color: isBanned ? C.red : C.green,
                        border: `1px solid ${isBanned ? C.red + '45' : C.green + '45'}`,
                      }}>
                        {banStates[u.id]}
                      </span>
                    </td>
                    <td style={TD}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => navigate(`/dashboard/complaints`)}
                          style={{
                            background: C.primaryGlow,
                            border: `1px solid ${C.primary}44`,
                            color: C.primary,
                            fontFamily: 'Outfit',
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '5px 12px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          View Complaints
                        </button>
                        <button
                          onClick={() => toggleBan(u.id)}
                          style={{
                            background: isBanned ? C.greenGlow : C.redGlow,
                            border: `1px solid ${isBanned ? C.green + '44' : C.red + '44'}`,
                            color: isBanned ? C.green : C.red,
                            fontFamily: 'Outfit',
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '5px 12px',
                            borderRadius: 8,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {isBanned ? 'Unban' : 'Ban'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 12, color: C.textMuted }}>
              Page {currentPage} of {totalPages}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <PageBtn label="← Previous" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} />
              {pageNumbers.map((n, i) =>
                n === '...' ? (
                  <span key={`ellipsis-${i}`} style={{ fontSize: 13, color: C.textMuted, padding: '0 6px' }}>…</span>
                ) : (
                  <PageBtn key={n} label={String(n)} onClick={() => setPage(n)} active={n === currentPage} />
                )
              )}
              <PageBtn label="Next →" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} />
            </div>
          </div>
        )}

      </Card>
    </div>
  )
}
