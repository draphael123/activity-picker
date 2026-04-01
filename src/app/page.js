'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import ActivityCard from '@/components/ActivityCard'
import FilterBar from '@/components/FilterBar'

const PAGE_SIZE = 30

export default function Home() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [activeDifficulty, setActiveDifficulty] = useState('all')
  const [activeCost, setActiveCost] = useState('all')
  const [activeSetting, setActiveSetting] = useState('all')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('category')

  useEffect(() => {
    fetchActivities()
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [activeCategory, activeStatus, activeDifficulty, activeCost, activeSetting, search, sortBy])

  async function fetchActivities() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error
      setActivities(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id, newStatus) {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    )

    setSaving(true)
    try {
      const { error } = await supabase
        .from('activities')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      fetchActivities()
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Filtered and sorted activities
  const filtered = useMemo(() => {
    let result = activities.filter((a) => {
      if (activeCategory !== 'all' && a.category !== activeCategory) return false
      if (activeStatus === 'unrated' && a.status !== null) return false
      if (activeStatus === 'interested' && a.status !== 'interested') return false
      if (activeStatus === 'not_interested' && a.status !== 'not_interested') return false
      if (activeStatus === 'unsure' && a.status !== 'unsure') return false
      if (activeDifficulty !== 'all' && a.difficulty !== activeDifficulty) return false
      if (activeCost !== 'all' && a.cost !== activeCost) return false
      if (activeSetting !== 'all' && a.setting !== activeSetting) return false
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'difficulty') {
        const order = { easy: 0, moderate: 1, hard: 2 }
        return (order[a.difficulty] || 0) - (order[b.difficulty] || 0)
      }
      if (sortBy === 'cost') {
        const order = { free: 0, cheap: 1, moderate: 2, expensive: 3 }
        return (order[a.cost] || 0) - (order[b.cost] || 0)
      }
      // Default: category then name
      return a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    })

    return result
  }, [activities, activeCategory, activeStatus, activeDifficulty, activeCost, activeSetting, search, sortBy])

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginatedActivities = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Counts
  const counts = useMemo(() => ({
    interested: activities.filter((a) => a.status === 'interested').length,
    not_interested: activities.filter((a) => a.status === 'not_interested').length,
    unsure: activities.filter((a) => a.status === 'unsure').length,
    unrated: activities.filter((a) => a.status === null).length,
  }), [activities])

  function clearAllFilters() {
    setActiveCategory('all')
    setActiveStatus('all')
    setActiveDifficulty('all')
    setActiveCost('all')
    setActiveSetting('all')
    setSearch('')
    setSortBy('category')
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md text-center">
          <h2 className="text-red-400 text-lg font-semibold mb-2">Connection Error</h2>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => { setError(null); fetchActivities(); }}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Activity Picker <span className="text-blue-400">🎯</span>
        </h1>
        <p className="text-slate-400">
          Rate hobbies and activities to track what you&apos;re into. Your choices are saved automatically.
        </p>
      </div>

      {/* Search + Sort row */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500/50 transition"
        >
          <option value="category">Sort: Category</option>
          <option value="name">Sort: Name</option>
          <option value="difficulty">Sort: Difficulty</option>
          <option value="cost">Sort: Cost</option>
        </select>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          activeDifficulty={activeDifficulty}
          setActiveDifficulty={setActiveDifficulty}
          activeCost={activeCost}
          setActiveCost={setActiveCost}
          activeSetting={activeSetting}
          setActiveSetting={setActiveSetting}
          counts={counts}
        />
      </div>

      {/* Saving indicator */}
      {saving && (
        <div className="fixed top-4 right-4 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm px-3 py-1.5 rounded-lg animate-pulse z-50">
          Saving...
        </div>
      )}

      {/* Activity grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 animate-pulse">
              <div className="h-3 bg-slate-700 rounded w-20 mb-4"></div>
              <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-full mb-4"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-9 bg-slate-700 rounded-lg flex-1"></div>
                <div className="h-9 bg-slate-700 rounded-lg flex-1"></div>
                <div className="h-9 bg-slate-700 rounded-lg flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      ) : paginatedActivities.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-400">No activities match your filters.</p>
          <button
            onClick={clearAllFilters}
            className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (page <= 4) {
                pageNum = i + 1
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = page - 3 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    page === pageNum
                      ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Footer count */}
      <div className="mt-6 text-center text-sm text-slate-500">
        Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} activities
        {filtered.length !== activities.length && ` (${activities.length} total)`}
      </div>
    </main>
  )
}
