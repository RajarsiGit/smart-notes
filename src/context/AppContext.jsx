import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { authApi, notesApi } from '../utils/api'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const debounceTimer = useRef(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const { user: currentUser } = await authApi.getCurrentUser()
      setUser(currentUser)
      const fetchedNotes = await notesApi.getAll()
      setNotes(fetchedNotes)
    } catch {
      setUser(null)
      setNotes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const createNote = useCallback(async (data = {}) => {
    const note = await notesApi.create({
      title: 'Untitled',
      content: '',
      tags: [],
      ...data,
    })
    setNotes(prev => [note, ...prev])
    return note
  }, [])

  const updateNote = useCallback((id, updates) => {
    // Optimistic update
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      )
    )

    // Debounced API call
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      notesApi.update(id, updates).catch(console.error)
    }, 800)
  }, [])

  const deleteNote = useCallback(async (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    await notesApi.delete(id)
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setNotes([])
  }, [])

  const value = useMemo(
    () => ({ user, notes, loading, loadData, createNote, updateNote, deleteNote, logout }),
    [user, notes, loading, loadData, createNote, updateNote, deleteNote, logout]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
