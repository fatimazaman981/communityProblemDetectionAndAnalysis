/**
 * TRAJECTORY EVALUATION — useComplaints Hook
 * File: src/__tests__/unit/useComplaints.test.js
 *
 * WHAT IS TRAJECTORY EVALUATION?
 * A trajectory is a sequence of states a system passes through in response to
 * user actions. Instead of testing one action in isolation, trajectory evaluation
 * tests a chain of actions (e.g. filter → change filter → reset → paginate) and
 * verifies the system is correct at every step along the way.
 *
 * WHAT IS useComplaints?
 * useComplaints is a custom React hook (src/hooks/useComplaints.js) that manages
 * the entire complaints list state: filtering by status/category/block, text search,
 * and pagination. It is the core logic layer for the Complaints page.
 *
 * WHY TEST A HOOK IN ISOLATION?
 * By testing the hook directly (without rendering a full page), we verify that the
 * business logic is correct independently of the UI. If a test fails here, we know
 * the bug is in the hook, not in how the page renders it.
 */

// Vitest test utilities: describe groups tests, it defines one test, expect makes assertions
import { describe, it, expect } from 'vitest'

// renderHook renders a React hook in a minimal environment so we can inspect its return values
// act wraps state-changing calls so React can process the update before we assert
import { renderHook, act } from '@testing-library/react'

// The hook we are testing
import { useComplaints } from '../../hooks/useComplaints'

