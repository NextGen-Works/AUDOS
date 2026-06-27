import React, { createContext, useContext, useReducer, useCallback } from 'react'

type SIGLNode = {
  id: string
  name: string
  glyph: string
  description: string
  audioUrl?: string
  sketchUrl?: string
  media?: {
    audio?: string
    sketch?: string
  }
  links: string[]
  visited: boolean
  lastVisited?: Date
  createdAt: Date
}

type SIGLState = {
  nodes: SIGLNode[]
  selectedNode: SIGLNode | null
  isLoading: boolean
  error: string | null
}

type SIGLAction =
  | { type: 'SET_NODES'; payload: SIGLNode[] }
  | { type: 'ADD_NODE'; payload: SIGLNode }
  | { type: 'UPDATE_NODE'; payload: SIGLNode }
  | { type: 'DELETE_NODE'; payload: string }
  | { type: 'SET_SELECTED_NODE'; payload: SIGLNode | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'VISIT_NODE'; payload: string }
  | { type: 'RESET_SIGL' }

const initialState: SIGLState = {
  nodes: [],
  selectedNode: null,
  isLoading: false,
  error: null,
}

function siglReducer(state: SIGLState, action: SIGLAction): SIGLState {
  switch (action.type) {
    case 'SET_NODES':
      return { ...state, nodes: action.payload, isLoading: false, error: null }
    case 'ADD_NODE':
      return { ...state, nodes: [action.payload, ...state.nodes] }
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.id ? action.payload : node
        ),
        selectedNode:
          state.selectedNode?.id === action.payload.id ? action.payload : state.selectedNode,
      }
    case 'DELETE_NODE':
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.payload),
        selectedNode:
          state.selectedNode?.id === action.payload ? null : state.selectedNode,
      }
    case 'SET_SELECTED_NODE':
      return { ...state, selectedNode: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'VISIT_NODE':
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload
            ? { ...node, visited: true, lastVisited: new Date() }
            : node
        ),
      }
    case 'RESET_SIGL':
      return initialState
    default:
      return state
  }
}

const SIGLContext = createContext<
  | SIGLState
  | {
    setNodes: (nodes: SIGLNode[]) => void
    addNode: (node: SIGLNode) => void
    updateNode: (node: SIGLNode) => void
    deleteNode: (id: string) => void
    setSelectedNode: (node: SIGLNode | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    visitNode: (id: string) => void
    resetSIGL: () => void
  }
> | undefined

export function SIGLProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(siglReducer, initialState)

  const setNodes = useCallback((nodes: SIGLNode[]) => {
    dispatch({ type: 'SET_NODES', payload: nodes })
  }, [])

  const addNode = useCallback((node: SIGLNode) => {
    dispatch({ type: 'ADD_NODE', payload: node })
  }, [])

  const updateNode = useCallback((node: SIGLNode) => {
    dispatch({ type: 'UPDATE_NODE', payload: node })
  }, [])

  const deleteNode = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NODE', payload: id })
  }, [])

  const setSelectedNode = useCallback((node: SIGLNode | null) => {
    dispatch({ type: 'SET_SELECTED_NODE', payload: node })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  const visitNode = useCallback((id: string) => {
    dispatch({ type: 'VISIT_NODE', payload: id })
  }, [])

  const resetSIGL = useCallback(() => {
    dispatch({ type: 'RESET_SIGL' })
  }, [])

  return (
    <SIGLContext.Provider
      value={{
        ...state,
        setNodes,
        addNode,
        updateNode,
        deleteNode,
        setSelectedNode,
        setLoading,
        setError,
        visitNode,
        resetSIGL,
      }}
    >
      {children}
    </SIGLContext.Provider>
  )
}

export function useSIGL() {
  const context = useContext(SIGLContext)
  if (context === undefined) {
    throw new Error('useSIGL must be used within a SIGLProvider')
  }
  return context
}
