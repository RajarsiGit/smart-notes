function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function NoteCard({ note, isSelected, onClick, animDelay }) {
  const preview = note.content.replace(/\n/g, ' ').slice(0, 90)

  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${animDelay}ms` }}
      className={`w-full text-left px-4 py-3.5 border-b border-[#eeebe5] transition-all duration-150 animate-fade-in ${
        isSelected
          ? 'bg-white border-l-2 border-l-[#0d9488] pl-3.5 shadow-sm'
          : 'border-l-2 border-l-transparent hover:bg-[#f8f5f0]'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-0.5">
        <h3
          className={`font-['Syne'] text-sm font-semibold leading-snug truncate ${
            isSelected ? 'text-[#1a1917]' : 'text-[#4a4741]'
          }`}
        >
          {note.title || 'Untitled'}
        </h3>
        <span className="text-[10px] text-[#b0aca6] font-['Manrope'] shrink-0 mt-0.5">
          {timeAgo(note.updatedAt)}
        </span>
      </div>

      {preview && (
        <p className="text-xs text-[#9b9690] font-['Manrope'] line-clamp-2 leading-relaxed mt-1">
          {preview}
        </p>
      )}

      {note.tags.length > 0 && (
        <div className="flex gap-2 mt-1.5">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] text-[#b0aca6] font-['Manrope']">
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] text-[#c4c0b8] font-['Manrope']">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  )
}
