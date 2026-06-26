import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { OVERVIEW_STATS, TREND_LABELS, TREND_DATASETS, CATEGORY_SLICES, ALL_COMPLAINTS } from '../data/mockData'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import LineChart from '../components/LineChart'
import DonutChart from '../components/DonutChart'
import RecentComplaintsTable from '../components/RecentComplaintsTable'

const RECENT_COUNT = 7

export default function Overview() {
  const navigate = useNavigate()
  const { colors: C } = useTheme()
  const recentComplaints = ALL_COMPLAINTS.slice(0, RECENT_COUNT)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <div style={{ display: 'flex', gap: 16 }}>
        {OVERVIEW_STATS.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>

        <Card style={{ flex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Complaint Trends</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Last 7 days</div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {TREND_DATASETS.map((ds, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.textDim }}>
                  <div style={{ width: 20, height: 2, background: ds.color, borderRadius: 1 }} />
                  {ds.label}
                </div>
              ))}
            </div>
          </div>
          <LineChart datasets={TREND_DATASETS} labels={TREND_LABELS} height={140} />
        </Card>

        <Card style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>By Category</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, marginBottom: 16 }}>This month</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <DonutChart slices={CATEGORY_SLICES} size={96} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
              {CATEGORY_SLICES.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: C.textDim, flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{s.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>

      <Card>
        <RecentComplaintsTable
          complaints={recentComplaints}
          onViewAll={() => navigate('/dashboard/complaints')}
          onRowClick={(c) => navigate(`/dashboard/complaints/${c.id}`)}
        />
      </Card>

    </div>
  )
}
