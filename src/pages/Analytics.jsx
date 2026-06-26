import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { BLOCKS } from '../constants'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import LineChart from '../components/LineChart'
import DonutChart from '../components/DonutChart'
import BarChart from '../components/BarChart'
import { ANALYTICS_DATE_RANGES, ANALYTICS_MOCK } from '../data/mockData'

export default function Analytics() {
  const { colors: C } = useTheme()
  const [dateRange, setDateRange] = useState('This Month')
  const [block, setBlock] = useState('All Blocks')

  const CATEGORY_COLORS = [C.primary, C.amber, C.teal, C.red, C.purple, C.textDim]
  const BLOCK_COLORS = [C.primary, C.teal, C.purple, C.amber, C.red]

  const data = ANALYTICS_MOCK[dateRange]

  const visibleBlockBars =
    block === 'All Blocks'
      ? data.blockBars
      : data.blockBars.filter((b) => b.label === block)

  const statusTotal = data.statusSlices.reduce((acc, s) => acc + s.value, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header + filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Analytics</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>
            Society-wide performance metrics
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: 3,
              gap: 2,
            }}
          >
            {ANALYTICS_DATE_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Outfit',
                  fontSize: 12,
                  fontWeight: 600,
                  background: dateRange === range ? C.primary : 'transparent',
                  color: dateRange === range ? '#fff' : C.textDim,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {range}
              </button>
            ))}
          </div>

          <select
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              color: C.text,
              fontFamily: 'Outfit',
              fontSize: 12,
              fontWeight: 500,
              padding: '7px 12px',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              paddingRight: 28,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748b' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
            }}
          >
            <option value="All Blocks">All Blocks</option>
            {BLOCKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16 }}>
        {data.stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Line chart — full width */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
              Complaints Over Time
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>
              Submitted vs Resolved — {dateRange}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            {data.trendDatasets.map((ds, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.textDim }}>
                <div style={{ width: 20, height: 2.5, background: ds.color, borderRadius: 2 }} />
                {ds.label}
              </div>
            ))}
          </div>
        </div>
        <LineChart labels={data.trendLabels} datasets={data.trendDatasets} height={160} />
      </Card>

      {/* Category bars + status donut */}
      <div style={{ display: 'flex', gap: 16 }}>
        <Card style={{ flex: 3 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            Complaints by Category
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 20 }}>{dateRange}</div>
          <BarChart data={data.categoryBars} colors={CATEGORY_COLORS} height={160} />
        </Card>

        <Card style={{ flex: 2 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            Status Distribution
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 20 }}>{dateRange}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <DonutChart size={110} slices={data.statusSlices} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {data.statusSlices.map((s, i) => {
                const pct = Math.round((s.value / statusTotal) * 100)
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: C.textDim }}>{s.label}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{pct}%</span>
                    </div>
                    <div style={{ height: 3, borderRadius: 3, background: C.surfaceHigh }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: s.color, opacity: 0.85 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Block bar chart */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
              Complaints by Block
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>
              {block === 'All Blocks' ? 'All blocks' : block} — {dateRange}
            </div>
          </div>
          {block !== 'All Blocks' && (
            <button
              onClick={() => setBlock('All Blocks')}
              style={{
                background: C.surfaceHigh,
                border: `1px solid ${C.border}`,
                color: C.textDim,
                fontFamily: 'Outfit',
                fontSize: 12,
                fontWeight: 500,
                padding: '6px 14px',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Show all blocks
            </button>
          )}
        </div>
        <BarChart data={visibleBlockBars} colors={BLOCK_COLORS} height={160} />
      </Card>
    </div>
  )
}
