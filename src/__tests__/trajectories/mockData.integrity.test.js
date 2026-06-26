/**
 * TRAJECTORY EVALUATION — Mock Data Integrity
 * File: src/__tests__/trajectories/mockData.integrity.test.js
 *
 * WHY TEST MOCK DATA?
 * All pages in Fixify currently use mock data (src/data/mockData.jsx) while the
 * Django backend is being developed. This mock data acts as a contract: it defines
 * the exact shape and content that components expect to receive from the real API.
 *
 * If a developer accidentally changes the structure of mock data (adds a typo,
 * removes a field, or breaks a reference), multiple components will silently break.
 * These tests catch those regressions immediately.
 *
 * WHAT IS TESTED:
 * Each describe block validates one dataset:
 *
 *   1. ALL_COMPLAINTS    — 25 complaints used on the Complaints page
 *   2. COMPLAINT_DETAILS — 6 detailed records with AI insights and timelines
 *   3. FLAGGED_COMPLAINTS — 6 AI-flagged items for the Fake Detection page
 *   4. SENTIMENT_STATS   — 3 sentiment categories summing to 100%
 *   5. FEEDBACK_FEED     — 8 resident feedback entries with labels
 *   6. MOCK_USERS        — 25 resident accounts for the Users page
 *   7. ANALYTICS_MOCK    — Time-ranged analytics data for 4 date ranges
 *   8. REPORT_PREVIEW    — 3 report templates for the Reports page
 *
 * These are pure data tests — no React components are rendered here.
 */

