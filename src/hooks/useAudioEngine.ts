import { useEffect, useState, useRef, useCallback } from 'react'

interface AudioEngine {
  context: AudioContext | null
  gainNode: GainNode | null
  oscillator: OscillatorNode | null
  audioBuffer: AudioBuffer | null
  source: AudioBufferSourceNode | null
  analyser: AnalyserNode | null
  isPlaying: boolean
  error: string | null
}

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle'

type ToneType = 'pure' | 'binaural' | 'isochronic'

interface AudioEngineControls {
  // Pure tone control
  playPureTone: (frequency: number, type?: OscillatorType, amplitude?: number) => void
  // Binaural beats
  playBinauralBeats: (frequency: number, difference: number) => void
  // Isochronic tones
  playIsochronicTone: (frequency: number) => void
  // Controls
  stop: () => void
  pause: () => void
  resume: () => void
  setVolume: (volume: number) => void
  // Getters
  get analyser(): AnalyserNode | null
  get isPlaying(): boolean
  get error(): string | null
}

const createAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    return ctx
  } catch (err) {
    return null
  }
}

export function useAudioEngine() {
  const [engine, setEngine] = useState<AudioEngine | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const initializationPromise = useRef<Promise<void> | null>(null)

  const initializeAudio = useCallback(async () => {
    if (initializationPromise.current) {
      return initializationPromise.current
    }

    if (!isInitialized) {
      setEngine({
        context: null,
        gainNode: null,
        oscillator: null,
        audioBuffer: null,
        source: null,
        analyser: null,
        isPlaying: false,
        error: null,
      })
      return
    }

    try {
      const ctx = createAudioContext()
      if (!ctx) {
        setEngine({
          context: null,
          gainNode: null,
          oscillator: null,
          audioBuffer: null,
          source: null,
          analyser: null,
          isPlaying: false,
          error: 'AudioContext not supported',
        })
        return
      }

      await ctx.resume().catch(() => {})

      const gainNode = ctx.createGain()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      const bufferSize = ctx.sampleRate > 0 ? Math.floor(ctx.sampleRate / 2) : 2048
      const audioBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate || 44100)

      gainNode.connect(analyser)
      analyser.connect(ctx.destination)

      setEngine({
        context: ctx,
        gainNode,
        oscillator: null,
        audioBuffer,
        source: null,
        analyser,
        isPlaying: false,
        error: null,
      })
    } catch (err) {
      setEngine({
        context: null,
        gainNode: null,
        oscillator: null,
        audioBuffer: null,
        source: null,
        analyser: null,
        isPlaying: false,
        error: err instanceof Error ? err.message : 'Failed to initialize audio engine',
      })
    } finally {
      setIsInitialized(true)
    }
  }, [isInitialized])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const playPromise = initializeAudio()
      playPromise.catch(() => {})
    }
  }, [initializeAudio])

  const playPureTone = useCallback((
    frequency: number,
    type: OscillatorType = 'sine',
    amplitude: number = 0.7
  ) => {
    if (!engine?.context || !engine.gainNode) return

    if (engine.oscillator) {
      engine.oscillator.stop()
      engine.oscillator.disconnect()
    }

    const oscillator = engine.context.createOscillator()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, engine.context.currentTime)
    oscillator.connect(engine.gainNode)
    oscillator.start()

    setEngine(prev => prev ? { ...prev, oscillator: oscillator, isPlaying: true } : null)

    oscillator.stop(engine.context.currentTime + 0.5)
    oscillator.addEventListener('ended', () => {
      setEngine(prev => prev ? { ...prev, oscillator: null, isPlaying: false } : null)
    })
  }, [engine])

  const playBinauralBeats = useCallback((frequency: number, difference: number) => {
    if (!engine?.context) return

    const leftOsc = engine.context.createOscillator()
    const rightOsc = engine.context.createOscillator()
    const leftGain = engine.context.createGain()
    const rightGain = engine.context.createGain()

    leftOsc.type = 'sine'
    rightOsc.type = 'sine'
    leftOsc.frequency.setValueAtTime(frequency, engine.context.currentTime)
    rightOsc.frequency.setValueAtTime(frequency + difference, engine.context.currentTime)

    leftGain.gain.setValueAtTime(0.5, engine.context.currentTime)
    rightGain.gain.setValueAtTime(0.5, engine.context.currentTime)

    const leftStereo = engine.context.createStereoPanner()
    leftStereo.pan.setValueAtTime(-0.5, engine.context.currentTime)
    const rightStereo = engine.context.createStereoPanner()
    rightStereo.pan.setValueAtTime(0.5, engine.context.currentTime)

    leftOsc.connect(leftGain)
    rightOsc.connect(rightGain)
    leftGain.connect(leftStereo)
    rightGain.connect(rightStereo)
    leftStereo.connect(engine.context.destination)
    rightStereo.connect(engine.context.destination)

    leftOsc.start()
    rightOsc.start()

    setEngine(prev => prev ? { ...prev, isPlaying: true } : null)

    leftOsc.stop(engine.context.currentTime + 1)
    rightOsc.stop(engine.context.currentTime + 1)
  }, [engine])

  const playIsochronicTone = useCallback((frequency: number) => {
    if (!engine?.context || !engine.gainNode) return

    if (engine.source) {
      engine.source.stop()
      engine.source.disconnect()
    }

    const buffer = engine.audioBuffer
    if (!buffer) return

    const source = engine.context.createBufferSource()
    source.buffer = buffer

    const changeSamples = Math.floor(engine.context.sampleRate / frequency)
    const data = new Float32Array(buffer.length)
    for (let i = 0; i < buffer.length; i++) {
      data[i] = i % changeSamples < changeSamples / 2 ? 1.0 : -1.0
    }

    buffer.copyToChannel(data, 0)
    buffer.copyToChannel(-data, 1)

    source.connect(engine.gainNode)
    source.start()

    setEngine(prev => prev ? { ...prev, source: source, isPlaying: true } : null)

    source.stop(engine.context.currentTime + 1)
    source.addEventListener('ended', () => {
      setEngine(prev => prev ? { ...prev, source: null, isPlaying: false } : null)
    })
  }, [engine])

  const stop = useCallback(() => {
    if (engine?.oscillator) {
      engine.oscillator.stop()
      engine.oscillator.disconnect()
    }
    if (engine?.source) {
      engine.source.stop()
      engine.source.disconnect()
    }
    setEngine(prev => prev ? { ...prev, oscillator: null, source: null, isPlaying: false } : null)
  }, [engine])

  const pause = useCallback(() => {
    engine?.context?.suspend()
    setEngine(prev => prev ? { ...prev, isPlaying: false } : null)
  }, [engine])

  const resume = useCallback(() => {
    engine?.context?.resume()
    setEngine(prev => prev ? { ...prev, isPlaying: true } : null)
  }, [engine])

  const setVolume = useCallback((volume: number) => {
    if (engine?.gainNode) {
      engine.gainNode.gain.setValueAtTime(volume, engine.context?.currentTime || 0)
    }
  }, [engine])

  const controls: AudioEngineControls = {
    playPureTone,
    playBinauralBeats,
    playIsochronicTone,
    stop,
    pause,
    resume,
    setVolume,
    get analyser() { return engine?.analyser || null },
    get isPlaying() { return engine?.isPlaying || false },
    get error() { return engine?.error || null },
  }

  return {
    engine,
    controls,
    isInitialized,
  }
}
