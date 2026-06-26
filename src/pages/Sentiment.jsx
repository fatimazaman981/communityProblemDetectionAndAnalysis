import { useTheme } from '../context/ThemeContext'
import Card from '../components/Card'
import Badge from '../components/Badge'
import DonutChart from '../components/DonutChart'
import LineChart from '../components/LineChart'
import {
  SENTIMENT_STATS,
  SENTIMENT_SLICES,
  SENTIMENT_TREND_LABELS,
  SENTIMENT_TREND_DATASETS,
  FEEDBACK_FEED,
} from '../data/mockData'

export default function Sentiment() {
  const { colors: C } = useTheme()

  const sentimentColor = { Positive: C.green, Neutral: C.amber, Negative: C.red }
  const total = SENTIMENT_SLICES.reduce((a, s) => a + s.value, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Sentiment & Feedback</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>
          Resident sentiment analysis and feedback over the last 7 days
        </div>
      </div>

      {/* Aggregate stats */}
      <div style={{ display: 'flex', gap: 16 }}>
        {SENTIMENT_STATS.map((stat, i) => (
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
            <div style={{ fontSize: 36, fontWeight: 700, color: stat.color, margin: '10px 0 6px', letterSpacing: -0.5 }}>
              {stat.value}%
            </div>
            <div style={{ fontSize: 11, color: stat.delta > 0 ? C.green : stat.delta < 0 ? C.red : C.textMuted }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'flex', gap: 16 }}>
        <Card style={{ flex: 2 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            Sentiment Distribution
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 20 }}>Last 7 days</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <DonutChart slices={SENTIMENT_SLICES} size={120} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              {SENTIMENT_SLICES.map((s, i) => {
                const pct = Math.round((s.value / total) * 100)
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: C.textDim }}>{s.label}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 4, background: C.surfaceHigh }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: s.color, opacity: 0.8 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        <Card style={{ flex: 3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Sentiment Trend</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Percentage by day — last 7 days</div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {SENTIMENT_TREND_DATASETS.map((ds, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.textDim }}>
                  <div style={{ width: 20, height: 2.5, background: ds.color, borderRadius: 2 }} />
                  {ds.label}
                </div>
              ))}
            </div>
          </div>
          <LineChart labels={SENTIMENT_TREND_LABELS} datasets={SENTIMENT_TREND_DATASETS} height={140} />
        </Card>
      </div>

      {/* Feedback feed */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>
          Resident Feedback
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FEEDBACK_FEED.map(entry => (
            <FeedbackCard key={entry.id} entry={entry} C={C} sentimentColor={sentimentColor} />
          ))}
        </div>
      </div>
    </div>
  )
}

function FeedbackCard({ entry, C, sentimentColor }) {
  const blockColor = {
    'Block A': C.primary,
    'Block B': C.teal,
    'Block C': C.amber,
    'Block D': C.purple,
    'Block E': C.red,
  }
  const avatarColor = blockColor[entry.block] || C.textDim
  const initials = entry.resident.split(' ').map(n => n[0]).slice(0, 2).join('')

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: `${avatarColor}22`,
        border: `1px solid ${avatarColor}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        color: avatarColor,
        flexShrink: 0,
        letterSpacing: 0.5,
      }}>
        {initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{entry.resident}</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>{entry.block}</span>
        </div>
        <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.55 }}>
          {entry.comment}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <Badge color={sentimentColor[entry.sentiment]}>{entry.sentiment}</Badge>
        <span style={{ fontSize: 11, color: C.textMuted }}>{entry.date}</span>
      </div>
    </div>
  )
}
