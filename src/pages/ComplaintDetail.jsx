import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { STATUSES, PRIORITIES, STATUS_COLOR_MAP, PRIORITY_COLOR_MAP } from '../constants'
import { ALL_COMPLAINTS, COMPLAINT_DETAILS, LABOR_WORKERS, LABOR_SKILLS } from '../data/mockData'
import Card from '../components/Card'
import Badge from '../components/Badge'

// Maps complaint category → most relevant labor skill for the default suggestion
const CATEGORY_TO_SKILL = {
  'Water Supply': 'Plumber',
  'Electricity':  'Electrician',
  'Sanitation':   'General Labor',
  'Security':     'General Labor',
  'Road Damage':  'General Labor',
  'Other':        'General Labor',
}

// ─── Helpers (no C dependency) ────────────────────────────────

function fmtNow() {
  return new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fakeScoreColor(score, C) {
  if (score >= 80) return C.green
  if (score >= 50) return C.amber
  return C.red
}

function buildFallback(base) {
  const blockLetter = base.block.replace('Block ', '')
  const unitNum = String(((blockLetter.charCodeAt(0) * 7) % 20) + 1).padStart(2, '0')

  const descMap = {
    'Water Supply': 'Residents in this block are reporting inconsistent water supply with zero pressure on upper floors. The distribution pipeline shows signs of blockage and the overhead tank has not filled completely in several days. Multiple families including those with elderly members are severely affected by the shortage.',
    'Electricity':  'Power outages lasting several hours are recurring daily in this block. The electrical distribution panel shows signs of overloading and residents have reported equipment damage during restoration surges. The backup generator for common areas is also non-functional due to a maintenance backlog.',
    'Sanitation':   'Garbage collection has not been carried out for over a week in this block. Bins near multiple entrances are overflowing and a foul odor is affecting ground-floor residents. The sanitation helpline has been contacted multiple times without any follow-up or confirmation of scheduled service.',
    'Security':     'Unauthorized individuals were spotted near the block perimeter during nighttime hours on multiple occasions. A section of the boundary wall has deteriorated and the CCTV camera covering this area is offline. The security guard post near this location is unmanned after midnight on weeknights.',
    'Road Damage':  'Multiple large potholes have developed on the internal service road following recent heavy rainfall. Vehicles risk suspension damage and a resident sustained minor injuries in an incident near the speed breaker. A repair request submitted to the maintenance team has not been acted upon in two weeks.',
    'Other':        'Ongoing disruption has been reported in this block affecting residents quality of life. The issue has been raised previously through informal channels without resolution and now requires formal administrative action and a scheduled site inspection.',
  }

  const statusTimeline = {
    Pending: [
      { type: 'status', from: null, to: 'Pending', at: `${base.date} · 10:22 AM`, by: 'System' },
    ],
    'In Progress': [
      { type: 'status', from: null,      to: 'Pending',     at: `${base.date} · 10:22 AM`, by: 'System' },
      { type: 'status', from: 'Pending', to: 'In Progress', at: `${base.date} · 02:15 PM`, by: 'Admin' },
    ],
    Resolved: [
      { type: 'status', from: null,          to: 'Pending',     at: `${base.date} · 10:22 AM`, by: 'System' },
      { type: 'status', from: 'Pending',     to: 'In Progress', at: `${base.date} · 02:15 PM`, by: 'Admin' },
      { type: 'note',   text: 'Issue inspected and confirmed on site. Repair team deployed.', at: `${base.date} · 03:00 PM`, by: 'Admin' },
      { type: 'status', from: 'In Progress', to: 'Resolved',    at: `${base.date} · 05:45 PM`, by: 'Admin' },
    ],
    Rejected: [
      { type: 'status', from: null,      to: 'Pending',  at: `${base.date} · 10:22 AM`, by: 'System' },
      { type: 'note',   text: 'Complaint reviewed. Insufficient evidence provided. Resident contacted for additional details.', at: `${base.date} · 12:00 PM`, by: 'Admin' },
      { type: 'status', from: 'Pending', to: 'Rejected', at: `${base.date} · 12:05 PM`, by: 'Admin' },
    ],
  }

  return {
    title: `${base.category} issue reported in ${base.block}`,
    description: descMap[base.category] ?? descMap['Other'],
    photo: null,
    location: {
      address: `${base.block}, Internal Road, Green Acres Housing Society`,
      lat: '33.6844',
      lng: '73.0479',
    },
    unit: `${blockLetter}-${unitNum}`,
    phone: '+92 300 0000000',
    submittedAt: `${base.date} · 10:22 AM`,
    ai: {
      fakeScore: 82,
      similar: [
        { id: 'C-1030', desc: `${base.category} complaint in adjacent block — same pattern` },
        { id: 'C-1026', desc: `Recurring ${base.category.toLowerCase()} issue — third report this month` },
      ],
    },
    timeline: statusTimeline[base.status] ?? statusTimeline['Pending'],
  }
}

// ─── Sub-components ────────────────────────────────────────────

function SectionLabel({ children }) {
  const { colors: C } = useTheme()
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 600,
      color: C.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      marginBottom: 6,
    }}>
      {children}
    </div>
  )
}

