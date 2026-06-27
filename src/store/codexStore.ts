import React, { createContext, useContext, useReducer, useCallback } from 'react'

type CodexLesson = {
  id: string
  title: string
  content: string
  completed: boolean
  bookmarked: boolean
  lastOpened?: Date
}

type CodexState = {
  lessons: CodexLesson[]
  selectedLesson: CodexLesson | null
  isLoading: boolean
  error: string | null
}

type CodexAction =
  | { type: 'SET_LESSONS'; payload: CodexLesson[] }
  | { type: 'ADD_LESSON'; payload: CodexLesson }
  | { type: 'UPDATE_LESSON'; payload: CodexLesson }
  | { type: 'DELETE_LESSON'; payload: string }
  | { type: 'SET_SELECTED_LESSON'; payload: CodexLesson | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CODEX' }

const initialState: CodexState = {
  lessons: [],
  selectedLesson: null,
  isLoading: false,
  error: null,
}

function codexReducer(state: CodexState, action: CodexAction): CodexState {
  switch (action.type) {
    case 'SET_LESSONS':
      return { ...state, lessons: action.payload, isLoading: false, error: null }
    case 'ADD_LESSON':
      return { ...state, lessons: [action.payload, ...state.lessons] }
    case 'UPDATE_LESSON':
      return {
        ...state,
        lessons: state.lessons.map(lesson =>
          lesson.id === action.payload.id ? action.payload : lesson
        ),
        selectedLesson:
          state.selectedLesson?.id === action.payload.id ? action.payload : state.selectedLesson,
      }
    case 'DELETE_LESSON':
      return {
        ...state,
        lessons: state.lessons.filter(lesson => lesson.id !== action.payload),
        selectedLesson:
          state.selectedLesson?.id === action.payload ? null : state.selectedLesson,
      }
    case 'SET_SELECTED_LESSON':
      return { ...state, selectedLesson: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'RESET_CODEX':
      return initialState
    default:
      return state
  }
}

const CodexContext = createContext<
  | CodexState
  | {
    setLessons: (lessons: CodexLesson[]) => void
    addLesson: (lesson: CodexLesson) => void
    updateLesson: (lesson: CodexLesson) => void
    deleteLesson: (id: string) => void
    setSelectedLesson: (lesson: CodexLesson | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    resetCodex: () => void
  }
> | undefined

export function CodexProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(codexReducer, initialState)

  const setLessons = useCallback((lessons: CodexLesson[]) => {
    dispatch({ type: 'SET_LESSONS', payload: lessons })
  }, [])

  const addLesson = useCallback((lesson: CodexLesson) => {
    dispatch({ type: 'ADD_LESSON', payload: lesson })
  }, [])

  const updateLesson = useCallback((lesson: CodexLesson) => {
    dispatch({ type: 'UPDATE_LESSON', payload: lesson })
  }, [])

  const deleteLesson = useCallback((id: string) => {
    dispatch({ type: 'DELETE_LESSON', payload: id })
  }, [])

  const setSelectedLesson = useCallback((lesson: CodexLesson | null) => {
    dispatch({ type: 'SET_SELECTED_LESSON', payload: lesson })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  const resetCodex = useCallback(() => {
    dispatch({ type: 'RESET_CODEX' })
  }, [])

  return (
    <CodexContext.Provider
      value={{
        ...state,
        setLessons,
        addLesson,
        updateLesson,
        deleteLesson,
        setSelectedLesson,
        setLoading,
        setError,
        resetCodex,
      }}
    >
      {children}
    </CodexContext.Provider>
  )
}

export function useCodex() {
  const context = useContext(CodexContext)
  if (context === undefined) {
    throw new Error('useCodex must be used within a CodexProvider')
  }
  return context
}
