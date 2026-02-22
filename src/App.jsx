import { useState, useCallback } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import NoteEditor from './components/NoteEditor'
import AuthScreen from './components/AuthScreen'

function NotesApp() {
  const { user, notes, loading, loadData, createNote, updateNote, deleteNote, logout } = useApp()
  const [selectedId, setSelectedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [mobileView, setMobileView] = useState('list')
  const [collapsed, setCollapsed] = useState(false)

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

  const handleNew = useCallback(async () => {
    const note = await createNote()
    setSelectedId(note.id)
    setMobileView('editor')
    setSearchQuery('')
    setActiveTag(null)
  }, [createNote])

  const handleDelete = useCallback(
    id => {
      deleteNote(id)
      if (selectedId === id) {
        const remaining = notes.filter(n => n.id !== id)
        setSelectedId(remaining[0]?.id || null)
        setMobileView('list')
      }
    },
    [deleteNote, selectedId, notes]
  )

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f3f0ea]">
        <div className="w-6 h-6 border-2 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={loadData} />
  }

  const selectedNote = notes.find(n => n.id === selectedId) || null

  return (
    <div className="flex h-screen bg-[#fafaf8] text-[#1a1917] overflow-hidden">
      <Sidebar
        notes={filteredNotes}
        selectedId={selectedId}
        onSelect={handleSelect}
        onNew={handleNew}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        allTags={allTags}
        activeTag={activeTag}
        onTagFilter={setActiveTag}
        mobileView={mobileView}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(p => !p)}
        user={user}
        onLogout={logout}
      />
      <NoteEditor
        note={selectedNote}
        onUpdate={updateNote}
        onDelete={handleDelete}
        allTags={allTags}
        mobileView={mobileView}
        onBack={() => setMobileView('list')}
      />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <NotesApp />
    </AppProvider>
  )
}
