'use client'
const CATEGORIES = [
  { key: 'all', label: 'All', emoji: '\uD83C\uDF1F' },
  { key: 'outdoor', label: 'Outdoor', emoji: '\u26F0\uFE0F' },
  { key: 'creative', label: 'Creative', emoji: '\uD83C\uDFA8' },
  { key: 'fitness', label: 'Fitness', emoji: '\uD83D\uDCAA' },
  { key: 'social', label: 'Social', emoji: '\uD83C\uDF89' },
  { key: 'learning', label: 'Learning', emoji: '\uD83D\uDCDA' },
  { key: 'relaxation', label: 'Relaxation', emoji: '\uD83E\uDDD8' },
  { key: 'culinary', label: 'Culinary', emoji: '\uD83C\uDF73' },
  { key: 'music', label: 'Music', emoji: '\uD83C\uDFB5' },
  { key: 'tech', label: 'Tech', emoji: '\uD83D\uDCBB' },
  { key: 'games', label: 'Games', emoji: '\uD83C\uDFAE' },
]
const STATUS_FILTERS = [
  { key: 'all', label: 'All', emoji: '\uD83D\uDCCB' },
  { key: 'unrated', label: 'Unrated', emoji: '\u2753' },
  { key: 'interested', label: 'Interested', emoji: '\uD83D\uDC4D' },
  { key: 'not_interested', label: 'Not interested', emoji: '\uD83D\uDC4E' },
  { key: 'unsure', label: 'Unsure', emoji: '\uD83E\uDD37' },
]
export default function FilterBar({ activeCategory, setActiveCategory, activeStatus, setActiveStatus, counts }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 text-sm"><span className="text-green-400 font-semibold">{counts.interested}</span><span className="text-slate-400 ml-1">interested</span></div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm"><span className="text-red-400 font-semibold">{counts.not_interested}</span><span className="text-slate-400 ml-1">not interested</span></div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-sm"><span className="text-amber-400 font-semibold">{counts.unsure}</span><span className="text-slate-400 ml-1">unsure</span></div>
        <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg px-3 py-2 text-sm"><span className="text-slate-300 font-semibold">{counts.unrated}</span><span className="text-slate-400 ml-1">unrated</span></div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Category</p>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeCategory === cat.key ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300 hover:border-slate-600'}`}>{cat.emoji} {cat.label}</button>)}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Status</p>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(sf => <button key={sf.key} onClick={() => setActiveStatus(sf.key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeStatus === sf.key ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300 hover:border-slate-600'}`}>{sf.emoji} {sf.label}</button>)}
        </div>
      </div>
    </div>
  )
}
