import { useState, useMemo } from 'react'
import { ALL_COMPLAINTS } from '../data/mockData'

const PAGE_SIZE = 10

export function useComplaints() {
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    block: '',
    search: '',
  })
  const [page, setPage] = useState(1)

  // Swap ALL_COMPLAINTS for an API call here when backend is ready
  const allComplaints = ALL_COMPLAINTS

  const filtered = useMemo(() => {
    return allComplaints.filter((c) => {
      if (filters.status && c.status !== filters.status) return false
      if (filters.category && c.category !== filters.category) return false
      if (filters.block && c.block !== filters.block) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        return (
          c.id.toLowerCase().includes(q) ||
          c.resident.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [allComplaints, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const complaints = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const pendingCount = useMemo(
    () => allComplaints.filter((c) => c.status === 'Pending').length,
    [allComplaints],
  )

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  function resetFilters() {
    setFilters({ status: '', category: '', block: '', search: '' })
    setPage(1)
  }

  function goToPage(n) {
    setPage(Math.max(1, Math.min(n, totalPages)))
  }

  return {
    complaints,
    filters,
    setFilter,
    resetFilters,
    page,
    totalPages,
    goToPage,
    total: allComplaints.length,
    filteredTotal: filtered.length,
    pendingCount,
  }
}