// The mock dataset — 25 complaints used as the data source inside the hook
import { ALL_COMPLAINTS } from '../../data/mockData'


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 1 — Initial State
// Expected state when the hook first loads, before any user interaction
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 1 — Initial state is correct', () => {

  it('loads all 25 complaints on first render', () => {
    // Render the hook and capture its return values in `result.current`
    const { result } = renderHook(() => useComplaints())

    // The hook should know the total number of records in the dataset
    expect(result.current.total).toBe(25)

    // It should start on page 1
    expect(result.current.page).toBe(1)

    // With 25 complaints and 10 per page → ceil(25/10) = 3 pages
    expect(result.current.totalPages).toBe(3)

    // Page 1 should contain exactly 10 complaints (the first 10 of 25)
    expect(result.current.complaints).toHaveLength(10)

    // All filter fields should be empty strings (no filters applied yet)
    expect(result.current.filters).toEqual({ status: '', category: '', block: '', search: '' })
  })

  it('counts pending complaints correctly from mock data', () => {
    const { result } = renderHook(() => useComplaints())

    // Calculate the expected count directly from the raw mock data
    const expectedPending = ALL_COMPLAINTS.filter(c => c.status === 'Pending').length

    // The hook's pendingCount must match — this is used in the Sidebar badge
    expect(result.current.pendingCount).toBe(expectedPending)
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 2 — Status Filter
// Simulates an admin clicking the Status dropdown on the Complaints page
// Steps: apply Pending → switch to Resolved → clear filter
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 2 — Status filter narrows the list and resets to page 1', () => {

  it('step 1: apply Pending filter → only Pending complaints visible', () => {
    const { result } = renderHook(() => useComplaints())

    // act() wraps the state update so React processes it before we read the result
    act(() => result.current.setFilter('status', 'Pending'))

    // Calculate what the filtered result should be from raw data
    const pending = ALL_COMPLAINTS.filter(c => c.status === 'Pending')

    // filteredTotal is the count of items matching the active filters
    expect(result.current.filteredTotal).toBe(pending.length)

    // Every complaint on the current page must have status === 'Pending'
    result.current.complaints.forEach(c => expect(c.status).toBe('Pending'))
  })

  it('step 2: change to Resolved filter → only Resolved complaints visible', () => {
    const { result } = renderHook(() => useComplaints())

    // First apply Pending, then switch to Resolved — testing that the hook correctly
    // replaces the old filter value rather than accumulating multiple values
    act(() => result.current.setFilter('status', 'Pending'))
    act(() => result.current.setFilter('status', 'Resolved'))

    const resolved = ALL_COMPLAINTS.filter(c => c.status === 'Resolved')
    expect(result.current.filteredTotal).toBe(resolved.length)
    result.current.complaints.forEach(c => expect(c.status).toBe('Resolved'))
  })

  it('step 3: clear status filter → all complaints return', () => {
    const { result } = renderHook(() => useComplaints())

    act(() => result.current.setFilter('status', 'Pending'))

    // Setting a filter to empty string ('') means "no filter" — show everything
    act(() => result.current.setFilter('status', ''))

    // All 25 complaints should be visible again
    expect(result.current.filteredTotal).toBe(25)
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 3 — Category Filter
// Simulates filtering by complaint type (e.g. Water Supply, Security)
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 3 — Category filter', () => {

  it('filters to Water Supply complaints only', () => {
    const { result } = renderHook(() => useComplaints())
    act(() => result.current.setFilter('category', 'Water Supply'))

    // Count how many Water Supply complaints exist in the raw data
    const water = ALL_COMPLAINTS.filter(c => c.category === 'Water Supply')
    expect(result.current.filteredTotal).toBe(water.length)

    // Every returned complaint must belong to this category
    result.current.complaints.forEach(c => expect(c.category).toBe('Water Supply'))
  })

  it('filters to Security complaints only', () => {
    const { result } = renderHook(() => useComplaints())
    act(() => result.current.setFilter('category', 'Security'))

    const security = ALL_COMPLAINTS.filter(c => c.category === 'Security')
    expect(result.current.filteredTotal).toBe(security.length)
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 4 — Block Filter
// Simulates an admin filtering complaints by residential block
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 4 — Block filter', () => {

  it('filters to Block A complaints only', () => {
    const { result } = renderHook(() => useComplaints())
    act(() => result.current.setFilter('block', 'Block A'))

    const blockA = ALL_COMPLAINTS.filter(c => c.block === 'Block A')
    expect(result.current.filteredTotal).toBe(blockA.length)

    // No complaint from Block B, C, D, or E should appear
    result.current.complaints.forEach(c => expect(c.block).toBe('Block A'))
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 5 — Search
// Simulates the admin typing in the search box
// The hook searches across: complaint ID, resident name, and category
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 5 — Search across ID, resident, category', () => {

  it('search by complaint ID finds the right complaint', () => {
    const { result } = renderHook(() => useComplaints())

    // Type a specific complaint ID into the search box
    act(() => result.current.setFilter('search', 'C-1042'))

    // Only 1 complaint should match this exact ID
    expect(result.current.filteredTotal).toBe(1)
    expect(result.current.complaints[0].id).toBe('C-1042')
  })

  it('search by resident name (partial, case-insensitive) finds matches', () => {
    const { result } = renderHook(() => useComplaints())

    // Type a lowercase partial name — the hook must handle case-insensitive matching
    act(() => result.current.setFilter('search', 'fatima'))

    // Calculate expected matches using the same logic as the hook
    const matches = ALL_COMPLAINTS.filter(c =>
      c.resident.toLowerCase().includes('fatima')
    )
    expect(result.current.filteredTotal).toBe(matches.length)
  })

  it('search with no match returns zero results', () => {
    const { result } = renderHook(() => useComplaints())

    // A nonsense search string that matches no complaint
    act(() => result.current.setFilter('search', 'zzz-no-match-xxx'))

    expect(result.current.filteredTotal).toBe(0)
    expect(result.current.complaints).toHaveLength(0)

    // totalPages must not go below 1 even when no results exist
    // (prevents division-by-zero errors in the pagination UI)
    expect(result.current.totalPages).toBe(1)
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 6 — Combined Filters
// Tests that multiple filters work together (AND logic, not OR)
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 6 — Combined filters narrow results further', () => {

  it('Block A + Pending returns only pending Block A complaints', () => {
    const { result } = renderHook(() => useComplaints())

    // Apply both filters one after another
    act(() => result.current.setFilter('block', 'Block A'))
    act(() => result.current.setFilter('status', 'Pending'))

    // The expected result is complaints that satisfy BOTH conditions
    const expected = ALL_COMPLAINTS.filter(
      c => c.block === 'Block A' && c.status === 'Pending'
    )

    expect(result.current.filteredTotal).toBe(expected.length)

    // Every returned complaint must satisfy both conditions
    result.current.complaints.forEach(c => {
      expect(c.block).toBe('Block A')
      expect(c.status).toBe('Pending')
    })
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 7 — Pagination
// Tests the page navigation logic: next page, last page, boundary clamping,
// and automatic page reset when a filter is applied
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 7 — Pagination trajectory', () => {

  it('page 2 has correct complaints (items 11–20)', () => {
    const { result } = renderHook(() => useComplaints())

    act(() => result.current.goToPage(2))
    expect(result.current.page).toBe(2)

    // Page 2 should have 10 items (items index 10–19 from ALL_COMPLAINTS)
    expect(result.current.complaints).toHaveLength(10)

    // The first complaint on page 2 must match what slice() would return
    expect(result.current.complaints[0].id).toBe(ALL_COMPLAINTS[10].id)
  })

  it('page 3 has the remaining 5 complaints', () => {
    const { result } = renderHook(() => useComplaints())

    act(() => result.current.goToPage(3))
    expect(result.current.page).toBe(3)

    // 25 complaints total: page 1 = 10, page 2 = 10, page 3 = 5
    expect(result.current.complaints).toHaveLength(5)
  })

  it('goToPage beyond max clamps to totalPages', () => {
    const { result } = renderHook(() => useComplaints())

    // Trying to go to page 999 should silently clamp to the last page
    act(() => result.current.goToPage(999))
    expect(result.current.page).toBe(result.current.totalPages)
  })

  it('goToPage below 1 clamps to page 1', () => {
    const { result } = renderHook(() => useComplaints())

    // Trying to go to page 0 or negative should clamp to page 1
    act(() => result.current.goToPage(0))
    expect(result.current.page).toBe(1)
  })

  it('applying a filter resets page back to 1', () => {
    const { result } = renderHook(() => useComplaints())

    // Navigate to page 2 first
    act(() => result.current.goToPage(2))
    expect(result.current.page).toBe(2)

    // When a filter is applied, the hook must reset to page 1 so the admin
    // does not land on an empty page (e.g. filtered result has only 1 page)
    act(() => result.current.setFilter('status', 'Pending'))
    expect(result.current.page).toBe(1)
  })
})


// ═══════════════════════════════════════════════════════════════════════════════
// TRAJECTORY 8 — Full Reset
// Tests the "Reset Filters" button behaviour: restores the hook to initial state
// ═══════════════════════════════════════════════════════════════════════════════
describe('Trajectory 8 — Reset restores initial state', () => {

  it('resetFilters after combined filters returns to all 25 complaints on page 1', () => {
    const { result } = renderHook(() => useComplaints())

    // Apply multiple filters and navigate away from page 1
    act(() => result.current.setFilter('block', 'Block C'))
    act(() => result.current.setFilter('status', 'Resolved'))
    act(() => result.current.goToPage(2))

    // Now reset everything
    act(() => result.current.resetFilters())

    // All 25 complaints must be visible again
    expect(result.current.filteredTotal).toBe(25)

    // Page must be back to 1
    expect(result.current.page).toBe(1)

    // All filter fields must be empty strings
    expect(result.current.filters).toEqual({ status: '', category: '', block: '', search: '' })
  })
})
