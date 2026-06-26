import { C } from '../styles/colors'

export const OVERVIEW_STATS = [
  {
    label: 'Total Complaints',
    value: '1,284',
    sub: '+12% this week',
    delta: 1,
    color: C.purple,
    spark: [40, 52, 48, 65, 58, 72, 68, 85, 78, 92],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Pending',
    value: '83',
    sub: '-5 from yesterday',
    delta: -1,
    color: C.amber,
    spark: [90, 85, 88, 82, 86, 84, 88, 83, 85, 83],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: 'In Progress',
    value: '47',
    sub: '+3 from yesterday',
    delta: 1,
    color: C.primary,
    spark: [30, 38, 35, 42, 39, 45, 44, 48, 46, 47],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
  {
    label: 'Resolved',
    value: '1,154',
    sub: '+8 today',
    delta: 1,
    color: C.green,
    spark: [20, 28, 22, 35, 30, 40, 38, 44, 42, 47],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
]

export const TREND_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const TREND_DATASETS = [
  { data: [42, 58, 53, 67, 61, 48, 55], color: C.primary, label: 'Submitted' },
  { data: [30, 45, 50, 55, 58, 44, 47], color: C.green, label: 'Resolved' },
]

export const CATEGORY_SLICES = [
  { value: 32, color: C.primary, label: 'Water Supply', pct: '32%' },
  { value: 24, color: C.amber,   label: 'Electricity',  pct: '24%' },
  { value: 18, color: C.red,     label: 'Security',     pct: '18%' },
  { value: 14, color: C.teal,    label: 'Sanitation',   pct: '14%' },
  { value: 12, color: C.purple,  label: 'Other',        pct: '12%' },
]

export const ALL_COMPLAINTS = [
  { id: 'C-1042', title: 'Water supply cut off for 72 hours in Block A',            resident: 'Aasma Iqbal',     block: 'Block A', category: 'Water Supply', status: 'In Progress', priority: 'High',   date: 'Jun 26, 2026' },
  { id: 'C-1041', title: 'Recurring power outages across all floors in Block C',    resident: 'Fatima Zaman',    block: 'Block C', category: 'Electricity',  status: 'Pending',     priority: 'Medium', date: 'Jun 26, 2026' },
  { id: 'C-1040', title: 'Garbage collection skipped for one week in Block B',      resident: 'Ali Hassan',      block: 'Block B', category: 'Sanitation',   status: 'Resolved',    priority: 'Low',    date: 'Jun 25, 2026' },
  { id: 'C-1039', title: 'Boundary wall breach — unauthorized entry detected',      resident: 'Sara Khan',       block: 'Block A', category: 'Security',     status: 'Pending',     priority: 'Urgent', date: 'Jun 25, 2026' },
  { id: 'C-1038', title: 'Deep potholes on service road causing vehicle damage',    resident: 'Ahmed Raza',      block: 'Block E', category: 'Road Damage',  status: 'Resolved',    priority: 'Low',    date: 'Jun 25, 2026' },
  { id: 'C-1037', title: 'Low water pressure on upper floors in Block D',           resident: 'Kinza Awan',      block: 'Block D', category: 'Water Supply', status: 'In Progress', priority: 'Medium', date: 'Jun 24, 2026' },
  { id: 'C-1036', title: 'Malfunctioning streetlights near Block C main gate',      resident: 'Umar Farooq',     block: 'Block C', category: 'Other',        status: 'Pending',     priority: 'Low',    date: 'Jun 24, 2026' },
  { id: 'C-1035', title: 'MCB tripping repeatedly — electricity fault in Block A',  resident: 'Bilal Ahmed',     block: 'Block A', category: 'Electricity',  status: 'Pending',     priority: 'High',   date: 'Jun 24, 2026' },
  { id: 'C-1034', title: 'Water supply failure in Block B distribution line',       resident: 'Nadia Malik',     block: 'Block B', category: 'Water Supply', status: 'In Progress', priority: 'Medium', date: 'Jun 23, 2026' },
  { id: 'C-1033', title: 'Sanitation delay — bins overflowing near Block D',        resident: 'Ayesha Tariq',    block: 'Block D', category: 'Sanitation',   status: 'Resolved',    priority: 'Low',    date: 'Jun 23, 2026' },
  { id: 'C-1032', title: 'Security checkpoint unmanned during peak entry hours',    resident: 'Rashid Mehmood',  block: 'Block B', category: 'Security',     status: 'Rejected',    priority: 'Medium', date: 'Jun 23, 2026' },
  { id: 'C-1031', title: 'Pothole waterlogging causing road closure in Block C',    resident: 'Zahid Ali',       block: 'Block C', category: 'Road Damage',  status: 'Pending',     priority: 'Medium', date: 'Jun 22, 2026' },
  { id: 'C-1030', title: 'Persistent water outage on upper floors in Block A',      resident: 'Sana Butt',       block: 'Block A', category: 'Water Supply', status: 'Resolved',    priority: 'High',   date: 'Jun 22, 2026' },
  { id: 'C-1029', title: 'Power outages disrupting water pump operation in Block E', resident: 'Tariq Javed',    block: 'Block E', category: 'Electricity',  status: 'In Progress', priority: 'Low',    date: 'Jun 22, 2026' },
  { id: 'C-1028', title: 'Damaged community notice board in Block D hall',          resident: 'Hina Qureshi',    block: 'Block D', category: 'Other',        status: 'Pending',     priority: 'Low',    date: 'Jun 21, 2026' },
  { id: 'C-1027', title: 'Overflowing garbage bins near Block C common entrance',   resident: 'Omar Khalid',     block: 'Block C', category: 'Sanitation',   status: 'Resolved',    priority: 'Medium', date: 'Jun 21, 2026' },
  { id: 'C-1026', title: 'Water pressure critically low — booster failure in Block B', resident: 'Zara Hussain', block: 'Block B', category: 'Water Supply', status: 'Pending',     priority: 'High',   date: 'Jun 21, 2026' },
  { id: 'C-1025', title: 'Security breach at Block A rear gate — CCTV offline',     resident: 'Kamran Sheikh',   block: 'Block A', category: 'Security',     status: 'In Progress', priority: 'Urgent', date: 'Jun 20, 2026' },
  { id: 'C-1024', title: 'Road surface damage causing vehicle hazard in Block E',   resident: 'Mehwish Siddiqui', block: 'Block E', category: 'Road Damage', status: 'Resolved',    priority: 'Low',    date: 'Jun 20, 2026' },
  { id: 'C-1023', title: 'Electricity meter malfunction causing overbilling issue', resident: 'Asad Iqbal',      block: 'Block D', category: 'Electricity',  status: 'Pending',     priority: 'Medium', date: 'Jun 20, 2026' },
  { id: 'C-1022', title: 'Water pressure issue on floors 4–5 in Block C',           resident: 'Taha Raza',       block: 'Block C', category: 'Water Supply', status: 'In Progress', priority: 'High',   date: 'Jun 19, 2026' },
  { id: 'C-1021', title: 'Waste collection missed — piling up near Block A park',   resident: 'Laiba Farooq',    block: 'Block A', category: 'Sanitation',   status: 'Resolved',    priority: 'Low',    date: 'Jun 19, 2026' },
  { id: 'C-1020', title: 'Suspicious activity near Block B parking area at night',  resident: 'Waleed Khan',     block: 'Block B', category: 'Security',     status: 'Pending',     priority: 'High',   date: 'Jun 19, 2026' },
  { id: 'C-1019', title: 'Water supply restored but pressure still inadequate',     resident: 'Rida Ahmed',      block: 'Block E', category: 'Water Supply', status: 'Resolved',    priority: 'Medium', date: 'Jun 18, 2026' },
  { id: 'C-1018', title: 'Electricity outage during scheduled maintenance period',  resident: 'Sadia Nawaz',     block: 'Block D', category: 'Electricity',  status: 'Pending',     priority: 'Low',    date: 'Jun 18, 2026' },
]

export const ANALYTICS_DATE_RANGES = ['This Week', 'This Month', 'Last 3 Months', 'This Year']

export const ANALYTICS_MOCK = {
  'This Week': {
    stats: [
      {
        label: 'Total Complaints',
        value: '127',
        sub: '+14% vs last week',
        delta: 1,
        color: C.purple,
        spark: [12, 18, 15, 22, 20, 25, 15],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        label: 'Resolution Rate',
        value: '74%',
        sub: '+6% from last week',
        delta: 1,
        color: C.green,
        spark: [60, 65, 62, 68, 71, 74, 74],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
      },
      {
        label: 'Avg Resolution Time',
        value: '1.8d',
        sub: '-0.3 days improved',
        delta: 1,
        color: C.teal,
        spark: [24, 22, 20, 21, 19, 18, 18],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
      {
        label: 'Most Active Block',
        value: 'Block A',
        sub: '34 complaints this week',
        delta: 0,
        color: C.amber,
        spark: [5, 8, 6, 9, 7, 6, 3],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        ),
      },
    ],
    trendLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trendDatasets: [
      { data: [18, 24, 19, 27, 22, 10, 7], color: C.primary, label: 'Submitted' },
      { data: [12, 18, 16, 22, 19, 8, 5], color: C.green, label: 'Resolved' },
    ],
    categoryBars: [
      { label: 'Water', value: 38 },
      { label: 'Electricity', value: 29 },
      { label: 'Sanitation', value: 22 },
      { label: 'Security', value: 19 },
      { label: 'Road', value: 12 },
      { label: 'Other', value: 7 },
    ],
    statusSlices: [
      { label: 'Pending', value: 33, color: C.amber },
      { label: 'In Progress', value: 17, color: C.primary },
      { label: 'Resolved', value: 68, color: C.green },
      { label: 'Rejected', value: 9, color: C.red },
    ],
    blockBars: [
      { label: 'Block A', value: 34 },
      { label: 'Block B', value: 22 },
      { label: 'Block C', value: 28 },
      { label: 'Block D', value: 18 },
      { label: 'Block E', value: 25 },
    ],
  },
  'This Month': {
    stats: [
      {
        label: 'Total Complaints',
        value: '487',
        sub: '+8% vs last month',
        delta: 1,
        color: C.purple,
        spark: [55, 70, 65, 80, 75, 90, 52],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        label: 'Resolution Rate',
        value: '78%',
        sub: '+3% from last month',
        delta: 1,
        color: C.green,
        spark: [68, 72, 70, 75, 77, 78, 78],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
      },
      {
        label: 'Avg Resolution Time',
        value: '2.1d',
        sub: 'Stable this month',
        delta: 0,
        color: C.teal,
        spark: [22, 21, 22, 20, 21, 21, 21],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
      {
        label: 'Most Active Block',
        value: 'Block C',
        sub: '112 complaints this month',
        delta: 0,
        color: C.amber,
        spark: [20, 25, 22, 28, 24, 26, 18],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        ),
      },
    ],
    trendLabels: ['W1', 'W2', 'W3', 'W4'],
    trendDatasets: [
      { data: [127, 143, 118, 99], color: C.primary, label: 'Submitted' },
      { data: [95, 110, 94, 81], color: C.green, label: 'Resolved' },
    ],
    categoryBars: [
      { label: 'Water', value: 142 },
      { label: 'Electricity', value: 108 },
      { label: 'Sanitation', value: 87 },
      { label: 'Security', value: 74 },
      { label: 'Road', value: 48 },
      { label: 'Other', value: 28 },
    ],
    statusSlices: [
      { label: 'Pending', value: 83, color: C.amber },
      { label: 'In Progress', value: 47, color: C.primary },
      { label: 'Resolved', value: 321, color: C.green },
      { label: 'Rejected', value: 36, color: C.red },
    ],
    blockBars: [
      { label: 'Block A', value: 110 },
      { label: 'Block B', value: 84 },
      { label: 'Block C', value: 112 },
      { label: 'Block D', value: 76 },
      { label: 'Block E', value: 105 },
    ],
  },
  'Last 3 Months': {
    stats: [
      {
        label: 'Total Complaints',
        value: '1,284',
        sub: '+22% vs prev quarter',
        delta: 1,
        color: C.purple,
        spark: [160, 195, 210, 250, 240, 280, 260],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        label: 'Resolution Rate',
        value: '82%',
        sub: '+5% over quarter',
        delta: 1,
        color: C.green,
        spark: [70, 74, 76, 79, 81, 82, 82],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
      },
      {
        label: 'Avg Resolution Time',
        value: '2.4d',
        sub: '-0.6 days vs prev quarter',
        delta: 1,
        color: C.teal,
        spark: [30, 28, 27, 25, 24, 24, 24],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
      {
        label: 'Most Active Block',
        value: 'Block A',
        sub: '348 complaints in quarter',
        delta: 0,
        color: C.amber,
        spark: [80, 95, 90, 100, 88, 82, 88],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        ),
      },
    ],
    trendLabels: ['Apr', 'May', 'Jun'],
    trendDatasets: [
      { data: [380, 432, 472], color: C.primary, label: 'Submitted' },
      { data: [298, 355, 400], color: C.green, label: 'Resolved' },
    ],
    categoryBars: [
      { label: 'Water', value: 412 },
      { label: 'Electricity', value: 318 },
      { label: 'Sanitation', value: 248 },
      { label: 'Security', value: 196 },
      { label: 'Road', value: 142 },
      { label: 'Other', value: 88 },
    ],
    statusSlices: [
      { label: 'Pending', value: 83, color: C.amber },
      { label: 'In Progress', value: 47, color: C.primary },
      { label: 'Resolved', value: 1054, color: C.green },
      { label: 'Rejected', value: 100, color: C.red },
    ],
    blockBars: [
      { label: 'Block A', value: 348 },
      { label: 'Block B', value: 242 },
      { label: 'Block C', value: 310 },
      { label: 'Block D', value: 188 },
      { label: 'Block E', value: 275 },
    ],
  },
  'This Year': {
    stats: [
      {
        label: 'Total Complaints',
        value: '3,847',
        sub: '+31% vs last year',
        delta: 1,
        color: C.purple,
        spark: [200, 260, 310, 380, 420, 480, 450],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        label: 'Resolution Rate',
        value: '85%',
        sub: 'Highest ever recorded',
        delta: 1,
        color: C.green,
        spark: [65, 70, 74, 78, 82, 84, 85],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
      },
      {
        label: 'Avg Resolution Time',
        value: '2.9d',
        sub: '-1.2 days vs last year',
        delta: 1,
        color: C.teal,
        spark: [41, 38, 36, 33, 31, 30, 29],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
      {
        label: 'Most Active Block',
        value: 'Block C',
        sub: '1,024 complaints this year',
        delta: 0,
        color: C.amber,
        spark: [150, 180, 200, 240, 220, 210, 204],
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        ),
      },
    ],
    trendLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    trendDatasets: [
      { data: [420, 580, 530, 670, 610, 487], color: C.primary, label: 'Submitted' },
      { data: [310, 450, 480, 560, 530, 400], color: C.green, label: 'Resolved' },
    ],
    categoryBars: [
      { label: 'Water', value: 1142 },
      { label: 'Electricity', value: 892 },
      { label: 'Sanitation', value: 712 },
      { label: 'Security', value: 548 },
      { label: 'Road', value: 362 },
      { label: 'Other', value: 191 },
    ],
    statusSlices: [
      { label: 'Pending', value: 83, color: C.amber },
      { label: 'In Progress', value: 47, color: C.primary },
      { label: 'Resolved', value: 3272, color: C.green },
      { label: 'Rejected', value: 445, color: C.red },
    ],
    blockBars: [
      { label: 'Block A', value: 982 },
      { label: 'Block B', value: 728 },
      { label: 'Block C', value: 1024 },
      { label: 'Block D', value: 612 },
      { label: 'Block E', value: 891 },
    ],
  },
}

export const COMPLAINT_DETAILS = {
  'C-1042': {
    title: 'Water supply completely cut off in Block A',
    description: 'The main water supply pipeline serving Block A has been completely non-functional for 72 hours. Floors 3 through 5 in all three towers are dry. The overhead storage tank is empty and the pump near Gate 2 displays a fault indicator light. Approximately 40 families are affected, including households with infants and elderly residents.',
    photo: null,
    location: { address: 'Block A, Gate 2 Pump Station, Green Acres Housing Society', lat: '33.6844', lng: '73.0479' },
    unit: 'A-07',
    phone: '+92 300 1234567',
    submittedAt: 'Jun 26, 2026 · 09:14 AM',
    ai: {
      fakeScore: 94,
      similar: [
        { id: 'C-1034', desc: 'Water supply failure in Block B — pipeline fault' },
        { id: 'C-1030', desc: 'Water outage near Gate 3, multiple residents affected' },
        { id: 'C-1022', desc: 'Low pressure on floors 4–5, Block C booster issue' },
      ],
    },
    timeline: [
      { type: 'status', from: null,      to: 'Pending',     at: 'Jun 26, 2026 · 09:14 AM', by: 'System' },
      { type: 'status', from: 'Pending', to: 'In Progress', at: 'Jun 26, 2026 · 11:30 AM', by: 'Admin' },
      { type: 'note',   text: 'Maintenance team dispatched to Gate 2 pump station. ETA 2 hours.', at: 'Jun 26, 2026 · 11:35 AM', by: 'Admin' },
    ],
  },
  'C-1041': {
    title: 'Frequent electricity outages affecting all floors in Block C',
    description: 'Power outages lasting 2 to 4 hours are recurring multiple times daily across Block C. The distribution panel on the second floor is showing signs of overloading and several residents have reported minor equipment damage during power restoration surges. The backup generator for common areas is also not starting due to a fuel shortage. WAPDA has been contacted but no engineer visit has been scheduled.',
    photo: null,
    location: { address: 'Block C, 2F Distribution Panel Room, Green Acres Housing Society', lat: '33.6852', lng: '73.0485' },
    unit: 'C-07',
    phone: '+92 333 9876543',
    submittedAt: 'Jun 26, 2026 · 06:48 AM',
    ai: {
      fakeScore: 89,
      similar: [
        { id: 'C-1035', desc: 'Electricity fault in Block A — MCB tripping repeatedly' },
        { id: 'C-1029', desc: 'Power outages in Block E disrupting water pump operation' },
      ],
    },
    timeline: [
      { type: 'status', from: null, to: 'Pending', at: 'Jun 26, 2026 · 06:48 AM', by: 'System' },
    ],
  },
  'C-1040': {
    title: 'Garbage collection skipped for one week in Block B',
    description: 'Garbage collection points in Block B were not serviced for seven consecutive days. Bins near the B-02 and B-05 entrances had overflowed, generating foul odor affecting ground-floor residents. Street sweeping on the internal service lane was also absent during this period. The issue has since been resolved after the sanitation team carried out a full collection round.',
    photo: null,
    location: { address: 'Block B, Collection Point near B-02 Entrance, Green Acres Housing Society', lat: '33.6838', lng: '73.0472' },
    unit: 'B-03',
    phone: '+92 321 5551234',
    submittedAt: 'Jun 25, 2026 · 08:30 AM',
    ai: {
      fakeScore: 97,
      similar: [
        { id: 'C-1033', desc: 'Sanitation backlog in Block D — 5-day collection delay' },
        { id: 'C-1027', desc: 'Overflowing bins in Block C common area entrance' },
      ],
    },
    timeline: [
      { type: 'status', from: null,          to: 'Pending',     at: 'Jun 25, 2026 · 08:30 AM', by: 'System' },
      { type: 'status', from: 'Pending',     to: 'In Progress', at: 'Jun 25, 2026 · 10:00 AM', by: 'Admin' },
      { type: 'note',   text: 'Sanitation crew dispatched. Full backlog collection confirmed for today.', at: 'Jun 25, 2026 · 10:05 AM', by: 'Admin' },
      { type: 'status', from: 'In Progress', to: 'Resolved',    at: 'Jun 25, 2026 · 04:30 PM', by: 'Admin' },
    ],
  },
  'C-1039': {
    title: 'Unauthorized access through boundary wall breach — Block A',
    description: 'An unauthorized individual was spotted near the Block A perimeter during late nighttime hours on two consecutive nights. A section of the boundary wall near the back alley has a structural breach large enough for a person to pass through. CCTV camera #7 covering this section has been offline for three days and the security guard post near this area is unmanned after midnight.',
    photo: null,
    location: { address: 'Block A, South Boundary Wall (near Parking Lot P-3), Green Acres Housing Society', lat: '33.6841', lng: '73.0468' },
    unit: 'A-05',
    phone: '+92 311 7654321',
    submittedAt: 'Jun 25, 2026 · 11:55 PM',
    ai: {
      fakeScore: 91,
      similar: [
        { id: 'C-1025', desc: 'Security breach at Block A rear gate — urgent' },
        { id: 'C-1020', desc: 'Suspicious persons near Block B parking after midnight' },
      ],
    },
    timeline: [
      { type: 'status', from: null, to: 'Pending', at: 'Jun 25, 2026 · 11:55 PM', by: 'System' },
    ],
  },
  'C-1038': {
    title: 'Deep potholes blocking service road in Block E',
    description: 'Three large potholes developed on the Block E internal service road following heavy rainfall last week. The deepest measures approximately 30 cm and caused a resident\'s motorbike to sustain damage near the speed breaker. A municipality repair request had been pending for two weeks. The road surface has since been patched and the area cleared.',
    photo: null,
    location: { address: 'Block E, Internal Service Road (E-09 to E-12 stretch), Green Acres Housing Society', lat: '33.6860', lng: '73.0490' },
    unit: 'E-09',
    phone: '+92 345 1122334',
    submittedAt: 'Jun 25, 2026 · 08:20 AM',
    ai: {
      fakeScore: 85,
      similar: [
        { id: 'C-1024', desc: 'Road surface damage in Block E near main gate' },
        { id: 'C-1031', desc: 'Pothole waterlogging causing road closure in Block C' },
      ],
    },
    timeline: [
      { type: 'status', from: null,          to: 'Pending',     at: 'Jun 25, 2026 · 08:20 AM', by: 'System' },
      { type: 'status', from: 'Pending',     to: 'In Progress', at: 'Jun 25, 2026 · 11:00 AM', by: 'Admin' },
      { type: 'note',   text: 'Road repair crew scheduled for afternoon. Temporary warning signs placed at pothole sites.', at: 'Jun 25, 2026 · 11:10 AM', by: 'Admin' },
      { type: 'status', from: 'In Progress', to: 'Resolved',    at: 'Jun 25, 2026 · 05:15 PM', by: 'Admin' },
    ],
  },
  'C-1037': {
    title: 'Low water pressure affecting upper floors in Block D',
    description: 'Residents on floors 4 and 5 of Block D are receiving critically low water pressure throughout the day. The overhead tank is not filling completely despite the pump running continuously. A booster pump serviced three months ago appears to be underperforming again. Ground-floor residents receive normal pressure, confirming the issue is isolated to the booster system.',
    photo: null,
    location: { address: 'Block D, Main Water Pump Room (Ground Floor), Green Acres Housing Society', lat: '33.6848', lng: '73.0476' },
    unit: 'D-11',
    phone: '+92 300 5678901',
    submittedAt: 'Jun 24, 2026 · 03:10 PM',
    ai: {
      fakeScore: 92,
      similar: [
        { id: 'C-1042', desc: 'Complete water outage in Block A — pump fault' },
        { id: 'C-1034', desc: 'Water supply issue in Block B main distribution line' },
        { id: 'C-1026', desc: 'Low pressure in Block B upper floors — booster failure' },
      ],
    },
    timeline: [
      { type: 'status', from: null,      to: 'Pending',     at: 'Jun 24, 2026 · 03:10 PM', by: 'System' },
      { type: 'status', from: 'Pending', to: 'In Progress', at: 'Jun 24, 2026 · 05:00 PM', by: 'Admin' },
    ],
  },
}

export const SENTIMENT_STATS = [
  { label: 'Positive', value: 54, sub: '+4% vs last week', delta:  1, color: C.green },
  { label: 'Neutral',  value: 28, sub: 'Stable this week', delta:  0, color: C.amber },
  { label: 'Negative', value: 18, sub: '-2% vs last week', delta: -1, color: C.red },
]

export const SENTIMENT_SLICES = [
  { value: 54, color: C.green, label: 'Positive' },
  { value: 28, color: C.amber, label: 'Neutral' },
  { value: 18, color: C.red,   label: 'Negative' },
]

export const SENTIMENT_TREND_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const SENTIMENT_TREND_DATASETS = [
  { data: [48, 52, 55, 50, 58, 60, 54], color: C.green, label: 'Positive' },
  { data: [30, 27, 25, 30, 24, 22, 28], color: C.amber, label: 'Neutral' },
  { data: [22, 21, 20, 20, 18, 18, 18], color: C.red,   label: 'Negative' },
]

export const FEEDBACK_FEED = [
  { id: 1, resident: 'Aasma Iqbal',    block: 'Block A', comment: 'The maintenance team responded within hours — really impressed with how quickly this was handled.', sentiment: 'Positive', date: 'Jun 26, 2026' },
  { id: 2, resident: 'Bilal Ahmed',    block: 'Block A', comment: 'My electricity complaint is still unresolved after 3 days. No one is picking up calls at the admin office.', sentiment: 'Negative', date: 'Jun 26, 2026' },
  { id: 3, resident: 'Sara Khan',      block: 'Block A', comment: 'The security alert was acknowledged quickly. Glad admin is taking the boundary wall issue seriously.', sentiment: 'Neutral',  date: 'Jun 25, 2026' },
  { id: 4, resident: 'Kinza Awan',     block: 'Block D', comment: 'Water pressure on floor 4 improved significantly after the booster pump was serviced. Thank you.', sentiment: 'Positive', date: 'Jun 24, 2026' },
  { id: 5, resident: 'Rashid Mehmood', block: 'Block B', comment: 'My complaint was rejected without any explanation. The security problem near Block B is still unresolved.', sentiment: 'Negative', date: 'Jun 23, 2026' },
  { id: 6, resident: 'Omar Khalid',    block: 'Block C', comment: 'Sanitation backlog was cleared. Could have been faster but appreciate the crew coming in on a Sunday.', sentiment: 'Positive', date: 'Jun 21, 2026' },
  { id: 7, resident: 'Nadia Malik',    block: 'Block B', comment: 'The complaint tracking system is genuinely useful. Being able to monitor status updates is very reassuring.', sentiment: 'Positive', date: 'Jun 23, 2026' },
  { id: 8, resident: 'Asad Iqbal',     block: 'Block D', comment: 'Submitted a power outage complaint two days ago but have not received any acknowledgement yet.', sentiment: 'Neutral',  date: 'Jun 20, 2026' },
]

export const MOCK_USERS = [
  { id: 'U-001', name: 'Aasma Iqbal',      block: 'Block A', unit: 'A-07', phone: '+92 300 1234567', complaintsCount: 8,  status: 'Active' },
  { id: 'U-002', name: 'Fatima Zaman',     block: 'Block C', unit: 'C-07', phone: '+92 333 9876543', complaintsCount: 5,  status: 'Active' },
  { id: 'U-003', name: 'Ali Hassan',       block: 'Block B', unit: 'B-03', phone: '+92 321 5551234', complaintsCount: 3,  status: 'Active' },
  { id: 'U-004', name: 'Sara Khan',        block: 'Block A', unit: 'A-05', phone: '+92 311 7654321', complaintsCount: 6,  status: 'Active' },
  { id: 'U-005', name: 'Ahmed Raza',       block: 'Block E', unit: 'E-09', phone: '+92 345 1122334', complaintsCount: 2,  status: 'Active' },
  { id: 'U-006', name: 'Kinza Awan',       block: 'Block D', unit: 'D-11', phone: '+92 300 5678901', complaintsCount: 4,  status: 'Active' },
  { id: 'U-007', name: 'Umar Farooq',      block: 'Block C', unit: 'C-14', phone: '+92 312 3344556', complaintsCount: 1,  status: 'Active' },
  { id: 'U-008', name: 'Bilal Ahmed',      block: 'Block A', unit: 'A-02', phone: '+92 322 6677889', complaintsCount: 7,  status: 'Active' },
  { id: 'U-009', name: 'Nadia Malik',      block: 'Block B', unit: 'B-08', phone: '+92 334 9900112', complaintsCount: 3,  status: 'Active' },
  { id: 'U-010', name: 'Ayesha Tariq',     block: 'Block D', unit: 'D-04', phone: '+92 344 2233445', complaintsCount: 2,  status: 'Active' },
  { id: 'U-011', name: 'Rashid Mehmood',   block: 'Block B', unit: 'B-12', phone: '+92 302 5566778', complaintsCount: 4,  status: 'Banned' },
  { id: 'U-012', name: 'Zahid Ali',        block: 'Block C', unit: 'C-03', phone: '+92 315 8899001', complaintsCount: 2,  status: 'Active' },
  { id: 'U-013', name: 'Sana Butt',        block: 'Block A', unit: 'A-10', phone: '+92 321 1122334', complaintsCount: 5,  status: 'Active' },
  { id: 'U-014', name: 'Tariq Javed',      block: 'Block E', unit: 'E-06', phone: '+92 343 4455667', complaintsCount: 3,  status: 'Active' },
  { id: 'U-015', name: 'Hina Qureshi',     block: 'Block D', unit: 'D-09', phone: '+92 301 7788990', complaintsCount: 1,  status: 'Active' },
  { id: 'U-016', name: 'Omar Khalid',      block: 'Block C', unit: 'C-11', phone: '+92 333 0011223', complaintsCount: 3,  status: 'Active' },
  { id: 'U-017', name: 'Zara Hussain',     block: 'Block B', unit: 'B-06', phone: '+92 323 3344556', complaintsCount: 6,  status: 'Active' },
  { id: 'U-018', name: 'Kamran Sheikh',    block: 'Block A', unit: 'A-01', phone: '+92 312 6677889', complaintsCount: 4,  status: 'Active' },
  { id: 'U-019', name: 'Mehwish Siddiqui', block: 'Block E', unit: 'E-13', phone: '+92 344 9900112', complaintsCount: 2,  status: 'Banned' },
  { id: 'U-020', name: 'Asad Iqbal',       block: 'Block D', unit: 'D-02', phone: '+92 302 2233445', complaintsCount: 3,  status: 'Active' },
  { id: 'U-021', name: 'Taha Raza',        block: 'Block C', unit: 'C-08', phone: '+92 315 5566778', complaintsCount: 2,  status: 'Active' },
  { id: 'U-022', name: 'Laiba Farooq',     block: 'Block A', unit: 'A-15', phone: '+92 321 8899001', complaintsCount: 1,  status: 'Active' },
  { id: 'U-023', name: 'Waleed Khan',      block: 'Block B', unit: 'B-09', phone: '+92 343 1122334', complaintsCount: 5,  status: 'Banned' },
  { id: 'U-024', name: 'Rida Ahmed',       block: 'Block E', unit: 'E-02', phone: '+92 301 4455667', complaintsCount: 2,  status: 'Active' },
  { id: 'U-025', name: 'Sadia Nawaz',      block: 'Block D', unit: 'D-07', phone: '+92 333 7788990', complaintsCount: 1,  status: 'Active' },
]

export const REPORT_PREVIEW = {
  'Complaint Summary': [
    { id: 'C-1042', title: 'Water supply cut off for 72 hours in Block A',          block: 'Block A', category: 'Water Supply', status: 'In Progress', date: 'Jun 26, 2026' },
    { id: 'C-1041', title: 'Recurring power outages across all floors in Block C',  block: 'Block C', category: 'Electricity',  status: 'Pending',     date: 'Jun 26, 2026' },
    { id: 'C-1040', title: 'Garbage collection skipped for one week in Block B',    block: 'Block B', category: 'Sanitation',   status: 'Resolved',    date: 'Jun 25, 2026' },
    { id: 'C-1039', title: 'Boundary wall breach — unauthorized entry detected',    block: 'Block A', category: 'Security',     status: 'Pending',     date: 'Jun 25, 2026' },
    { id: 'C-1038', title: 'Deep potholes on service road causing vehicle damage',  block: 'Block E', category: 'Road Damage',  status: 'Resolved',    date: 'Jun 25, 2026' },
    { id: 'C-1037', title: 'Low water pressure on upper floors in Block D',         block: 'Block D', category: 'Water Supply', status: 'In Progress', date: 'Jun 24, 2026' },
    { id: 'C-1036', title: 'Malfunctioning streetlights near Block C main gate',   block: 'Block C', category: 'Other',        status: 'Pending',     date: 'Jun 24, 2026' },
    { id: 'C-1035', title: 'MCB tripping repeatedly — electricity fault in Block A', block: 'Block A', category: 'Electricity', status: 'Pending',     date: 'Jun 24, 2026' },
  ],
  'Resolution Rate': [
    { block: 'Block A', total: 110, resolved: 88, pending: 22, rate: '80%' },
    { block: 'Block B', total:  84, resolved: 65, pending: 19, rate: '77%' },
    { block: 'Block C', total: 112, resolved: 90, pending: 22, rate: '80%' },
    { block: 'Block D', total:  76, resolved: 62, pending: 14, rate: '82%' },
    { block: 'Block E', total: 105, resolved: 78, pending: 27, rate: '74%' },
  ],
  'Pending Only': [
    { id: 'C-1041', title: 'Recurring power outages across all floors in Block C',      block: 'Block C', category: 'Electricity',  status: 'Pending', date: 'Jun 26, 2026' },
    { id: 'C-1039', title: 'Boundary wall breach — unauthorized entry detected',        block: 'Block A', category: 'Security',     status: 'Pending', date: 'Jun 25, 2026' },
    { id: 'C-1036', title: 'Malfunctioning streetlights near Block C main gate',       block: 'Block C', category: 'Other',        status: 'Pending', date: 'Jun 24, 2026' },
    { id: 'C-1035', title: 'MCB tripping repeatedly — electricity fault in Block A',   block: 'Block A', category: 'Electricity',  status: 'Pending', date: 'Jun 24, 2026' },
    { id: 'C-1031', title: 'Pothole waterlogging causing road closure in Block C',     block: 'Block C', category: 'Road Damage',  status: 'Pending', date: 'Jun 22, 2026' },
    { id: 'C-1028', title: 'Damaged community notice board in Block D hall',           block: 'Block D', category: 'Other',        status: 'Pending', date: 'Jun 21, 2026' },
    { id: 'C-1026', title: 'Water pressure critically low — booster failure in Block B', block: 'Block B', category: 'Water Supply', status: 'Pending', date: 'Jun 21, 2026' },
    { id: 'C-1023', title: 'Electricity meter malfunction causing overbilling issue',  block: 'Block D', category: 'Electricity',  status: 'Pending', date: 'Jun 20, 2026' },
  ],
}

// ─── Labor / Workers Data ─────────────────────────────────────────────────────

export const LABOR_SKILLS = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'AC Technician',
  'Gas Technician',
  'Pest Control',
  'General Labor',
]

export const LABOR_WORKERS = [
  { id: 'L-001', name: 'Muhammad Waseem',  skill: 'Plumber',       phone: '+92 300 1112233', available: true,  rating: 4.8, jobsDone: 142, experience: '8 yrs' },
  { id: 'L-002', name: 'Arshad Ali',       skill: 'Plumber',       phone: '+92 311 4455667', available: false, rating: 4.5, jobsDone:  98, experience: '5 yrs' },
  { id: 'L-003', name: 'Tariq Mehmood',    skill: 'Plumber',       phone: '+92 321 7788990', available: true,  rating: 4.3, jobsDone:  76, experience: '4 yrs' },
  { id: 'L-004', name: 'Zubair Hussain',   skill: 'Electrician',   phone: '+92 333 2233445', available: true,  rating: 4.9, jobsDone: 215, experience: '12 yrs' },
  { id: 'L-005', name: 'Kamran Baig',      skill: 'Electrician',   phone: '+92 345 5566778', available: true,  rating: 4.6, jobsDone: 130, experience: '7 yrs' },
  { id: 'L-006', name: 'Nadeem Akhtar',    skill: 'Electrician',   phone: '+92 302 8899001', available: false, rating: 4.4, jobsDone:  89, experience: '6 yrs' },
  { id: 'L-007', name: 'Rashid Carpenter', skill: 'Carpenter',     phone: '+92 315 1122334', available: true,  rating: 4.7, jobsDone: 104, experience: '9 yrs' },
  { id: 'L-008', name: 'Faisal Woodcraft', skill: 'Carpenter',     phone: '+92 343 4455667', available: true,  rating: 4.2, jobsDone:  58, experience: '3 yrs' },
  { id: 'L-009', name: 'Imran Painter',    skill: 'Painter',       phone: '+92 301 7788990', available: true,  rating: 4.5, jobsDone:  87, experience: '6 yrs' },
  { id: 'L-010', name: 'Sajid Rehman',     skill: 'Painter',       phone: '+92 333 0011223', available: false, rating: 4.3, jobsDone:  61, experience: '4 yrs' },
  { id: 'L-011', name: 'Bilal Cool',       skill: 'AC Technician', phone: '+92 323 3344556', available: true,  rating: 4.8, jobsDone: 178, experience: '10 yrs' },
  { id: 'L-012', name: 'Hassan Cooling',   skill: 'AC Technician', phone: '+92 312 6677889', available: true,  rating: 4.6, jobsDone: 112, experience: '7 yrs' },
  { id: 'L-013', name: 'Usman Gas Wala',   skill: 'Gas Technician',phone: '+92 344 9900112', available: true,  rating: 4.7, jobsDone:  93, experience: '8 yrs' },
  { id: 'L-014', name: 'Asif Gas Expert',  skill: 'Gas Technician',phone: '+92 302 2233445', available: false, rating: 4.4, jobsDone:  67, experience: '5 yrs' },
  { id: 'L-015', name: 'Waqar Pest Pro',   skill: 'Pest Control',  phone: '+92 315 5566778', available: true,  rating: 4.6, jobsDone: 134, experience: '6 yrs' },
  { id: 'L-016', name: 'Danish Labor',     skill: 'General Labor', phone: '+92 321 8899001', available: true,  rating: 4.1, jobsDone:  45, experience: '2 yrs' },
  { id: 'L-017', name: 'Omer Handyman',    skill: 'General Labor', phone: '+92 343 1122334', available: true,  rating: 4.3, jobsDone:  72, experience: '4 yrs' },
]

export const FAKE_DETECTION_STATS = [
  { label: 'Total Flagged',   value: '18',   sub: '+3 flagged this week',      color: C.red },
  { label: 'Warnings Issued', value: '11',   sub: '7 pending admin review',    color: C.amber },
  { label: 'Accounts Banned', value: '3',    sub: 'Banned in last 30 days',    color: C.purple },
  { label: 'Fake Rate',       value: '6.2%', sub: 'Of all submitted complaints', color: C.teal },
]

export const FLAGGED_COMPLAINTS = [
  { id: 'C-0987', resident: 'Imran Siddiqui', block: 'Block B', text: 'The entire Block B is flooded due to a burst pipeline. Water level is above knee height on all floors and residents have begun evacuating.', confidence: 91, risk: 'High',   status: 'pending' },
  { id: 'C-0974', resident: 'Farrukh Noor',   block: 'Block C', text: 'All lights across Block C stopped working simultaneously. Area is completely dark and multiple accidents have already occurred on the staircases.', confidence: 87, risk: 'High',   status: 'pending' },
  { id: 'C-0961', resident: 'Daniya Shah',     block: 'Block A', text: 'Suspected gas leak near the Block A utility room. Strong smell reported throughout the building and residents are beginning to evacuate.', confidence: 79, risk: 'Medium', status: 'warned' },
  { id: 'C-0943', resident: 'Kabeer Mirza',    block: 'Block E', text: "The internal service road in Block E has completely collapsed after last night's rain. Emergency vehicles cannot access the area at all.", confidence: 83, risk: 'High',   status: 'pending' },
  { id: 'C-0928', resident: 'Uzma Tariq',      block: 'Block D', text: 'Sewage overflow has reportedly contaminated the entire Block D water supply. Multiple residents are reporting symptoms of illness.', confidence: 76, risk: 'Medium', status: 'warned' },
  { id: 'C-0912', resident: 'Sohail Baig',     block: 'Block B', text: 'Security personnel allegedly found sleeping on duty and allowed unverified vehicles through the main gate late at night.', confidence: 62, risk: 'Low',    status: 'pending' },
]
