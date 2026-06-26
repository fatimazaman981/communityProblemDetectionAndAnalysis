import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import Badge from '../components/Badge'
import { FAKE_DETECTION_STATS, FLAGGED_COMPLAINTS } from '../data/mockData'

export default function FakeDetection() {
  const { colors: C } = useTheme()
  const [actions, setActions] = useState({})

  const riskColor = { High: C.red, Medium: C.amber, Low: C.green }
  const confColor = (score) => score >= 85 ? C.red : score >= 70 ? C.amber : C.green

  const markFake = (id) => setActions(prev => ({ ...prev, [id]: 'fake' }))
  const clearItem = (id) => setActions(prev => ({ ...prev, [id]: 'cleared' }))

  const visibleItems = FLAGGED_COMPLAINTS.filter(item => actions[item.id] !== 'cleared')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Fake Detection</span>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.purple,
            background: `${C.purple}22`,
            border: `1px solid ${C.purple}44`,
            borderRadius: 100,
            padding: '2px 9px',
            letterSpacing: 0.6,
          }}>
            AI POWERED
          </span>
        </div>
        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>
          AI-flagged complaints with suspicious patterns or exaggerated severity
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16 }}>
        {FAKE_DETECTION_STATS.map((stat, i) => (
          <div key={i} style={{
            flex: 1,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 20,
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.textMuted,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: stat.color, margin: '10px 0 4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Flagged list */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>
          Flagged Complaints
          <span style={{ fontSize: 12, fontWeight: 400, color: C.textMuted, marginLeft: 8 }}>
            ({visibleItems.length} remaining)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visibleItems.map(item => (
            <FlaggedCard
              key={item.id}
              item={item}
              isFake={actions[item.id] === 'fake'}
              C={C}
              riskColor={riskColor[item.risk]}
              confColor={confColor(item.confidence)}
              onMarkFake={() => markFake(item.id)}
              onClear={() => clearItem(item.id)}
            />
          ))}

          {visibleItems.length === 0 && (
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: 48,
              textAlign: 'center',
              color: C.textMuted,
              fontSize: 13,
            }}>
              All flagged complaints have been reviewed
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FlaggedCard({ item, isFake, C, riskColor, confColor, onMarkFake, onClear }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${isFake ? `${C.red}33` : C.border}`,
      borderRadius: 16,
      padding: '16px 20px',
      opacity: isFake ? 0.72 : 1,
      transition: 'border-color 0.15s, opacity 0.15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: 0.4, fontVariantNumeric: 'tabular-nums' }}>
            {item.id}
          </span>
          <Badge color={riskColor}>{item.risk} Risk</Badge>
          {isFake && <Badge color={C.red}>Marked as Fake</Badge>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{item.resident}</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>·</span>
          <span style={{ fontSize: 12, color: C.textDim }}>{item.block}</span>
        </div>
      </div>

      <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.6, marginBottom: 14 }}>
        {item.text}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.textMuted,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
            }}>
              Fake Confidence
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: confColor }}>{item.confidence}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 5, background: C.surfaceHigh }}>
            <div style={{
              height: '100%',
              width: `${item.confidence}%`,
              borderRadius: 5,
              background: confColor,
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={onMarkFake}
            disabled={isFake}
            style={{
              background: isFake ? C.surfaceHigh : `${C.red}22`,
              border: `1px solid ${isFake ? C.border : `${C.red}44`}`,
              color: isFake ? C.textMuted : C.red,
              fontFamily: 'Outfit',
              fontSize: 12,
              fontWeight: 600,
              padding: '7px 14px',
              borderRadius: 8,
              cursor: isFake ? 'default' : 'pointer',
            }}
          >
            Mark as Fake
          </button>
          <button
            onClick={onClear}
            style={{
              background: `${C.green}22`,
              border: `1px solid ${C.green}44`,
              color: C.green,
              fontFamily: 'Outfit',
              fontSize: 12,
              fontWeight: 600,
              padding: '7px 14px',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