function Divider() {
  const { colors: C } = useTheme()
  return <div style={{ height: 1, background: C.border, margin: '18px 0' }} />
}

function ChevronDown() {
  const { colors: C } = useTheme()
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke={C.textMuted} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function PinIcon() {
  const { colors: C } = useTheme()
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function TimelineEntry({ entry, isLast }) {
  const { colors: C } = useTheme()
  let dotColor = C.textMuted
  let label = null

  if (entry.type === 'status') {
    dotColor = STATUS_COLOR_MAP[entry.to] ?? C.textMuted
    label = entry.from
      ? `Status changed from "${entry.from}" to "${entry.to}"`
      : 'Complaint submitted'
  } else if (entry.type === 'priority') {
    dotColor = PRIORITY_COLOR_MAP[entry.to] ?? C.textMuted
    label = `Priority changed from "${entry.from}" to "${entry.to}"`
  } else if (entry.type === 'note') {
    dotColor = C.teal
  }

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flexShrink: 0 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: dotColor,
          border: `2px solid ${C.surface}`,
          flexShrink: 0, marginTop: 2,
        }} />
        {!isLast && (
          <div style={{ width: 2, flex: 1, background: C.border, minHeight: 18, marginTop: 3 }} />
        )}
      </div>

      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 14 }}>
        {entry.type === 'note' ? (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, marginBottom: 3, letterSpacing: '0.4px' }}>
              Internal Note
            </div>
            <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.55, fontStyle: 'italic' }}>
              "{entry.text}"
            </div>
          </>
        ) : (
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.4 }}>{label}</div>
        )}
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
          {entry.at} · {entry.by}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────

