import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { LABOR_WORKERS, LABOR_SKILLS } from '../data/mockData'

// ─── Skill → accent color ─────────────────────────────────────────────────────
const SKILL_COLORS = {
  'Plumber':        '#6366f1',
  'Electrician':    '#f59e0b',
  'Carpenter':      '#14b8a6',
  'Painter':        '#a855f7',
  'AC Technician':  '#22c55e',
  'Gas Technician': '#ef4444',
  'Pest Control':   '#f97316',
  'General Labor':  '#64748b',
}

// ─── Skill icon SVGs ──────────────────────────────────────────────────────────
const SKILL_ICONS = {
  'Plumber': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  'Electrician': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  'Carpenter': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  'Painter': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 13.5V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3"/><path d="M2 13.5A10 10 0 0 1 12 4a10 10 0 0 1 10 9.5"/>
    </svg>
  ),
  'AC Technician': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
    </svg>
  ),
  'Gas Technician': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  'Pest Control': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
    </svg>
  ),
  'General Labor': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    </svg>
  ),
}

// ─── Blank form template for "Add Worker" ────────────────────────────────────
const BLANK_FORM = {
  name: '',
  skill: LABOR_SKILLS[0],
  phone: '',
  experience: '',
  rating: '',
  jobsDone: '',
  available: true,
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function WorkerModal({ mode, initial, onSave, onClose, C }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())        e.name       = 'Name is required'
    if (!form.phone.trim())       e.phone      = 'Phone is required'
    if (!form.experience.trim())  e.experience = 'Experience is required'
    const r = parseFloat(form.rating)
    if (isNaN(r) || r < 0 || r > 5) e.rating  = 'Rating must be 0 – 5'
    const j = parseInt(form.jobsDone, 10)
    if (isNaN(j) || j < 0)       e.jobsDone   = 'Enter a valid number'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({
      ...form,
      rating:   parseFloat(parseFloat(form.rating).toFixed(1)),
      jobsDone: parseInt(form.jobsDone, 10),
    })
  }

  const INPUT = {
    background: C.surfaceHigh,
    border: `1px solid ${C.border}`,
    borderRadius: 8, color: C.text,
    fontFamily: 'Outfit', fontSize: 13,
    padding: '9px 12px', outline: 'none', width: '100%',
  }
  const LABEL = { fontSize: 11, fontWeight: 600, color: C.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', display: 'block', marginBottom: 6 }
  const ERR   = { fontSize: 11, color: '#ef4444', marginTop: 4 }

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Modal panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 20, padding: 28,
          width: 480, maxWidth: '94vw',
          maxHeight: '90vh', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
            {mode === 'add' ? 'Add New Worker' : 'Edit Worker'}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: C.textMuted, cursor: 'pointer', padding: 4,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Name */}
        <div>
          <label style={LABEL}>Full Name</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Muhammad Waseem" style={INPUT} />
          {errors.name && <div style={ERR}>{errors.name}</div>}
        </div>

        {/* Skill */}
        <div>
          <label style={LABEL}>Skill / Trade</label>
          <div style={{ position: 'relative' }}>
            <select
              value={form.skill}
              onChange={e => set('skill', e.target.value)}
              style={{ ...INPUT, appearance: 'none', WebkitAppearance: 'none', paddingRight: 30, cursor: 'pointer' }}
            >
              {LABOR_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label style={LABEL}>Phone Number</label>
          <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+92 300 1234567" style={INPUT} />
          {errors.phone && <div style={ERR}>{errors.phone}</div>}
        </div>

        {/* Experience */}
        <div>
          <label style={LABEL}>Experience</label>
          <input value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="e.g. 5 yrs" style={INPUT} />
          {errors.experience && <div style={ERR}>{errors.experience}</div>}
        </div>

        {/* Rating + Jobs Done (side by side) */}
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={LABEL}>Rating (0 – 5)</label>
            <input value={form.rating} onChange={e => set('rating', e.target.value)} placeholder="e.g. 4.7" style={INPUT} type="number" min="0" max="5" step="0.1" />
            {errors.rating && <div style={ERR}>{errors.rating}</div>}
          </div>
          <div style={{ flex: 1 }}>
            <label style={LABEL}>Jobs Done</label>
            <input value={form.jobsDone} onChange={e => set('jobsDone', e.target.value)} placeholder="e.g. 120" style={INPUT} type="number" min="0" />
            {errors.jobsDone && <div style={ERR}>{errors.jobsDone}</div>}
          </div>
        </div>

        {/* Available toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Available for assignment</span>
          <button
            onClick={() => set('available', !form.available)}
            style={{
              width: 48, height: 26, borderRadius: 100, border: 'none',
              background: form.available ? '#22c55e' : C.surfaceHigh,
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
            }}
          >
            <span style={{
              position: 'absolute', top: 3,
              left: form.available ? 26 : 4,
              width: 20, height: 20,
              borderRadius: '50%', background: '#fff',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px', borderRadius: 8,
              background: 'transparent', border: `1px solid ${C.border}`,
              color: C.textMuted, fontFamily: 'Outfit', fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 2, padding: '10px', borderRadius: 8,
              background: C.primary, border: 'none',
              color: '#fff', fontFamily: 'Outfit', fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {mode === 'add' ? 'Add Worker' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteConfirm({ worker, onConfirm, onCancel, C }) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.surface,
          border: `1px solid rgba(239,68,68,0.3)`,
          borderRadius: 20, padding: 28,
          width: 380, maxWidth: '94vw',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}
      >
        {/* Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Remove Worker?</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>This cannot be undone.</div>
          </div>
        </div>

        {/* Worker info summary */}
        <div style={{
          background: C.surfaceHigh, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: '12px 14px',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{worker.name}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{worker.skill} · {worker.phone}</div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '10px', borderRadius: 8,
              background: 'transparent', border: `1px solid ${C.border}`,
              color: C.textMuted, fontFamily: 'Outfit', fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Keep Worker
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '10px', borderRadius: 8,
              background: '#ef4444', border: 'none',
              color: '#fff', fontFamily: 'Outfit', fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Single worker card ───────────────────────────────────────────────────────
function WorkerCard({ worker, onToggle, onEdit, onDelete, C }) {
  const color = SKILL_COLORS[worker.skill] ?? C.primary

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${worker.available ? `${color}33` : C.border}`,
      borderRadius: 16,
      padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 14,
      transition: 'border-color 0.2s',
    }}>

      {/* Top row: avatar + name + availability toggle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: `${color}1a`, border: `1.5px solid ${color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color, flexShrink: 0,
          }}>
            {SKILL_ICONS[worker.skill]}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{worker.name}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>ID: {worker.id}</div>
          </div>
        </div>

        <button
          onClick={() => onToggle(worker.id)}
          style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
            background: worker.available ? 'rgba(34,197,94,0.12)' : 'rgba(100,116,139,0.12)',
            border: `1px solid ${worker.available ? 'rgba(34,197,94,0.3)' : 'rgba(100,116,139,0.25)'}`,
            color: worker.available ? '#22c55e' : '#64748b',
            borderRadius: 100, padding: '4px 12px',
            cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
          }}
        >
          {worker.available ? 'Available' : 'Busy'}
        </button>
      </div>

      {/* Skill badge */}
      <div>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
          background: `${color}18`, border: `1px solid ${color}33`,
          color, borderRadius: 100, padding: '3px 12px',
        }}>
          {worker.skill}
        </span>
      </div>

      {/* Stats row: rating, jobs, experience */}
      <div style={{
        display: 'flex',
        background: C.surfaceHigh, border: `1px solid ${C.border}`,
        borderRadius: 10, overflow: 'hidden',
      }}>
        {[
          {
            label: 'Rating',
            value: (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{worker.rating}</span>
              </div>
            ),
          },
          { label: 'Jobs',  value: <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{worker.jobsDone}</span> },
          { label: 'Exp.',  value: <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{worker.experience}</span> },
        ].map(({ label, value }, i) => (
          <div key={label} style={{
            flex: 1, padding: '10px 8px', textAlign: 'center',
            borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
          }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
              {label}
            </div>
            {value}
          </div>
        ))}
      </div>

      {/* Phone */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: C.surfaceHigh, border: `1px solid ${C.border}`,
        borderRadius: 8, padding: '9px 12px',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        <span style={{ fontSize: 13, color: C.text, fontWeight: 600, letterSpacing: 0.3 }}>{worker.phone}</span>
      </div>

      {/* Edit / Delete action row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => onEdit(worker)}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px', borderRadius: 8,
            background: 'transparent', border: `1px solid ${C.border}`,
            color: C.textDim, fontFamily: 'Outfit', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.textDim }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>
        <button
          onClick={() => onDelete(worker)}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px', borderRadius: 8,
            background: 'transparent', border: `1px solid ${C.border}`,
            color: C.textDim, fontFamily: 'Outfit', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.textDim }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          Delete
        </button>
      </div>

    </div>
  )
}

// ─── Helper to generate next worker ID ───────────────────────────────────────
function nextId(workers) {
  const nums = workers.map(w => parseInt(w.id.replace('L-', ''), 10)).filter(n => !isNaN(n))
  const max  = nums.length ? Math.max(...nums) : 0
  return `L-${String(max + 1).padStart(3, '0')}`
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LaborManagement() {
  const { colors: C } = useTheme()

  const [workers,     setWorkers]     = useState(LABOR_WORKERS)
  const [filterSkill, setFilterSkill] = useState('All')
  const [filterAvail, setFilterAvail] = useState('All')
  const [search,      setSearch]      = useState('')

  // modal: null | { mode: 'add' | 'edit', worker: {...} }
  const [modal,        setModal]        = useState(null)
  // deleteTarget: null | worker object
  const [deleteTarget, setDeleteTarget] = useState(null)

  // ── CRUD handlers ──────────────────────────────────────────────────────────

  function handleAdd() {
    setModal({ mode: 'add', worker: { ...BLANK_FORM } })
  }

  function handleEdit(worker) {
    setModal({ mode: 'edit', worker: { ...worker } })
  }

  function handleSave(formData) {
    if (modal.mode === 'add') {
      const newWorker = { ...formData, id: nextId(workers) }
      setWorkers(prev => [...prev, newWorker])
    } else {
      setWorkers(prev => prev.map(w => w.id === formData.id ? formData : w))
    }
    setModal(null)
  }

  function handleDeleteConfirm() {
    setWorkers(prev => prev.filter(w => w.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  function toggleAvailability(id) {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, available: !w.available } : w))
  }

  // ── Derived counts ─────────────────────────────────────────────────────────
  const totalWorkers     = workers.length
  const availableWorkers = workers.filter(w => w.available).length
  const busyWorkers      = workers.filter(w => !w.available).length
  const totalSkills      = LABOR_SKILLS.length

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = workers.filter(w => {
    if (filterSkill !== 'All' && w.skill !== filterSkill) return false
    if (filterAvail === 'Available' && !w.available) return false
    if (filterAvail === 'Busy'      && w.available)  return false
    if (search && !w.name.toLowerCase().includes(search.toLowerCase()) &&
        !w.skill.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const SELECT_STYLE = {
    background: C.surfaceHigh, border: `1px solid ${C.border}`,
    borderRadius: 8, color: C.text, fontFamily: 'Outfit', fontSize: 13,
    padding: '8px 12px', outline: 'none', cursor: 'pointer',
    appearance: 'none', WebkitAppearance: 'none',
    paddingRight: 30, minWidth: 140,
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Labor Management</span>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
                color: C.teal, background: `${C.teal}20`,
                border: `1px solid ${C.teal}44`,
                borderRadius: 100, padding: '2px 10px',
              }}>
                {availableWorkers} AVAILABLE
              </span>
            </div>
            <div style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>
              Manage workers and assign them to resident complaints
            </div>
          </div>

          {/* Add Worker button */}
          <button
            onClick={handleAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.primary, border: 'none',
              color: '#fff', fontFamily: 'Outfit', fontSize: 13, fontWeight: 700,
              borderRadius: 10, padding: '10px 18px', cursor: 'pointer',
              boxShadow: `0 0 16px rgba(99,102,241,0.25)`,
              flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Worker
          </button>
        </div>

        {/* ── Stat cards ── */}
        <div style={{ display: 'flex', gap: 14 }}>
          {[
            { label: 'Total Workers',  value: totalWorkers,     color: C.primary },
            { label: 'Available',      value: availableWorkers, color: C.green   },
            { label: 'Currently Busy', value: busyWorkers,      color: C.amber   },
            { label: 'Skill Types',    value: totalSkills,      color: C.purple  },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, background: C.surface,
              border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 18px',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: stat.color, margin: '8px 0 0' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters row ── */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or skill…"
              style={{
                width: '100%', background: C.surfaceHigh, border: `1px solid ${C.border}`,
                borderRadius: 8, color: C.text, fontFamily: 'Outfit', fontSize: 13,
                padding: '8px 12px 8px 34px', outline: 'none',
              }}
            />
          </div>

          {/* Skill filter */}
          <div style={{ position: 'relative' }}>
            <select value={filterSkill} onChange={e => setFilterSkill(e.target.value)} style={SELECT_STYLE}>
              <option value="All">All Skills</option>
              {LABOR_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          {/* Availability filter */}
          <div style={{ position: 'relative' }}>
            <select value={filterAvail} onChange={e => setFilterAvail(e.target.value)} style={SELECT_STYLE}>
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          <span style={{ fontSize: 12, color: C.textMuted, flexShrink: 0 }}>
            {filtered.length} worker{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Workers grid ── */}
        {filtered.length === 0 ? (
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: 48,
            textAlign: 'center', color: C.textMuted, fontSize: 13,
          }}>
            No workers match the selected filters
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}>
            {filtered.map(worker => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onToggle={toggleAvailability}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                C={C}
              />
            ))}
          </div>
        )}

      </div>

      {/* ── Modals (rendered outside the flow so they overlay everything) ── */}
      {modal && (
        <WorkerModal
          mode={modal.mode}
          initial={modal.worker}
          onSave={handleSave}
          onClose={() => setModal(null)}
          C={C}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          worker={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          C={C}
        />
      )}
    </>
  )
}
