'use client'
const STATUS_CONFIG = {
  interested: { label: 'Interested', emoji: '\uD83D\uDC4D', bgClass: 'bg-green-500/20 border-green-500/50 text-green-400', btnClass: 'hover:bg-green-500/20 hover:text-green-400' },
  not_interested: { label: 'Not interested', emoji: '\uD83D\uDC4E', bgClass: 'bg-red-500/20 border-red-500/50 text-red-400', btnClass: 'hover:bg-red-500/20 hover:text-red-400' },
  unsure: { label: 'Unsure', emoji: '\uD83E\uDD37', bgClass: 'bg-amber-500/20 border-amber-500/50 text-amber-400', btnClass: 'hover:bg-amber-500/20 hover:text-amber-400' },
}
const CATEGORY_EMOJI = { outdoor: '\u26F0\uFE0F', creative: '\uD83C\uDFA8', fitness: '\uD83D\uDCAA', social: '\uD83C\uDF89', learning: '\uD83D\uDCDA', relaxation: '\uD83E\uDDD8', culinary: '\uD83C\uDF73', music: '\uD83C\uDFB5', tech: '\uD83D\uDCBB', games: '\uD83C\uDFAE' }
export default function ActivityCard({ activity, onStatusChange }) {
  const currentStatus = activity.status
  const categoryEmoji = CATEGORY_EMOJI[activity.category] || '\u2728'
  return (
    <div className={`relative rounded-xl border p-5 transition-all duration-200 ${currentStatus ? STATUS_CONFIG[currentStatus].bgClass : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{categoryEmoji} {activity.category}</span>
        {currentStatus && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-900/50">{STATUS_CONFIG[currentStatus].emoji} {STATUS_CONFIG[currentStatus].label}</span>}
      </div>
      <h3 className="text-lg font-semibold mb-1">{activity.name}</h3>
      {activity.description && <p className="text-sm text-slate-400 mb-4">{activity.description}</p>}
      <div className="flex gap-2 mt-3">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <button key={status} onClick={() => onStatusChange(activity.id, currentStatus === status ? null : status)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all duration-150 ${currentStatus === status ? config.bgClass + ' shadow-sm' : 'border-slate-600/50 text-slate-400 ' + config.btnClass}`}>
            {config.emoji} {config.label}
          </button>
        ))}
      </div>
    </div>
  )
}
