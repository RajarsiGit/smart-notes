import { useState, useRef, useCallback } from 'react'
import { Trash2, Plus, X, Clock, ChevronLeft } from 'lucide-react'
import EmptyState from './EmptyState'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function NoteEditor({ note, onUpdate, onDelete, allTags, mobileView, onBack }) {
  const [tagInput, setTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const tagInputRef = useRef(null)

  const handleTitleChange = useCallback(
    e => {
      if (!note) return
      onUpdate(note.id, { title: e.target.value })
    },
    [note, onUpdate]
  )

  const handleContentChange = useCallback(
    e => {
      if (!note) return
      onUpdate(note.id, { content: e.target.value })
    },
    [note, onUpdate]
  )

  const addTag = useCallback(
    tag => {
      if (!note) return
      const trimmed = tag
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      if (trimmed && !note.tags.includes(trimmed)) {
        onUpdate(note.id, { tags: [...note.tags, trimmed] })
      }
      setTagInput('')
      setShowTagInput(false)
    },
    [note, onUpdate]
  )

  const removeTag = useCallback(
    tag => {
      if (!note) return
      onUpdate(note.id, { tags: note.tags.filter(t => t !== tag) })
    },
    [note, onUpdate]
  )

  const handleTagKeyDown = e => {
    if (e.key === 'Enter' && tagInput.trim()) {
      addTag(tagInput)
    } else if (e.key === 'Escape') {
      setTagInput('')
      setShowTagInput(false)
    }
  }

  if (!note) return <EmptyState mobileView={mobileView} onBack={onBack} />

  const tagSuggestions = allTags.filter(
    t => t.includes(tagInput.toLowerCase()) && !note.tags.includes(t) && tagInput.length > 0
  )

  return (
    <main
      className={`flex-col overflow-hidden bg-white ${
        mobileView === 'list' ? 'hidden md:flex md:flex-1' : 'flex flex-1'
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-[#f0ede7] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex md:hidden items-center gap-1 text-xs text-[#b0aca6] hover:text-[#0d9488] transition-colors font-['Manrope']"
          >
            <ChevronLeft size={14} />
            Back
          </button>
          <div className="hidden md:flex items-center gap-2 text-[#b0aca6]">
            <Clock size={11} />
            <span className="text-xs font-['Manrope']">{formatDate(note.updatedAt)}</span>
          </div>
        </div>
        <button
          onClick={() => onDelete(note.id)}
          className="flex items-center gap-1.5 text-xs text-[#c4c0b8] hover:text-red-500 transition-colors font-['Manrope'] group"
        >
          <Trash2 size={12} className="group-hover:scale-110 transition-transform" />
          Delete
        </button>
      </div>

      {/* Editor */}
      <div key={note.id} className="flex-1 overflow-y-auto animate-fade-in">
        <div className="px-5 py-8 md:px-14 md:py-12 max-w-2xl mx-auto w-full">
          {/* Title */}
          <input
            className="note-title-input text-[2.2rem] font-['Syne'] font-bold text-[#1a1917] placeholder-[#ddd9d3] leading-tight"
            value={note.title}
            onChange={handleTitleChange}
            placeholder="Untitled"
          />

          {/* Teal accent rule */}
          <div className="accent-rule mt-4 mb-5" />

          {/* Tags */}
          <div className="flex items-center gap-2 mb-7 flex-wrap">
            {note.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f0fdfa] border border-[#ccfbf1] rounded-full text-xs text-[#0f766e] font-['Manrope'] font-medium group cursor-default"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={9} className="text-[#5eead4] hover:text-red-500 transition-colors" />
                </button>
              </span>
            ))}

            {showTagInput ? (
              <div className="relative">
                <input
                  ref={tagInputRef}
                  autoFocus
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!tagInput.trim()) setShowTagInput(false)
                    }, 150)
                  }}
                  placeholder="add tag..."
                  className="px-2.5 py-1 bg-[#f0fdfa] border border-[#0d9488] rounded-full text-xs text-[#0f766e] font-['Manrope'] outline-none placeholder-[#99f6e4] w-24"
                />
                {tagSuggestions.length > 0 && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-[#e6e2db] rounded-xl overflow-hidden z-10 min-w-[130px] shadow-lg">
                    {tagSuggestions.slice(0, 5).map(s => (
                      <button
                        key={s}
                        onMouseDown={() => addTag(s)}
                        className="w-full text-left px-3 py-2 text-xs text-[#4a4741] hover:bg-[#f8f5f0] font-['Manrope'] transition-colors"
                      >
                        #{s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 border border-dashed border-[#d8d4cd] rounded-full text-[11px] text-[#b0aca6] hover:border-[#0d9488] hover:text-[#0d9488] transition-colors font-['Manrope']"
              >
                <Plus size={9} /> Add tag
              </button>
            )}
          </div>

          {/* Content */}
          <textarea
            className="note-textarea text-[17px] text-[#3d3a37] font-['Manrope'] placeholder-[#ddd9d3]"
            value={note.content}
            onChange={handleContentChange}
            placeholder="Start writing..."
            rows={20}
          />
        </div>
      </div>
    </main>
  )
}
