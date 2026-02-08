import { Search, Plus, Tag, X } from 'lucide-react'
import NoteCard from './NoteCard'

export default function Sidebar({
  notes,
  selectedId,
  onSelect,
  onNew,
  searchQuery,
  onSearch,
  allTags,
  activeTag,
  onTagFilter,
  mobileView,
}) {
  return (
    <aside
      className={`flex-col border-r border-[#e6e2db] bg-[#f3f0ea] shrink-0 ${
        mobileView === 'editor' ? 'hidden md:flex md:w-72' : 'flex w-full md:w-72'
      }`}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-[#e6e2db]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-['Syne'] text-lg font-bold text-[#1a1917] uppercase tracking-[0.08em]">
            Notes
          </h1>
          <button
            onClick={onNew}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#0d9488] text-white hover:bg-[#0f766e] transition-colors shadow-sm"
            title="New note"
          >
            <Plus size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0aca6]" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-[#e6e2db] rounded-xl text-[#1a1917] placeholder-[#c4c0b8] focus:outline-none focus:border-[#0d9488] font-['Manrope'] transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={13} className="text-[#b0aca6] hover:text-[#0d9488] transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="px-4 py-3 border-b border-[#e6e2db]">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Tag size={10} className="text-[#a09d98]" />
            <span className="text-[10px] text-[#a09d98] font-['Manrope'] uppercase tracking-[0.12em] font-medium">
              Tags
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => onTagFilter(activeTag === tag ? null : tag)}
                className={`px-2.5 py-0.5 text-[11px] rounded-full border transition-all font-['Manrope'] font-medium ${
                  activeTag === tag
                    ? 'bg-[#ccfbf1] border-[#5eead4] text-[#0f766e]'
                    : 'bg-white border-[#e6e2db] text-[#706c67] hover:border-[#0d9488] hover:text-[#0d9488]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#b0aca6] text-sm font-['Manrope'] italic">
              {searchQuery || activeTag ? 'No matching notes' : 'No notes yet'}
            </p>
          </div>
        ) : (
          notes.map((note, i) => (
            <NoteCard
              key={note.id}
              note={note}
              isSelected={note.id === selectedId}
              onClick={() => onSelect(note.id)}
              animDelay={i * 30}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#e6e2db] text-center">
        <span className="text-[11px] text-[#c4c0b8] font-['Manrope']">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </div>
    </aside>
  )
}
