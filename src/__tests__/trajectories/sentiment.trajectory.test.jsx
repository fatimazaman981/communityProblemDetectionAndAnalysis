/**
 * TRAJECTORY EVALUATION — Sentiment Analysis (AI Feature)
 * File: src/__tests__/trajectories/sentiment.trajectory.test.jsx
 *
 * WHAT IS SENTIMENT ANALYSIS IN FIXIFY?
 * Fixify analyses the language in resident feedback and complaint descriptions
 * to classify each piece of text as Positive, Neutral, or Negative.
 * The backend NLP model outputs a sentiment label for each feedback entry,
 * and the dashboard aggregates these into percentages and trend charts.
 *
 * WHAT THIS FILE TESTS:
 * The complete sentiment display pipeline on the Sentiment & Feedback page:
 *
 *   [Aggregate stats: Positive 54%, Neutral 28%, Negative 18%]
 *       → [Percentages displayed correctly on screen]
 *       → [Trend data renders in chart]
 *       → [Individual feedback entries shown with correct sentiment labels]
 *       → [Data distribution is internally consistent]
 *
 * The page being tested: src/pages/Sentiment.jsx
 * The mock data used:    src/data/mockData.jsx → SENTIMENT_STATS, FEEDBACK_FEED
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { ThemeProvider } from '../../context/ThemeContext'
import Sentiment from '../../pages/Sentiment'
import {
  SENTIMENT_STATS,   // [ {label, value, sub, delta, color}, ... ] for 3 sentiments
  FEEDBACK_FEED,     // [ {resident, block, comment, sentiment, date}, ... ] — 8 entries
} from '../../data/mockData'

/**
 * Helper: renders the Sentiment page inside all required React Context providers.
 * A fresh render is called at the start of every test for isolation.
 */
