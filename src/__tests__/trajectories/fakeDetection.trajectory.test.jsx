/**
 * TRAJECTORY EVALUATION — Fake Detection (AI Feature)
 * File: src/__tests__/trajectories/fakeDetection.trajectory.test.jsx
 *
 * WHAT IS FAKE DETECTION IN FIXIFY?
 * Fixify uses an AI model (on the Django backend) to analyse incoming complaints
 * and assign a "fake confidence score" — a percentage (0–100%) indicating how
 * likely a complaint is exaggerated or fabricated. Complaints above a threshold
 * are flagged and sent to this admin review queue.
 *
 * WHAT THIS FILE TESTS:
 * The complete admin moderation workflow for the Fake Detection page:
 *
 *   [Full queue with 6 flagged complaints]
 *       → [Admin reviews confidence scores and risk levels]
 *       → [Admin marks a complaint as fake → card dims, button disables]
 *       → [Admin clears a complaint → card removed from queue]
 *       → [All complaints cleared → empty state message shown]
 *
 * The page being tested: src/pages/FakeDetection.jsx
 * The mock data used:    src/data/mockData.jsx → FLAGGED_COMPLAINTS, FAKE_DETECTION_STATS
 *
 * WHY TRAJECTORY TESTING HERE?
 * Each admin action changes the state of the queue. We test that each action
 * produces exactly the right UI change — no more, no less.
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { ThemeProvider } from '../../context/ThemeContext'
import FakeDetection from '../../pages/FakeDetection'
import { FLAGGED_COMPLAINTS, FAKE_DETECTION_STATS } from '../../data/mockData'

/**
 * Helper function: renders the FakeDetection page inside all required providers.
 * Called at the start of each test so every test gets a fresh, isolated render.
 */