export default function ComplaintDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { colors: C } = useTheme()

  const INPUT_STYLE = {
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

  const SELECT_STYLE = {
    ...INPUT_STYLE,
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    paddingRight: 32,
  }

  const base = ALL_COMPLAINTS.find(c => c.id === id) ?? null
  const detail = useMemo(
    () => (base ? (COMPLAINT_DETAILS[id] ?? buildFallback(base)) : null),
    [base, id],
  )

  const [status, setStatus]                   = useState(base?.status   ?? 'Pending')
  const [priority, setPriority]               = useState(base?.priority ?? 'Low')
  const [committedStatus, setCommittedStatus] = useState(base?.status   ?? 'Pending')
  const [committedPriority, setCommittedPriority] = useState(base?.priority ?? 'Low')
  const [timeline, setTimeline]               = useState(() => detail?.timeline ?? [])
  const [noteInput, setNoteInput]             = useState('')
  const [savedFlash, setSavedFlash]           = useState(false)

  // Labor assignment state
  const suggestedSkill = CATEGORY_TO_SKILL[base?.category] ?? 'General Labor'
  const [laborSkill, setLaborSkill]         = useState(suggestedSkill)
  const [selectedWorkerId, setSelectedWorkerId] = useState('')
  const [assignedWorker, setAssignedWorker] = useState(null)
  const [assignFlash, setAssignFlash]       = useState(false)

  // Workers filtered by chosen skill who are currently available
  const availableForSkill = LABOR_WORKERS.filter(
    w => w.skill === laborSkill && w.available
  )

  useEffect(() => {
    if (!base || !detail) return
    setStatus(base.status)
    setPriority(base.priority)
    setCommittedStatus(base.status)
    setCommittedPriority(base.priority)
    setTimeline(detail.timeline)
    setNoteInput('')
    setSavedFlash(false)
    // Reset labor assignment when navigating to a new complaint
    const skill = CATEGORY_TO_SKILL[base.category] ?? 'General Labor'
    setLaborSkill(skill)
    setSelectedWorkerId('')
    setAssignedWorker(null)
    setAssignFlash(false)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!base || !detail) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Complaint not found</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 4 }}>
          No complaint with ID <span style={{ color: C.primary, fontWeight: 600 }}>{id}</span> exists.
        </div>
        <button
          onClick={() => navigate('/dashboard/complaints')}
          style={{
            background: C.primaryGlow, border: `1px solid ${C.primary}44`,
            color: C.primary, fontFamily: 'Outfit', fontSize: 13, fontWeight: 600,
            padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
          }}
        >
          ← Back to Complaints
        </button>
      </div>
    )
  }

  function handleSave() {
    const changes = []
    if (status !== committedStatus) {
      changes.push({ type: 'status', from: committedStatus, to: status, at: fmtNow(), by: 'Admin' })
      setCommittedStatus(status)
    }
    if (priority !== committedPriority) {
      changes.push({ type: 'priority', from: committedPriority, to: priority, at: fmtNow(), by: 'Admin' })
      setCommittedPriority(priority)
    }
    if (changes.length) setTimeline(prev => [...prev, ...changes])
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
  }

  function handleAddNote() {
    if (!noteInput.trim()) return
    setTimeline(prev => [
      ...prev,
      { type: 'note', text: noteInput.trim(), at: fmtNow(), by: 'Admin' },
    ])
    setNoteInput('')
  }

  function handleAssignLabor() {
    if (!selectedWorkerId) return
    const worker = LABOR_WORKERS.find(w => w.id === selectedWorkerId)
    if (!worker) return
    setAssignedWorker(worker)
    // Add a timeline entry so the assignment is part of the audit trail
    setTimeline(prev => [
      ...prev,
      {
        type: 'note',
        text: `Labor assigned — ${worker.name} (${worker.skill}) · ${worker.phone}`,
        at: fmtNow(),
        by: 'Admin',
      },
    ])
    setAssignFlash(true)
    setTimeout(() => setAssignFlash(false), 2500)
  }

  const scoreColor = fakeScoreColor(detail.ai.fakeScore, C)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Header row ────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/dashboard/complaints')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: C.surfaceHigh, border: `1px solid ${C.border}`,
            color: C.textDim, fontFamily: 'Outfit', fontSize: 12, fontWeight: 600,
            padding: '7px 14px', borderRadius: 8, cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.primary + '44' }}
          onMouseLeave={e => { e.currentTarget.style.color = C.textDim; e.currentTarget.style.borderColor = C.border }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Complaints
        </button>

        <div style={{ width: 1, height: 20, background: C.border }} />

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, minWidth: 0 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.primary, flexShrink: 0 }}>{id}</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {detail.title}
          </span>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────── */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* ── LEFT COLUMN ───────────────────────────────────────── */}
        <div style={{ flex: 13, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Complaint Info Card */}
          <Card>
            <SectionLabel>Description</SectionLabel>
            <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.75, margin: 0 }}>
              {detail.description}
            </p>

            <Divider />

            <SectionLabel>Photo</SectionLabel>
            {detail.photo ? (
              <img
                src={detail.photo}
                alt="Complaint photo"
                style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }}
              />
            ) : (
              <div style={{
                background: C.surfaceHigh,
                border: `1px dashed ${C.border}`,
                borderRadius: 10,
                padding: '36px 20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 500 }}>No photo attached</span>
              </div>
            )}

            <Divider />

            <SectionLabel>Location</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <PinIcon />
                <span style={{ fontSize: 13, color: C.text, lineHeight: 1.55 }}>
                  {detail.location.address}
                </span>
              </div>
              <div style={{
                display: 'inline-flex', gap: 0,
                background: C.surfaceHigh,
                border: `1px solid ${C.border}`,
                borderRadius: 8, overflow: 'hidden',
                alignSelf: 'flex-start',
              }}>
                <div style={{ padding: '8px 14px', fontSize: 12, borderRight: `1px solid ${C.border}` }}>
                  <span style={{ color: C.textMuted }}>Lat </span>
                  <span style={{ color: C.textDim, fontWeight: 700 }}>{detail.location.lat}</span>
                </div>
                <div style={{ padding: '8px 14px', fontSize: 12 }}>
                  <span style={{ color: C.textMuted }}>Lng </span>
                  <span style={{ color: C.textDim, fontWeight: 700 }}>{detail.location.lng}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Resident Info Card */}
          <Card>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 18 }}>
              Resident Information
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {[
                { label: 'Name',  value: base.resident  },
                { label: 'Block', value: base.block     },
                { label: 'Unit',  value: detail.unit    },
                { label: 'Phone', value: detail.phone   },
              ].map(({ label, value }) => (
                <div key={label}>
                  <SectionLabel>{label}</SectionLabel>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>

            <Divider />

            <div>
              <SectionLabel>Submitted</SectionLabel>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{detail.submittedAt}</div>
            </div>
          </Card>

        </div>

        {/* ── RIGHT COLUMN (sticky) ─────────────────────────────── */}
        <div style={{
          flex: 7, minWidth: 0,
          position: 'sticky', top: 0,
          display: 'flex', flexDirection: 'column', gap: 16,
          maxHeight: 'calc(100vh - 80px)', overflowY: 'auto',
          paddingBottom: 4,
          scrollbarWidth: 'thin',
        }}>

          {/* ── Status & Priority Card ── */}
          <Card>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>
              Status &amp; Priority
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <SectionLabel>Status</SectionLabel>
                  <Badge color={STATUS_COLOR_MAP[status]}>{status}</Badge>
                </div>
                <div style={{ position: 'relative' }}>
                  <select value={status} onChange={e => setStatus(e.target.value)} style={SELECT_STYLE}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <SectionLabel>Priority</SectionLabel>
                  <Badge color={PRIORITY_COLOR_MAP[priority]}>{priority}</Badge>
                </div>
                <div style={{ position: 'relative' }}>
                  <select value={priority} onChange={e => setPriority(e.target.value)} style={SELECT_STYLE}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown />
                </div>
              </div>

              <button
                onClick={handleSave}
                style={{
                  background: savedFlash ? C.green : C.primary,
                  border: 'none', color: '#fff',
                  fontFamily: 'Outfit', fontSize: 13, fontWeight: 700,
                  padding: '10px', borderRadius: 8, cursor: 'pointer',
                  marginTop: 2, transition: 'background 0.25s',
                }}
              >
                {savedFlash ? '✓ Saved' : 'Save Changes'}
              </button>

            </div>
          </Card>

          {/* ── AI Insights Card ── */}
          <Card>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>
              AI Insights
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <SectionLabel>Authenticity Score</SectionLabel>
                <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor }}>
                  {detail.ai.fakeScore}%
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 100, background: C.surfaceHigh, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${detail.ai.fakeScore}%`,
                  borderRadius: 100,
                  background: scoreColor,
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>
                {detail.ai.fakeScore >= 80
                  ? 'Likely genuine — high confidence'
                  : detail.ai.fakeScore >= 50
                    ? 'Moderate confidence — manual review recommended'
                    : 'Low confidence — possible fabrication'}
              </div>
            </div>

            <div>
              <SectionLabel>Similar Complaints</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {detail.ai.similar.map(s => (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/dashboard/complaints/${s.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: C.surfaceHigh, border: `1px solid ${C.border}`,
                      borderRadius: 8, padding: '9px 12px', cursor: 'pointer',
                      textAlign: 'left', width: '100%', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary + '44' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.primary, flexShrink: 0 }}>
                      {s.id}
                    </span>
                    <span style={{ fontSize: 12, color: C.textDim, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.desc}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* ── Assign Labor Card ── */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Assign Labor</div>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 0.6,
                color: C.teal, background: `${C.teal}20`,
                border: `1px solid ${C.teal}44`,
                borderRadius: 100, padding: '2px 8px',
              }}>
                WORKER DISPATCH
              </span>
            </div>

            {/* If a worker is already assigned, show their contact card */}
            {assignedWorker ? (
              <div style={{
                background: `${C.green}10`,
                border: `1px solid ${C.green}33`,
                borderRadius: 12, padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                {/* Success header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>
                    {assignFlash ? 'Worker Assigned!' : 'Assigned Worker'}
                  </span>
                </div>

                {/* Worker info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: `${C.teal}20`, border: `1.5px solid ${C.teal}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{assignedWorker.name}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>
                      {assignedWorker.skill} · {assignedWorker.experience}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>Rating</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.amber }}>{assignedWorker.rating} ★</div>
                  </div>
                </div>

                {/* Contact info — this is what the resident sees */}
                <div style={{
                  background: C.surfaceHigh,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8, padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                      Contact (Shared with Resident)
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginTop: 2 }}>
                      {assignedWorker.phone}
                    </div>
                  </div>
                </div>

                {/* Re-assign button */}
                <button
                  onClick={() => { setAssignedWorker(null); setSelectedWorkerId('') }}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${C.border}`,
                    color: C.textMuted,
                    fontFamily: 'Outfit', fontSize: 12, fontWeight: 600,
                    padding: '7px', borderRadius: 8,
                    cursor: 'pointer', width: '100%',
                  }}
                >
                  Re-assign Worker
                </button>
              </div>
            ) : (
              /* Assignment form — skill picker → worker picker → assign button */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Skill dropdown */}
                <div>
                  <SectionLabel>Skill Required</SectionLabel>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={laborSkill}
                      onChange={e => { setLaborSkill(e.target.value); setSelectedWorkerId('') }}
                      style={{
                        ...SELECT_STYLE, width: '100%',
                        borderColor: `${C.teal}44`,
                      }}
                    >
                      {LABOR_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown />
                  </div>
                </div>

                {/* Worker dropdown — only shows available workers for selected skill */}
                <div>
                  <SectionLabel>
                    Available Workers
                    <span style={{ color: availableForSkill.length > 0 ? C.green : C.red, marginLeft: 6, fontWeight: 700 }}>
                      ({availableForSkill.length})
                    </span>
                  </SectionLabel>
                  {availableForSkill.length === 0 ? (
                    <div style={{
                      background: `${C.red}10`, border: `1px solid ${C.red}22`,
                      borderRadius: 8, padding: '10px 12px',
                      fontSize: 12, color: C.red,
                    }}>
                      No {laborSkill}s available right now
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <select
                        value={selectedWorkerId}
                        onChange={e => setSelectedWorkerId(e.target.value)}
                        style={{ ...SELECT_STYLE, width: '100%' }}
                      >
                        <option value="">Select worker…</option>
                        {availableForSkill.map(w => (
                          <option key={w.id} value={w.id}>
                            {w.name} · ★{w.rating} · {w.experience}
                          </option>
                        ))}
                      </select>
                      <ChevronDown />
                    </div>
                  )}
                </div>

                {/* Show selected worker preview */}
                {selectedWorkerId && (() => {
                  const w = LABOR_WORKERS.find(x => x.id === selectedWorkerId)
                  return w ? (
                    <div style={{
                      background: C.surfaceHigh, border: `1px solid ${C.border}`,
                      borderRadius: 8, padding: '10px 12px',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{w.phone}</span>
                    </div>
                  ) : null
                })()}

                {/* Assign button */}
                <button
                  onClick={handleAssignLabor}
                  disabled={!selectedWorkerId}
                  style={{
                    background: selectedWorkerId ? C.teal : 'transparent',
                    border: `1px solid ${selectedWorkerId ? C.teal : C.border}`,
                    color: selectedWorkerId ? '#fff' : C.textMuted,
                    fontFamily: 'Outfit', fontSize: 13, fontWeight: 700,
                    padding: '10px', borderRadius: 8,
                    cursor: selectedWorkerId ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  Assign Worker
                </button>
              </div>
            )}
          </Card>

          {/* ── Activity Timeline Card ── */}
          <Card>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>
              Activity Timeline
            </div>

            <div>
              {timeline.map((entry, i) => (
                <TimelineEntry key={i} entry={entry} isLast={i === timeline.length - 1} />
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 4 }}>
              <SectionLabel>Add Internal Note</SectionLabel>
              <textarea
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                placeholder="Write a note for the team…"
                rows={3}
                style={{
                  ...INPUT_STYLE,
                  resize: 'vertical',
                  minHeight: 72,
                  lineHeight: 1.55,
                  display: 'block',
                }}
              />
              <button
                onClick={handleAddNote}
                disabled={!noteInput.trim()}
                style={{
                  marginTop: 8,
                  background: noteInput.trim() ? C.tealGlow : 'transparent',
                  border: `1px solid ${noteInput.trim() ? C.teal + '44' : C.border}`,
                  color: noteInput.trim() ? C.teal : C.textMuted,
                  fontFamily: 'Outfit', fontSize: 12, fontWeight: 600,
                  padding: '8px 14px', borderRadius: 8,
                  cursor: noteInput.trim() ? 'pointer' : 'default',
                  width: '100%', transition: 'all 0.15s',
                }}
              >
                Add Note
              </button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
