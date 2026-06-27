import React, { createContext, useContext, useReducer, useCallback } from 'react'

type AudioState = {
  isPlaying: boolean
  frequency: number
  frequencyLadder: number[]
  type: 'iso' | 'bin' | 'pure'
  timer: number | null
  progress: number
  volume: number
  lastUpdated: Date
}

type AudioAction =
  | { type: 'SET_FREQUENCY'; payload: number }
  | { type: 'SET_TYPE'; payload: 'iso' | 'bin' | 'pure' }
  | { type: 'SET_TIMER'; payload: number | null }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'RESET_AUDIO' }

type AudioContextType = AudioState & {
  setFrequency: (freq: number) => void
  setType: (type: 'iso' | 'bin' | 'pure') => void
  setTimer: (timer: number | null) => void
  setVolume: (volume: number) => void
  setPlaying: (playing: boolean) => void
  setProgress: (progress: number) => void
  resetAudio: () => void
}

const defaultState: AudioState = {
  isPlaying: false,
  frequency: 9,
  frequencyLadder: [3, 6, 9],
  type: 'bin',
  timer: null,
  progress: 0,
  volume: 0.7,
  lastUpdated: new Date(),
}

function audioReducer(state: AudioState, action: AudioAction): AudioState {
  switch (action.type) {
    case 'SET_FREQUENCY':
      return { ...state, frequency: action.payload, lastUpdated: new Date() }
    case 'SET_TYPE':
      return { ...state, type: action.payload, lastUpdated: new Date() }
    case 'SET_TIMER':
      return { ...state, timer: action.payload, lastUpdated: new Date() }
    case 'SET_VOLUME':
      return { ...state, volume: action.payload, lastUpdated: new Date() }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload, lastUpdated: new Date() }
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload, lastUpdated: new Date() }
    case 'RESET_AUDIO':
      return { ...defaultState }
    default:
      return state
  }
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(audioReducer, defaultState)

  const setFrequency = useCallback((freq: number) => {
    dispatch({ type: 'SET_FREQUENCY', payload: freq })
  }, [])

  const setType = useCallback((type: 'iso' | 'bin' | 'pure') => {
    dispatch({ type: 'SET_TYPE', payload: type })
  }, [])

  const setTimer = useCallback((timer: number | null) => {
    dispatch({ type: 'SET_TIMER', payload: timer })
  }, [])

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume })
  }, [])

  const setPlaying = useCallback((playing: boolean) => {
    dispatch({ type: 'SET_PLAYING', payload: playing })
  }, [])

  const setProgress = useCallback((progress: number) => {
    dispatch({ type: 'SET_PROGRESS', payload: progress })
  }, [])

  const resetAudio = useCallback(() => {
    dispatch({ type: 'RESET_AUDIO' })
  }, [])

  return (
    <AudioContext.Provider
      value={{
        ...state,
        setFrequency,
        setType,
        setTimer,
        setVolume,
        setPlaying,
        setProgress,
        resetAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
