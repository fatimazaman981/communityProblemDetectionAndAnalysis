import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { CATEGORIES, STATUSES, BLOCKS } from '../constants'
import { useComplaints } from '../hooks/useComplaints'
import Card from '../components/Card'
import ComplaintsTable from '../components/ComplaintsTable'

// ─── Pagination page number generator ─────────────────────────
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

// ─── Chevron icon for selects ──────────────────────────────────
function ChevronDown() {
  const { colors: C } = useTheme()
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={C.textMuted}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ─── Search icon ───────────────────────────────────────────────
function SearchIcon() {
  const { colors: C } = useTheme()
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={C.textMuted}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

// ─── Mini stat card ────────────────────────────────────────────
function StatMini({ label, value, color }) {
  const { colors: C } = useTheme()
  return (
    <div
      style={{
        flex: 1,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: '14px 18px',
      }}
    >
      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: color ?? C.text, marginTop: 4 }}>
        {value}
      </div>
    </div>
  )
}

// ─── Pagination button ─────────────────────────────────────────
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

// ─── Page ─────────────────────────────────────────────────────
export default function Complaints() {
  const navigate = useNavigate()
  const { colors: C } = useTheme()
  const {
    complaints,
    filters,
    setFilter,
    resetFilters,
    page,
    totalPages,
    goToPage,
    total,
    filteredTotal,
    pendingCount,
  } = useComplaints()

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

  const SELECT = {
    ...INPUT,
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    paddingRight: 32,
  }

  const pageNumbers = getPageNumbers(page, totalPages)
  const rangeStart = filteredTotal === 0 ? 0 : (page - 1) * 10 + 1
  const rangeEnd = Math.min(page * 10, filteredTotal)

  const hasActiveFilters = filters.status || filters.category || filters.block || filters.search

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Page header */}
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Complaints</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
          Manage and track all resident complaints
        </div>
      </div>

      {/* Filter bar */}
      <Card>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name or ID…"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              style={{ ...INPUT, paddingLeft: 34 }}
            />
          </div>

          {/* Block dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={filters.block}
              onChange={(e) => setFilter('block', e.target.value)}
              style={{ ...SELECT, minWidth: 130 }}
            >
              <option value="">All Blocks</option>
              {BLOCKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <ChevronDown />
          </div>

          {/* Category dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={filters.category}
              onChange={(e) => setFilter('category', e.target.value)}
              style={{ ...SELECT, minWidth: 148 }}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown />
          </div>

          {/* Status dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={filters.status}
              onChange={(e) => setFilter('status', e.target.value)}
              style={{ ...SELECT, minWidth: 140 }}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown />
          </div>

          {/* Clear filters */}
          <button
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            style={{
              background: hasActiveFilters ? C.redGlow : 'transparent',
              border: `1px solid ${hasActiveFilters ? C.red + '44' : C.border}`,
              color: hasActiveFilters ? C.red : C.textMuted,
              fontFamily: 'Outfit',
              fontSize: 12,
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: 8,
              cursor: hasActiveFilters ? 'pointer' : 'default',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            Clear Filters
          </button>

        </div>
      </Card>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16 }}>
        <StatMini label="Total Complaints" value={total} color={C.purple} />
        <StatMini label="Filtered Results" value={filteredTotal} color={C.primary} />
        <StatMini label="Pending" value={pendingCount} color={C.amber} />
      </div>

      {/* Table + pagination */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>All Complaints</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
              {filteredTotal === 0
                ? 'No results'
                : `Showing ${rangeStart}–${rangeEnd} of ${filteredTotal}`}
            </div>
          </div>
        </div>

        <ComplaintsTable
          complaints={complaints}
          onView={(c) => navigate(`/dashboard/complaints/${c.id}`)}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>

            <span style={{ fontSize: 12, color: C.textMuted }}>
              Page {page} of {totalPages}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <PageBtn label="← Previous" onClick={() => goToPage(page - 1)} disabled={page === 1} />

              {pageNumbers.map((n, i) =>
                n === '...' ? (
                  <span key={`ellipsis-${i}`} style={{ fontSize: 13, color: C.textMuted, padding: '0 6px' }}>…</span>
                ) : (
                  <PageBtn key={n} label={String(n)} onClick={() => goToPage(n)} active={n === page} />
                )
              )}

              <PageBtn label="Next →" onClick={() => goToPage(page + 1)} disabled={page === totalPages} />
            </div>

          </div>
        )}
      </Card>

    </div>
  )
}