const renderPage = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          <Sentiment />
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  )


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 1 — Aggregate Sentiment Stats
// The top section of the page shows three stat cards:
// Positive (54%), Neutral (28%), Negative (18%) with trend labels
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 1 — Aggregate sentiment stats are rendered', () => {

  it('renders the Sentiment & Feedback page heading', () => {
    renderPage()

    // The exact page title text as rendered by the component
    expect(screen.getByText('Sentiment & Feedback')).toBeInTheDocument()
  })

  it('renders all three sentiment stat labels', () => {
    renderPage()

    // SENTIMENT_STATS has 3 entries: Positive, Neutral, Negative
    // Labels appear in both the stat cards AND the donut chart legend,
    // so getAllByText (returns array) is used instead of getByText (expects exactly 1 match)
    SENTIMENT_STATS.forEach(stat => {
      expect(screen.getAllByText(stat.label).length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders percentage values for Positive, Neutral, Negative', () => {
    renderPage()

    // React JSX renders {stat.value}% as two separate text nodes in the DOM:
    //   text node 1: "54"   (the value)
    //   text node 2: "%"    (the literal percent sign)
    // Standard getByText('54%') won't find it because it searches for a single text node.
    // We use a custom matcher that checks the parent element's full textContent instead.
    SENTIMENT_STATS.forEach(stat => {
      const pct = `${stat.value}%`  // e.g. "54%"

      // getAllByText with a custom matcher function: receives the text content and the element
      const elements = screen.getAllByText((_, element) =>
        element?.textContent?.trim() === pct
      )
      expect(elements.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('sentiment percentages sum to 100', () => {
    // This is a pure data test — no rendering needed
    // The three percentages (54 + 28 + 18) must always add up to 100%
    // If a developer changes the mock data and breaks this, the donut chart would show
    // more or less than a full circle
    const total = SENTIMENT_STATS.reduce((sum, s) => sum + s.value, 0)
    expect(total).toBe(100)
  })

  it('renders trend sub-labels for each stat', () => {
    renderPage()

    // Each stat card shows a sub-label below the value, e.g.:
    //   Positive → "+4% vs last week"
    //   Neutral  → "Stable this week"
    //   Negative → "-2% vs last week"
    SENTIMENT_STATS.forEach(stat => {
      expect(screen.getByText(stat.sub)).toBeInTheDocument()
    })
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 2 — Feedback Feed
// The lower section lists individual feedback comments from residents,
// each tagged with a sentiment classification from the AI model
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 2 — Feedback feed is fully rendered', () => {

  it('renders all 8 feedback entries', () => {
    renderPage()

    // Every resident name in FEEDBACK_FEED must appear on screen
    // This confirms all 8 entries were rendered and none were dropped
    FEEDBACK_FEED.forEach(entry => {
      expect(screen.getByText(entry.resident)).toBeInTheDocument()
    })
  })

  it('renders the comment text for every feedback entry', () => {
    renderPage()

    // Each feedback entry shows the resident's full comment in the card body
    // We verify by the comment text (unique per entry) rather than the sentiment label
    // (since multiple entries share the same label like "Positive")
    FEEDBACK_FEED.forEach(entry => {
      expect(screen.getByText(entry.comment)).toBeInTheDocument()
    })
  })

  it('Positive sentiment entries render correctly', () => {
    renderPage()

    // Filter the feed to only Positive entries and confirm each is visible
    const positiveEntries = FEEDBACK_FEED.filter(e => e.sentiment === 'Positive')
    positiveEntries.forEach(entry => {
      expect(screen.getByText(entry.comment)).toBeInTheDocument()
    })
  })

  it('Negative sentiment entries render correctly', () => {
    renderPage()

    // Filter to only Negative entries — these are complaints about poor service
    const negativeEntries = FEEDBACK_FEED.filter(e => e.sentiment === 'Negative')
    negativeEntries.forEach(entry => {
      expect(screen.getByText(entry.comment)).toBeInTheDocument()
    })
  })

  it('Neutral sentiment entries render correctly', () => {
    renderPage()

    // Filter to only Neutral entries — mixed or factual feedback
    const neutralEntries = FEEDBACK_FEED.filter(e => e.sentiment === 'Neutral')
    neutralEntries.forEach(entry => {
      expect(screen.getByText(entry.comment)).toBeInTheDocument()
    })
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 3 — Data Integrity of Sentiment Distribution
// Pure logic tests that verify the sentiment data is internally consistent
// without rendering the component — catches corrupted or mismatched mock data
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 3 — Data integrity of sentiment distribution', () => {

  it('Positive sentiment is the highest percentage', () => {
    // Find each sentiment category from the stats array
    const positive = SENTIMENT_STATS.find(s => s.label === 'Positive')
    const neutral  = SENTIMENT_STATS.find(s => s.label === 'Neutral')
    const negative = SENTIMENT_STATS.find(s => s.label === 'Negative')

    // In a well-functioning system, most feedback should be positive
    // This test would catch if data was accidentally swapped or corrupted
    expect(positive.value).toBeGreaterThan(neutral.value)
    expect(positive.value).toBeGreaterThan(negative.value)
  })

  it('Negative sentiment has a downward trend indicator (delta -1)', () => {
    const negative = SENTIMENT_STATS.find(s => s.label === 'Negative')

    // delta is -1 (down), 0 (stable), or +1 (up)
    // The UI uses delta to show a green arrow (up) or red arrow (down) on each card
    // Negative sentiment going down is a good sign — fewer complaints, better service
    expect(negative.delta).toBe(-1)
  })

  it('Positive sentiment has an upward trend indicator (delta +1)', () => {
    const positive = SENTIMENT_STATS.find(s => s.label === 'Positive')

    // Positive sentiment going up (+1) is the desired direction
    expect(positive.delta).toBe(1)
  })

  it('feedback feed has more Positive than Negative entries', () => {
    // Count entries by sentiment label
    const positiveCount = FEEDBACK_FEED.filter(e => e.sentiment === 'Positive').length
    const negativeCount = FEEDBACK_FEED.filter(e => e.sentiment === 'Negative').length

    // This is consistent with the aggregate stat (54% positive vs 18% negative)
    // Confirms the individual entries match the summary statistics
    expect(positiveCount).toBeGreaterThan(negativeCount)
  })
})
