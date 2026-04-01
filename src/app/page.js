'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import ActivityCard from '@/components/ActivityCard'
import FilterBar from '@/components/FilterBar'
export default function Home() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => { fetchActivities() }, [])
  async function fetchActivities() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('activities').select('*').order('category').order('name')
      if (error) throw error
      setActivities(data || [])
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  async function handleStatusChange(id, newStatus) {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
    setSaving(true)
    try {
      const { error } = await supabase.from('activities').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    } catch (err) { fetchActivities(); setError(err.message) } finally { setSaving(false) }
  }
  const filtered = useMemo(() => activities.filter(a => {
    if (activeCategory !== 'all' && a.category !== activeCategory) return false
    if (activeStatus === 'unrated' && a.status !== null) return false
    if (['interested','not_interested','unsure'].includes(activeStatus) && a.status !== activeStatus) return false
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [activities, activeCategory, activeStatus, search])
  const counts = useMemo(() => ({
    interested: activities.filter(a => a.status === 'interested').length,
    not_interested: activities.filter(a => a.status === 'not_interested').length,
    unsure: activities.filter(a => a.status === 'unsure').length,
    unrated: activities.filter(a => a.status === null).length,
  }), [activities])
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md text-center">
        <h2 className="text-red-400 text-lg font-semibold mb-2">Connection Error</h2>
        <p className="text-slate-400 text-sm mb-4">{error}</p>
        <button onClick={() => { setError(null); fetchActivities() }} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition">Retry</button>
      </div>
    </div>
  )
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Activity Picker <span className="text-blue-400">&#127919;</span></h1>
        <p className="text-slate-400">Rate hobbies and activities to track what you&apos;re into. Your choices are saved automatically.</p>
      </div>
      <div className="mb-6">
        <input type="text" placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition" />
      </div>
      <div className="mb-8"><FilterBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} activeStatus={activeStatus} setActiveStatus={setActiveStatus} counts={counts} /></div>
      {saving && <div className="fixed top-4 right-4 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm px-3 py-1.5 rounded-lg animate-pulse z-50">Saving...</div>}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (<div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 animate-pulse"><div className="h-3 bg-slate-700 rounded w-20 mb-4"></div><div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div><div className="h-3 bg-slate-700 rounded w-full mb-4"></div><div className="flex gap-2 mt-4"><div className="h-9 bg-slate-700 rounded-lg flex-1"></div><div className="h-9 bg-slate-700 rounded-lg flex-1"></div><div className="h-9 bg-slate-700 rounded-lg flex-1"></div></div></div>))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16"><p className="text-4xl mb-3">&#128269;</p><p className="text-slate-400">No activities match your filters.</p><button onClick={() => { setActiveCategory('all'); setActiveStatus('all'); setSearch('') }} className="mt-3 text-blue-400 hover:text-blue-300 text-sm">Clear filters</button></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(activity => <ActivityCard key={activity.id} activity={activity} onStatusChange={handleStatusChange} />)}
        </div>
      )}
      <div className="mt-8 text-center text-sm text-slate-500">Showing {filtered.length} of {activities.length} activities</div>
    </main>
  )
}
