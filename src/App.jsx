import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import NoteEditor from './components/NoteEditor'

const generateId = () => Math.random().toString(36).slice(2, 11)

export default function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('smart-notes-v1')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [selectedId, setSelectedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [mobileView, setMobileView] = useState('list')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    localStorage.setItem('smart-notes-v1', JSON.stringify(notes))
  }, [notes])

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !activeTag || note.tags.includes(activeTag)
    return matchesSearch && matchesTag
  })

  const allTags = [...new Set(notes.flatMap(n => n.tags))].sort()

  const handleSelect = useCallback(id => {
    setSelectedId(id)
    setMobileView('editor')
  }, [])

  const createNote = useCallback(() => {
    const newNote = {
      id: generateId(),
      title: 'Untitled',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes(prev => [newNote, ...prev])
    setSelectedId(newNote.id)
    setMobileView('editor')
    setSearchQuery('')
    setActiveTag(null)
  }, [])

  const updateNote = useCallback((id, updates) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      )
    )
  }, [])

  const deleteNote = useCallback(
    id => {
      setNotes(prev => {
        const next = prev.filter(n => n.id !== id)
        if (selectedId === id) {
          setSelectedId(next[0]?.id || null)
          setMobileView('list')
        }
        return next
      })
    },
    [selectedId]
  )

  const selectedNote = notes.find(n => n.id === selectedId) || null

  return (
    <div className="flex h-screen bg-[#fafaf8] text-[#1a1917] overflow-hidden">
      <Sidebar
        notes={filteredNotes}
        selectedId={selectedId}
        onSelect={handleSelect}
        onNew={createNote}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        allTags={allTags}
        activeTag={activeTag}
        onTagFilter={setActiveTag}
        mobileView={mobileView}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(p => !p)}
      />
      <NoteEditor
        note={selectedNote}
        onUpdate={updateNote}
        onDelete={deleteNote}
        allTags={allTags}
        mobileView={mobileView}
        onBack={() => setMobileView('list')}
      />
    </div>
  )
}
