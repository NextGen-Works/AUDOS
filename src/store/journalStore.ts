import React, { createContext, useContext, useReducer, useCallback } from 'react'

type JournalEntry = {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  mood?: 'calm' | 'focused' | 'creative' | 'unknown'
}

type JournalState = {
  entries: JournalEntry[]
  selectedEntry: JournalEntry | null
  isLoading: boolean
  error: string | null
}

type JournalAction =
  | { type: 'SET_ENTRIES'; payload: JournalEntry[] }
  | { type: 'ADD_ENTRY'; payload: JournalEntry }
  | { type: 'UPDATE_ENTRY'; payload: JournalEntry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'SET_SELECTED_ENTRY'; payload: JournalEntry | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_JOURNAL' }

const initialState: JournalState = {
  entries: [],
  selectedEntry: null,
  isLoading: false,
  error: null,
}

function journalReducer(state: JournalState, action: JournalAction): JournalState {
  switch (action.type) {
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload, isLoading: false, error: null }
    case 'ADD_ENTRY':
      return { ...state, entries: [action.payload, ...state.entries] }
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map(entry =>
          entry.id === action.payload.id ? action.payload : entry
        ),
        selectedEntry:
          state.selectedEntry?.id === action.payload.id ? action.payload : state.selectedEntry,
      }
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.payload),
        selectedEntry:
          state.selectedEntry?.id === action.payload ? null : state.selectedEntry,
      }
    case 'SET_SELECTED_ENTRY':
      return { ...state, selectedEntry: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'RESET_JOURNAL':
      return initialState
    default:
      return state
  }
}

const JournalContext = createContext<
  | JournalState
  | {
    setEntries: (entries: JournalEntry[]) => void
    addEntry: (entry: JournalEntry) => void
    updateEntry: (entry: JournalEntry) => void
    deleteEntry: (id: string) => void
    setSelectedEntry: (entry: JournalEntry | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    resetJournal: () => void
  }
> | undefined

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(journalReducer, initialState)

  const setEntries = useCallback((entries: JournalEntry[]) => {
    dispatch({ type: 'SET_ENTRIES', payload: entries })
  }, [])

  const addEntry = useCallback((entry: JournalEntry) => {
    dispatch({ type: 'ADD_ENTRY', payload: entry })
  }, [])

  const updateEntry = useCallback((entry: JournalEntry) => {
    dispatch({ type: 'UPDATE_ENTRY', payload: entry })
  }, [])

  const deleteEntry = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ENTRY', payload: id })
  }, [])

  const setSelectedEntry = useCallback((entry: JournalEntry | null) => {
    dispatch({ type: 'SET_SELECTED_ENTRY', payload: entry })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  const resetJournal = useCallback(() => {
    dispatch({ type: 'RESET_JOURNAL' })
  }, [])

  return (
    <JournalContext.Provider
      value={{
        ...state,
        setEntries,
        addEntry,
        updateEntry,
        deleteEntry,
        setSelectedEntry,
        setLoading,
        setError,
        resetJournal,
      }}
    >
      {children}
    </JournalContext.Provider>
  )
}

export function useJournal() {
  const context = useContext(JournalContext)
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider')
  }
  return context
}
