'use client'

const CATEGORIES = [
  { key: 'all', label: 'All', emoji: '🌟' },
  { key: 'outdoor', label: 'Outdoor', emoji: '⛰️' },
  { key: 'creative', label: 'Creative', emoji: '🎨' },
  { key: 'fitness', label: 'Fitness', emoji: '💪' },
  { key: 'social', label: 'Social', emoji: '🎉' },
  { key: 'learning', label: 'Learning', emoji: '📚' },
  { key: 'relaxation', label: 'Relaxation', emoji: '🧘' },
  { key: 'culinary', label: 'Culinary', emoji: '🍳' },
  { key: 'music', label: 'Music', emoji: '🎵' },
  { key: 'tech', label: 'Tech', emoji: '💻' },
  { key: 'games', label: 'Games', emoji: '🎮' },
  { key: 'sports', label: 'Sports', emoji: '⚽' },
  { key: 'crafts', label: 'Crafts', emoji: '🧵' },
  { key: 'wellness', label: 'Wellness', emoji: '🌿' },
  { key: 'collecting', label: 'Collecting', emoji: '🏆' },
  { key: 'travel', label: 'Travel', emoji: '✈️' },
]

const STATUS_FILTERS = [
  { key: 'all', label: 'All', emoji: '📋' },
  { key: 'unrated', label: 'Unrated', emoji: '❓' },
  { key: 'interested', label: 'Interested', emoji: '👍' },
  { key: 'not_interested', label: 'Not interested', emoji: '👎' },
  { key: 'unsure', label: 'Unsure', emoji: '🤷' },
]

const DIFFICULTY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'easy', label: 'Easy' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'hard', label: 'Hard' },
]

const COST_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'free', label: 'Free' },
  { key: 'cheap', label: 'Cheap' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'expensive', label: 'Expensive' },
]

const SETTING_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'indoor', label: 'Indoor' },
  { key: 'outdoor', label: 'Outdoor' },
  { key: 'both', label: 'Both' },
]

function FilterRow({ label, items, active, setActive }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${active === item.key
                ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-300 hover:border-slate-600'
              }
            `}
          >
            {item.emoji ? `${item.emoji} ` : ''}{item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function FilterBar({
  activeCategory, setActiveCategory,
  activeStatus, setActiveStatus,
  activeDifficulty, setActiveDifficulty,
  activeCost, setActiveCost,
  activeSetting, setActiveSetting,
  counts,
}) {
  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="flex gap-3 flex-wrap">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2 text-sm">
          <span className="text-green-400 font-semibold">{counts.interested}</span>
          <span className="text-slate-400 ml-1">interested</span>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm">
          <span className="text-red-400 font-semibold">{counts.not_interested}</span>
          <span className="text-slate-400 ml-1">not interested</span>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-sm">
          <span className="text-amber-400 font-semibold">{counts.unsure}</span>
          <span className="text-slate-400 ml-1">unsure</span>
        </div>
        <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg px-3 py-2 text-sm">
          <span className="text-slate-300 font-semibold">{counts.unrated}</span>
          <span className="text-slate-400 ml-1">unrated</span>
        </div>
      </div>

      <FilterRow label="Category" items={CATEGORIES} active={activeCategory} setActive={setActiveCategory} />
      <FilterRow label="Status" items={STATUS_FILTERS} active={activeStatus} setActive={setActiveStatus} />

      {/* Secondary filters row */}
      <div className="flex gap-6 flex-wrap">
        <FilterRow label="Difficulty" items={DIFFICULTY_FILTERS} active={activeDifficulty} setActive={setActiveDifficulty} />
        <FilterRow label="Cost" items={COST_FILTERS} active={activeCost} setActive={setActiveCost} />
        <FilterRow label="Setting" items={SETTING_FILTERS} active={activeSetting} setActive={setActiveSetting} />
      </div>
    </div>
  )
}