import { describe, it, expect } from 'vitest'
import {
  ALL_COMPLAINTS,
  COMPLAINT_DETAILS,
  FAKE_DETECTION_STATS,
  FLAGGED_COMPLAINTS,
  SENTIMENT_STATS,
  FEEDBACK_FEED,
  MOCK_USERS,
  ANALYTICS_MOCK,
  ANALYTICS_DATE_RANGES,
  REPORT_PREVIEW,
} from '../../data/mockData'


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 1 — ALL_COMPLAINTS Data Contract
// Used by: Complaints page (list), Overview page (recent table), useComplaints hook
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 1 — ALL_COMPLAINTS data contract', () => {

  it('has exactly 25 complaints', () => {
    // The complaints list is designed with 25 entries (3 pages of 10/10/5)
    expect(ALL_COMPLAINTS).toHaveLength(25)
  })

  it('every complaint has required fields', () => {
    // Each complaint object must have all fields that the UI reads
    // If any field is missing, the component will render undefined and look broken
    ALL_COMPLAINTS.forEach(c => {
      expect(c).toHaveProperty('id')         // e.g. "C-1042" — shown in tables and detail pages
      expect(c).toHaveProperty('title')      // one-line summary of the complaint
      expect(c).toHaveProperty('resident')   // name of the submitting resident
      expect(c).toHaveProperty('block')      // housing block (Block A–E)
      expect(c).toHaveProperty('category')   // Water Supply, Electricity, Security, etc.
      expect(c).toHaveProperty('status')     // Pending | In Progress | Resolved | Rejected
      expect(c).toHaveProperty('priority')   // Low | Medium | High | Urgent
      expect(c).toHaveProperty('date')       // submission date string
    })
  })

  it('all statuses are valid enum values', () => {
    // These are the only four statuses the UI knows how to colour-code
    // An invalid status would render with no styling (invisible or wrong colour)
    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected']
    ALL_COMPLAINTS.forEach(c => expect(validStatuses).toContain(c.status))
  })

  it('all priorities are valid enum values', () => {
    // These are the only four priorities used in the Alerts page filter
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent']
    ALL_COMPLAINTS.forEach(c => expect(validPriorities).toContain(c.priority))
  })

  it('all IDs are unique', () => {
    // Convert the array of IDs into a Set — Sets only store unique values
    // If the Set size equals the array length, all IDs are unique
    const ids = ALL_COMPLAINTS.map(c => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('IDs follow C-XXXX format', () => {
    // All IDs must match the pattern: "C-" followed by exactly 4 digits
    // This is the format used in URLs (/dashboard/complaints/C-1042) and the API
    ALL_COMPLAINTS.forEach(c => expect(c.id).toMatch(/^C-\d{4}$/))
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 2 — COMPLAINT_DETAILS Data Contract
// Used by: ComplaintDetail page — shows full complaint info, AI analysis, timeline
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 2 — COMPLAINT_DETAILS data contract', () => {

  // COMPLAINT_DETAILS is an object keyed by complaint ID
  // e.g. { 'C-1042': { title, description, ai, timeline, ... }, ... }
  const detailIds = Object.keys(COMPLAINT_DETAILS)

  it('has 6 detailed complaint records', () => {
    // 6 detailed records exist (for the top complaints in ALL_COMPLAINTS)
    expect(detailIds).toHaveLength(6)
  })

  it('every detail record has ai.fakeScore between 0 and 100', () => {
    // fakeScore is the AI's authenticity score — 0% means likely real, 100% means likely fake
    // Any value outside 0–100 would be a data error (impossible percentage)
    detailIds.forEach(id => {
      const score = COMPLAINT_DETAILS[id].ai.fakeScore
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    })
  })

  it('every detail record has at least one similar complaint', () => {
    // The ComplaintDetail page shows an "AI-identified similar complaints" section
    // There must be at least one similar complaint to populate this section
    detailIds.forEach(id => {
      expect(COMPLAINT_DETAILS[id].ai.similar.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('every detail record has a non-empty timeline', () => {
    // The complaint timeline shows status changes and admin notes (audit trail)
    // At minimum, the creation event ("Submitted → Pending") must exist
    detailIds.forEach(id => {
      expect(COMPLAINT_DETAILS[id].timeline.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('all similar complaint references point to valid IDs in ALL_COMPLAINTS', () => {
    // The "similar complaints" shown in detail view must link to real complaints
    // A broken reference would create a link that navigates to a non-existent complaint page
    const allIds = new Set(ALL_COMPLAINTS.map(c => c.id))

    detailIds.forEach(id => {
      COMPLAINT_DETAILS[id].ai.similar.forEach(sim => {
        // Every similar complaint ID must exist in the main ALL_COMPLAINTS dataset
        expect(allIds.has(sim.id)).toBe(true)
      })
    })
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 3 — FLAGGED_COMPLAINTS Data Contract
// Used by: FakeDetection page — AI review queue
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 3 — FLAGGED_COMPLAINTS data contract', () => {

  it('has 6 flagged complaints', () => {
    // 6 complaints are in the AI review queue in the mock dataset
    expect(FLAGGED_COMPLAINTS).toHaveLength(6)
  })

  it('every flagged complaint has confidence between 0 and 100', () => {
    // confidence is the AI model's certainty that a complaint is fake
    // 0% = definitely real, 100% = definitely fake — must stay within this range
    FLAGGED_COMPLAINTS.forEach(item => {
      expect(item.confidence).toBeGreaterThanOrEqual(0)
      expect(item.confidence).toBeLessThanOrEqual(100)
    })
  })

  it('every flagged complaint has a valid risk level', () => {
    // Risk level is derived from the confidence score and complaint severity
    // Used to colour the risk badge (red/amber/green) on each card
    const validRiskLevels = ['High', 'Medium', 'Low']
    FLAGGED_COMPLAINTS.forEach(item => expect(validRiskLevels).toContain(item.risk))
  })

  it('every flagged complaint has a valid status', () => {
    // 'pending' = not yet reviewed by admin
    // 'warned'  = a warning has already been issued to the resident
    const validStatuses = ['pending', 'warned']
    FLAGGED_COMPLAINTS.forEach(item => expect(validStatuses).toContain(item.status))
  })

  it('High risk items have higher confidence than Low risk items on average', () => {
    // Validates that the AI confidence score and risk level are consistent with each other
    // High Risk complaints should have higher fake confidence scores than Low Risk ones
    const highConfidences = FLAGGED_COMPLAINTS.filter(i => i.risk === 'High').map(i => i.confidence)
    const lowConfidences  = FLAGGED_COMPLAINTS.filter(i => i.risk === 'Low').map(i => i.confidence)

    if (highConfidences.length && lowConfidences.length) {
      const avgHigh = highConfidences.reduce((a, b) => a + b, 0) / highConfidences.length
      const avgLow  = lowConfidences.reduce((a, b) => a + b, 0)  / lowConfidences.length
      expect(avgHigh).toBeGreaterThan(avgLow)
    }
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 4 — SENTIMENT_STATS Data Contract
// Used by: Sentiment page — the three stat cards at the top of the page
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 4 — SENTIMENT_STATS data contract', () => {

  it('has exactly 3 sentiment categories', () => {
    // Positive, Neutral, Negative — exactly 3, no more, no less
    expect(SENTIMENT_STATS).toHaveLength(3)
  })

  it('sentiment percentages sum to 100', () => {
    // The three values (54 + 28 + 18 = 100) must always sum to exactly 100
    // This ensures the donut chart renders a complete circle
    const total = SENTIMENT_STATS.reduce((sum, s) => sum + s.value, 0)
    expect(total).toBe(100)
  })

  it('all sentiment values are between 0 and 100', () => {
    // Each individual category percentage must be a valid percentage (0–100%)
    SENTIMENT_STATS.forEach(s => {
      expect(s.value).toBeGreaterThan(0)    // a category with 0% would be misleading to display
      expect(s.value).toBeLessThanOrEqual(100)
    })
  })

  it('labels are Positive, Neutral, Negative', () => {
    // Verify all three required label strings are present
    const labels = SENTIMENT_STATS.map(s => s.label)
    expect(labels).toContain('Positive')
    expect(labels).toContain('Neutral')
    expect(labels).toContain('Negative')
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 5 — FEEDBACK_FEED Data Contract
// Used by: Sentiment page — the scrollable list of individual resident comments
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 5 — FEEDBACK_FEED data contract', () => {

  it('has 8 feedback entries', () => {
    expect(FEEDBACK_FEED).toHaveLength(8)
  })

  it('every entry has required fields', () => {
    // Each feedback card in the UI reads all these fields to render
    FEEDBACK_FEED.forEach(entry => {
      expect(entry).toHaveProperty('id')         // unique identifier
      expect(entry).toHaveProperty('resident')   // resident's name shown on the card
      expect(entry).toHaveProperty('block')      // their housing block
      expect(entry).toHaveProperty('comment')    // the actual feedback text
      expect(entry).toHaveProperty('sentiment')  // AI-classified label (Positive/Neutral/Negative)
      expect(entry).toHaveProperty('date')       // submission date
    })
  })

  it('all sentiment labels are valid', () => {
    // Each feedback must have one of the three valid AI sentiment labels
    const validLabels = ['Positive', 'Neutral', 'Negative']
    FEEDBACK_FEED.forEach(entry => expect(validLabels).toContain(entry.sentiment))
  })

  it('all IDs are unique', () => {
    // Duplicate IDs would cause React key warnings and potential rendering bugs
    const ids = FEEDBACK_FEED.map(e => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 6 — MOCK_USERS Data Contract
// Used by: Users page — resident account management with ban/unban capability
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 6 — MOCK_USERS data contract', () => {

  it('has exactly 25 users', () => {
    expect(MOCK_USERS).toHaveLength(25)
  })

  it('every user has required fields', () => {
    // All fields are displayed on the Users page table
    MOCK_USERS.forEach(u => {
      expect(u).toHaveProperty('id')               // e.g. "U-001"
      expect(u).toHaveProperty('name')             // resident's full name
      expect(u).toHaveProperty('block')            // which block they live in
      expect(u).toHaveProperty('unit')             // apartment/unit number (e.g. "A-07")
      expect(u).toHaveProperty('phone')            // contact number
      expect(u).toHaveProperty('complaintsCount')  // total complaints submitted by this user
      expect(u).toHaveProperty('status')           // Active | Banned
    })
  })

  it('all user statuses are Active or Banned', () => {
    // These are the only two statuses in Fixify's user management system
    // "Banned" means the admin has blocked this resident from submitting new complaints
    MOCK_USERS.forEach(u => expect(['Active', 'Banned']).toContain(u.status))
  })

  it('banned users are a minority (less than 20%)', () => {
    // Banning should be a rare action — if more than 20% of users are banned,
    // something is wrong with the data (or the moderation policy)
    const bannedCount = MOCK_USERS.filter(u => u.status === 'Banned').length
    expect(bannedCount / MOCK_USERS.length).toBeLessThan(0.2)
  })

  it('all user IDs are unique', () => {
    const ids = MOCK_USERS.map(u => u.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 7 — ANALYTICS_MOCK Data Contract
// Used by: Analytics page — the admin selects a date range and sees charts update
// The data is keyed by date range label: "This Week", "This Month", etc.
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 7 — ANALYTICS_MOCK data contract', () => {

  it('has data for all 4 date ranges', () => {
    // The date range toggle on the Analytics page has 4 options
    // Each option must have a corresponding data key in ANALYTICS_MOCK
    ANALYTICS_DATE_RANGES.forEach(range => {
      expect(ANALYTICS_MOCK).toHaveProperty(range)
    })
  })

  it('each date range has 4 stat cards', () => {
    // The top row of Analytics always shows 4 stat cards regardless of date range
    ANALYTICS_DATE_RANGES.forEach(range => {
      expect(ANALYTICS_MOCK[range].stats).toHaveLength(4)
    })
  })

  it('each date range has trendLabels and trendDatasets', () => {
    // trendLabels are the x-axis labels for the line chart (e.g. ['Mon','Tue',...])
    // trendDatasets has 2 lines: Submitted (blue) and Resolved (green)
    ANALYTICS_DATE_RANGES.forEach(range => {
      expect(ANALYTICS_MOCK[range].trendLabels.length).toBeGreaterThan(0)
      expect(ANALYTICS_MOCK[range].trendDatasets).toHaveLength(2) // Submitted + Resolved
    })
  })

  it('each date range has categoryBars and statusSlices', () => {
    // categoryBars feeds the horizontal bar chart (complaints by category)
    // statusSlices feeds the donut chart (complaints by status)
    ANALYTICS_DATE_RANGES.forEach(range => {
      expect(ANALYTICS_MOCK[range].categoryBars.length).toBeGreaterThan(0)
      expect(ANALYTICS_MOCK[range].statusSlices.length).toBeGreaterThan(0)
    })
  })

  it('status slices always include all 4 statuses', () => {
    // The status donut chart must always show all 4 segments
    // A missing status would cause the chart to look incomplete
    const requiredStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected']
    ANALYTICS_DATE_RANGES.forEach(range => {
      const sliceLabels = ANALYTICS_MOCK[range].statusSlices.map(s => s.label)
      requiredStatuses.forEach(status => expect(sliceLabels).toContain(status))
    })
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 8 — REPORT_PREVIEW Data Contract
// Used by: Reports page — admin generates a preview before downloading PDF/Excel
// Three report types exist, each with a different table structure
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 8 — REPORT_PREVIEW data contract', () => {

  it('has all 3 report types', () => {
    // These are the three report templates available to the admin:
    //   1. Complaint Summary  — all complaints in a date range
    //   2. Resolution Rate    — per-block resolution statistics
    //   3. Pending Only       — only unresolved complaints
    expect(REPORT_PREVIEW).toHaveProperty('Complaint Summary')
    expect(REPORT_PREVIEW).toHaveProperty('Resolution Rate')
    expect(REPORT_PREVIEW).toHaveProperty('Pending Only')
  })

  it('Pending Only report contains only Pending status rows', () => {
    // This report is specifically for complaints awaiting action
    // If any row has a different status, the report filter logic is broken
    REPORT_PREVIEW['Pending Only'].forEach(row => {
      expect(row.status).toBe('Pending')
    })
  })

  it('Resolution Rate report has percentage strings in rate field', () => {
    // The rate column should contain strings like "80%", "77%", "82%"
    // The regex /^\d+%$/ matches: one or more digits followed by a percent sign
    REPORT_PREVIEW['Resolution Rate'].forEach(row => {
      expect(row.rate).toMatch(/^\d+%$/)
    })
  })

  it('Resolution Rate — resolved never exceeds total per block', () => {
    // Sanity check: you cannot resolve more complaints than were submitted
    // Also: pending count cannot exceed the total
    REPORT_PREVIEW['Resolution Rate'].forEach(row => {
      expect(row.resolved).toBeLessThanOrEqual(row.total)
      expect(row.pending).toBeLessThanOrEqual(row.total)
    })
  })
})
