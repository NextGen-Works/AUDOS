export function useBreathCoach() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<BreathPhase>('inhale')
  const [progress, setProgress] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [theme, setTheme] = useState<Theme>('dark')
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const animationFrameRef = useRef<number>(0)
  const cycleStartRef = useRef<number>(0)

  const defaultBreathingPattern: BreathingPattern = {
    inhale: 4,
    hold: 2,
    exhale: 6,
  }

  const startBreathing = useCallback(() => {
    setIsActive(true)
    cycleStartRef.current = Date.now()
    setPhase('inhale')
    setProgress(0)
  }, [])

  const stopBreathing = useCallback(() => {
    setIsActive(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current.disconnect()
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    localStorage.setItem('audos_theme', theme === 'dark' ? 'light' : 'dark')
  }, [theme])

  useEffect(() => {
    const savedTheme = localStorage.getItem('audos_theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (!isActive) return

    const updateAnimation = (timestamp: number) => {
      if (!cycleStartRef.current) {
        cycleStartRef.current = timestamp
      }

      const elapsed = (timestamp - cycleStartRef.current) / 1000
      const { inhale, hold, exhale } = defaultBreathingPattern
      const cycleDuration = inhale + hold + exhale
      const cycleProgress = (elapsed % cycleDuration) / cycleDuration

      if (cycleProgress < inhale / cycleDuration) {
        setPhase('inhale')
        setProgress((cycleProgress * cycleDuration) / inhale)
      } else if (cycleProgress < (inhale + hold) / cycleDuration) {
        setPhase('hold')
        setProgress(1)
      } else {
        setPhase('exhale')
        setProgress(((cycleProgress - (inhale + hold) / cycleDuration) * cycleDuration) / exhale)
      }

      animationFrameRef.current = requestAnimationFrame(updateAnimation)
    }

    animationFrameRef.current = requestAnimationFrame(updateAnimation)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isActive])

  const getBreathPhaseColor = useCallback((phase: BreathingPhase): string => {
    switch (phase) {
      case 'inhale':
        return '#9b87f2'
      case 'hold':
        return '#7E69F2'
      case 'exhale':
        return '#D6BCFA'
      default:
        return '#F2F0FF'
    }
  }, [])

  const getBreathPhaseText = useCallback((phase: BreathingPhase): string => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In'
      case 'hold':
        return 'Hold'
      case 'exhale':
        return 'Breathe Out'
      default:
        return ''
    }
  }, [])

  return {
    isActive,
    phase,
    progress,
    cycleCount,
    theme,
    startBreathing,
    stopBreathing,
    toggleTheme,
    getBreathPhaseColor,
    getBreathPhaseText,
  }
}