const renderPage = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          <FakeDetection />
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  )


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 1 — Initial Render: Full Flagged Queue
// Verifies that all AI-flagged complaints and their data are displayed correctly
// when the admin first opens the Fake Detection page
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 1 — Initial render: full flagged queue displayed', () => {

  it('shows the page title with AI POWERED badge', () => {
    renderPage()

    // The page heading "Fake Detection" must be visible
    expect(screen.getByText('Fake Detection')).toBeInTheDocument()

    // The "AI POWERED" pill badge next to the title indicates this is an AI feature
    expect(screen.getByText('AI POWERED')).toBeInTheDocument()
  })

  it('renders all 4 summary stat cards', () => {
    renderPage()

    // FAKE_DETECTION_STATS contains: Total Flagged, Warnings Issued, Accounts Banned, Fake Rate
    // Each stat must show its label and numeric value
    FAKE_DETECTION_STATS.forEach(stat => {
      expect(screen.getByText(stat.label)).toBeInTheDocument()
      expect(screen.getByText(stat.value)).toBeInTheDocument()
    })
  })

  it('renders correct initial count in "X remaining" label', () => {
    renderPage()

    // The subtitle under "Flagged Complaints" shows how many are left to review
    // Initially it should be the full count from FLAGGED_COMPLAINTS
    expect(screen.getByText(`(${FLAGGED_COMPLAINTS.length} remaining)`)).toBeInTheDocument()
  })

  it('renders every flagged complaint ID', () => {
    renderPage()

    // Each complaint card must show the complaint ID (e.g. "C-0987")
    // so the admin can cross-reference it in the main complaints list
    FLAGGED_COMPLAINTS.forEach(item => {
      expect(screen.getByText(item.id)).toBeInTheDocument()
    })
  })

  it('renders confidence percentage for each complaint', () => {
    renderPage()

    // Each card shows the AI's confidence score as a percentage (e.g. "91%")
    // alongside a progress bar coloured red/amber/green based on the score
    FLAGGED_COMPLAINTS.forEach(item => {
      expect(screen.getByText(`${item.confidence}%`)).toBeInTheDocument()
    })
  })

  it('renders risk badge for each complaint', () => {
    renderPage()

    // Risk badges (High Risk / Medium Risk / Low Risk) are shown on each card
    // We verify at least one "High Risk" badge exists (there are 3 in the mock data)
    const highBadges = screen.getAllByText('High Risk')
    expect(highBadges.length).toBeGreaterThanOrEqual(1)
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 2 — Mark as Fake
// When the admin clicks "Mark as Fake", the card should visually change
// to show it has been acted on, but remain visible in the queue
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 2 — Mark as fake changes card state', () => {

  it('clicking "Mark as Fake" on a card shows "Marked as Fake" badge', () => {
    renderPage()

    // Get all "Mark as Fake" buttons — one per complaint card
    const markBtns = screen.getAllByRole('button', { name: /mark as fake/i })

    // Click the first complaint's "Mark as Fake" button (complaint C-0987)
    fireEvent.click(markBtns[0])

    // A "Marked as Fake" badge must now appear on that card
    // This tells the admin the action has been recorded
    expect(screen.getByText('Marked as Fake')).toBeInTheDocument()
  })

  it('"Mark as Fake" button becomes disabled after clicking', () => {
    renderPage()

    const markBtns = screen.getAllByRole('button', { name: /mark as fake/i })
    fireEvent.click(markBtns[0])

    // Once marked, the button must become disabled to prevent double-clicking
    // The UI also changes the button's colour to grey to communicate this
    expect(markBtns[0]).toBeDisabled()
  })

  it('card count label does not change when marked as fake (card stays visible)', () => {
    renderPage()

    const markBtns = screen.getAllByRole('button', { name: /mark as fake/i })
    fireEvent.click(markBtns[0])

    // "Mark as Fake" keeps the card visible (just dims it at 72% opacity)
    // so the admin can see what they marked before taking further action
    // The "(X remaining)" count must NOT change
    expect(screen.getByText(`(${FLAGGED_COMPLAINTS.length} remaining)`)).toBeInTheDocument()
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 3 — Clear (Dismiss) a Complaint
// When the admin clicks "Clear", the complaint is dismissed and removed
// from the visible queue entirely — the count must decrease
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 3 — Clear removes complaint from the queue', () => {

  it('clicking "Clear" removes the complaint from the list', () => {
    renderPage()

    // Get all "Clear" buttons and remember which complaint we are removing
    const clearBtns = screen.getAllByRole('button', { name: /clear/i })
    const removedId = FLAGGED_COMPLAINTS[0].id  // "C-0987"

    fireEvent.click(clearBtns[0])

    // After clearing, the complaint ID must no longer appear anywhere on the page
    expect(screen.queryByText(removedId)).not.toBeInTheDocument()
  })

  it('remaining count decrements by 1 after each clear', () => {
    renderPage()

    const clearBtns = screen.getAllByRole('button', { name: /clear/i })
    fireEvent.click(clearBtns[0])

    // Count goes from 6 → 5
    expect(screen.getByText(`(${FLAGGED_COMPLAINTS.length - 1} remaining)`)).toBeInTheDocument()
  })

  it('multiple clears accumulate correctly', () => {
    renderPage()

    // Clear the first complaint
    let clearBtns = screen.getAllByRole('button', { name: /clear/i })
    fireEvent.click(clearBtns[0])

    // Re-query the DOM for remaining clear buttons after the first one is removed
    clearBtns = screen.getAllByRole('button', { name: /clear/i })
    fireEvent.click(clearBtns[0])

    // After 2 clears, count goes from 6 → 4
    expect(screen.getByText(`(${FLAGGED_COMPLAINTS.length - 2} remaining)`)).toBeInTheDocument()
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 4 — Empty Queue
// Tests the end state when all complaints have been reviewed and cleared.
// The page must show an appropriate empty state message.
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 4 — Empty queue: all complaints cleared', () => {

  it('clearing all complaints shows the empty state message', () => {
    renderPage()

    // Clear every complaint one by one using a while loop
    // After each clear, re-query the DOM because the button list has changed
    let clearBtns = screen.getAllByRole('button', { name: /clear/i })
    while (clearBtns.length > 0) {
      fireEvent.click(clearBtns[0])
      clearBtns = screen.queryAllByRole('button', { name: /clear/i }) // queryAll returns [] if none found
    }

    // When the queue is empty, a placeholder message must be displayed
    expect(screen.getByText('All flagged complaints have been reviewed')).toBeInTheDocument()

    // The counter should show (0 remaining)
    expect(screen.getByText('(0 remaining)')).toBeInTheDocument()
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 5 — Previously Warned Complaints
// Some complaints arrive with status = 'warned' (already received a warning).
// These must still appear in the review queue — they are not automatically hidden.
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 5 — AI confidence color logic', () => {

  it('warned complaints (status=warned) are still rendered', () => {
    renderPage()

    // Filter the mock data to find complaints already in 'warned' state
    const warnedItems = FLAGGED_COMPLAINTS.filter(i => i.status === 'warned')

    // Each warned complaint must still be visible so the admin can take further action
    warnedItems.forEach(item => {
      expect(screen.getByText(item.id)).toBeInTheDocument()
    })
  })
})
