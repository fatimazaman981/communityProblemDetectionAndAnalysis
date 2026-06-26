# Fixify — Admin Dashboard Frontend

## What Is Fixify
Fixify is an AI-powered community complaint management platform for housing societies.
This repo is the **web admin dashboard** used by society managers to view, manage, and resolve
resident complaints. It connects to a Django REST Framework backend.

---

## Tech Stack
| Concern | Choice |
|---|---|
| Framework | React 18 + Vite |
| Language | JavaScript (NO TypeScript) |
| Styling | Tailwind CSS + inline styles for token-based colors |
| Components | shadcn/ui — tables, modals, dropdowns, tooltips ONLY |
| Routing | React Router v6 |
| HTTP | Axios only (never raw fetch) |
| State | useState + React Context (no Redux, no Zustand) |
| Charts | Custom SVG components (no Recharts, no Chart.js) |
| Font | Outfit via Google Fonts |

---

## Design System

### Color Tokens
All colors must be imported from `src/styles/colors.js`. Never hardcode hex values inline.

```js
export const C = {
  bg: '#0f1117',
  surface: '#161b27',
  surfaceHigh: '#1e2535',
  border: 'rgba(255,255,255,0.07)',
  primary: '#6366f1',
  primaryGlow: 'rgba(99,102,241,0.15)',
  teal: '#14b8a6',
  tealGlow: 'rgba(20,184,166,0.15)',
  amber: '#f59e0b',
  amberGlow: 'rgba(245,158,11,0.15)',
  red: '#ef4444',
  redGlow: 'rgba(239,68,68,0.15)',
  green: '#22c55e',
  greenGlow: 'rgba(34,197,94,0.15)',
  purple: '#a855f7',
  text: '#e2e8f0',
  textMuted: '#64748b',
  textDim: '#94a3b8',
};
```

### Complaint Status → Color Mapping
- Pending → `C.amber`
- In Progress → `C.primary`
- Resolved → `C.green`
- Rejected → `C.red`

### Typography Scale
- Page title: 20px, weight 700
- Section heading: 14px, weight 700
- Body: 13px, weight 400
- Label/caption: 11px, weight 600, uppercase, letterSpacing 0.8

### Component Rules
- **Card:** `background: C.surface`, `border: 1px solid C.border`, `borderRadius: 16px`, `padding: 20px`
- **Badge:** pill shape, `borderRadius: 100`, color background at 13% opacity, matching border at 27% opacity
- **Buttons:** no browser defaults, Outfit font, match badge color pattern
- **Border radius:** 16px cards, 8px inputs/buttons, 100px badges

---

## Folder Structure
```
src/
  api/            # Axios instance + all API call functions (never call axios in components)
  components/     # Reusable UI: Card, Badge, Sparkline, DonutChart, BarChart, LineChart, etc.
  context/        # AuthContext — contains admin info, society name, blocks[]
  pages/          # One file per route/page
  styles/         # colors.js + global CSS
  utils/          # Helper functions
```

---

## Auth & Society Context
- Single admin per society
- On login, token response contains: `{ token, admin_id, society_name, blocks[] }`
- Store in `AuthContext` — never in individual components
- Society name shown in header comes from `AuthContext` — never hardcoded
- Block list in all dropdowns comes from `AuthContext.blocks[]` — never hardcoded
- Token stored in localStorage as `fixify_token`
- Axios request interceptor attaches Bearer token to every request automatically

---

## Pages & Routes
| Route | Page | Notes |
|---|---|---|
| `/` | Redirect | → `/dashboard` |
| `/login` | Login | Admin login form |
| `/dashboard` | Overview | Stats cards, recent complaints, sparkline charts |
| `/dashboard/complaints` | Complaints List | Table with filters, pagination |
| `/dashboard/complaints/:id` | Complaint Detail | Full detail, status update, comments |
| `/dashboard/analytics` | Analytics | Line/bar/donut charts, trends |
| `/dashboard/alerts` | Urgent Alerts | High priority complaints |
| `/dashboard/sentiment` | Sentiment & Feedback | Merged page — feedback feed + sentiment charts |
| `/dashboard/fake-detection` | Fake Detection | AI flagged complaints, warn/ban actions |
| `/dashboard/duplicates` | Duplicate Detection | Admin triggers clustering, sees grouped complaints |
| `/dashboard/users` | User Management | Resident accounts, block assignment |
| `/dashboard/reports` | Reports | Filter form + PDF/Excel download |

---

## Data Rules
- All data in components must come via **props or API functions**
- No hardcoded chart values, percentages, or complaint counts inside components
- Sentiment page uses **mock data for now** — but components must accept data as props so real API can be swapped in later with zero restructuring
- Fake detection page uses mock data — same rule applies
- Use realistic Fixify-relevant placeholder data — no Lorem Ipsum

---

## API Integration
- Base URL from `import.meta.env.VITE_API_URL`
- Axios instance lives in `src/api/axiosInstance.js`
- All API functions live in `src/api/` — one file per domain (complaints.js, users.js, reports.js, etc.)
- Never call Axios directly from a component
- Reports export: `GET /api/reports/export/?format=pdf&from=&to=&block=&category=` — frontend only sends params and triggers file download

---

## Reports Page
Filter fields:
- Date range (From / To)
- Block (from `AuthContext.blocks[]`)
- Category (Water, Electricity, Sanitation, Security, Other)
- Report type (Complaint Summary, Resolution Rate, Pending Only)
- Export format toggle (PDF / Excel)

PDF and Excel are **generated by Django backend** — frontend does NOT generate files.
Frontend hits export endpoint and downloads the response as a file.

---

## Duplicate Detection Page
- Admin manually triggers detection via "Detect Duplicates" button
- Frontend calls API, backend returns clusters of similar complaints
- Display as grouped cards: "7 residents reported water issue in Block B"
- No automatic background detection — always admin-triggered

---

## Viewport & Responsiveness
- Desktop only — minimum viewport **1280px**
- Do NOT add responsive breakpoints
- Do NOT add mobile layouts
- Sidebar is always visible — no hamburger menu

---

## Strict Rules — Never Do These
- Never use TypeScript
- Never use Redux or Zustand
- Never use Recharts, Chart.js, or any charting library — charts are custom SVG only
- Never install UI libraries without instruction
- Never use raw `fetch` — always Axios
- Never hardcode colors — always import from `src/styles/colors.js`
- Never hardcode society name or block names — always from AuthContext
- Never put API calls inside components — use `src/api/` functions
- Never use HTML `<form>` element — use controlled inputs with onClick handlers
- Never make two different pages render the same component (complaints ≠ overview)
- Never use Lorem Ipsum placeholder text
- Desktop only — never add mobile/tablet breakpoints