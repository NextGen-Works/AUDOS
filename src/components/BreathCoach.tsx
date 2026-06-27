import React, { useState, useEffect, useRef, useCallback } from 'react'

type Theme = 'dark' | 'light'
type BreathingPattern = {
  inhale: number
  hold: number
  exhale: number
}
type BreathPhase = 'inhale' | 'hold' | 'exhale'

const defaultBreathingPattern: BreathingPattern = {
  inhale: 4,
  hold: 2,
  exhale: 6,
}

interface BreathCoachProps {
  isVisible: boolean
}

export function BreathCoach({ isVisible }: BreathCoachProps) {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<BreathPhase>('inhale')
  const [progress, setProgress] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [tools, setTools] = useState({
    calmEye: false,
    protectHeart: false,
    openMind: false,
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const animationFrameRef = useRef<number>(0)
  const cycleStartRef = useRef<number>(0)
  const lastPhaseRef = useRef<string>('')

  const toggleTool = useCallback((toolName: keyof typeof tools) => {
    setTools(prev => ({
      ...prev,
      [toolName]: !prev[toolName],
    }))
  }, [])

  const getBreathPhaseColor = useCallback((phase: BreathPhase): string => {
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

  const getBreathPhaseText = useCallback((phase: BreathPhase): string => {
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

  const updateBreath = useCallback(() => {
    if (!cycleStartRef.current) {
      cycleStartRef.current = Date.now()
      lastPhaseRef.current = phase
    }

    const elapsed = (Date.now() - cycleStartRef.current) / 1000
    const cycleDuration = defaultBreathingPattern.inhale + defaultBreathingPattern.hold + defaultBreathingPattern.exhale
    const cycleProgress = (elapsed % cycleDuration) / cycleDuration

    let newPhase: BreathPhase
    if (cycleProgress < defaultBreathingPattern.inhale / cycleDuration) {
      newPhase = 'inhale'
      setProgress((cycleProgress * cycleDuration) / defaultBreathingPattern.inhale)
    } else if (cycleProgress < (defaultBreathingPattern.inhale + defaultBreathingPattern.hold) / cycleDuration) {
      newPhase = 'hold'
      setProgress(1)
    } else {
      newPhase = 'exhale'
      setProgress(((cycleProgress - (defaultBreathingPattern.inhale + defaultBreathingPattern.hold) / cycleDuration) * cycleDuration) / defaultBreathingPattern.exhale)
    }

    if (newPhase !== lastPhaseRef.current) {
      setPhase(newPhase)
      lastPhaseRef.current = newPhase

      if (newPhase === 'exhale') {
        setCycleCount(prev => prev + 1)
      }
    }

    animationFrameRef.current = requestAnimationFrame(updateBreath)
  }, [phase])

  const startBreathing = useCallback(() => {
    setIsActive(true)
    cycleStartRef.current = Date.now()
    setPhase('inhale')
    setProgress(0)
    lastPhaseRef.current = 'inhale'
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

  const breathFeatures = [
    {
      name: 'calm eye',
      icon: '👁️',
      description: 'Reduce visual stimulation',
    },
    {
      name: 'protect heart',
      icon: '💓',
      description: 'Heart rate variability biofeedback',
    },
    {
      name: 'open mind',
      icon: '🧠',
      description: 'Enhance cognitive flexibility',
    },
  ]

  const BreathCircle = () => {
    const size = 200 + progress * 50
    const offset = 2 * Math.PI * (1 - progress)

    return (
      <div className="breath-circle-container">
        <svg width="300" height="300" className="breath-circle">
          <circle
            cx="150"
            cy="150"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray="753.98"
            strokeDashoffset={offset}
            className="breath-circle-ring"
            style={{ color: getBreathPhaseColor(phase) }}
          />
        </svg>
        <div className="breath-text">
          <div className="phase-label" style={{ color: getBreathPhaseColor(phase) }}>
            {getBreathPhaseText(phase)}
          </div>
          <div className="cycle-count">
            Cycle: {cycleCount}
          </div>
        </div>
      </div>
    )
  }

  if (!isVisible) return null

  return (
    <div className="breath-coach-container">
      <div className="breath-coach-header">
        <h2>Breath Coach</h2>
        <div className="breathing-pattern">
          Inhale: 4s | Hold: 2s | Exhale: 6s
        </div>
      </div>

      <div className="breath-coach-content">
        <div className="breath-visualization">
          {isActive ? <BreathCircle /> : (
            <div className="breath-placeholder">
              <div className="placeholder-circle">
                ⭕
              </div>
              <div className="start-text">
                Ready to breathe?
              </div>
            </div>
          )}
        </div>

        <div className="breath-controls">
          <button
            onClick={isActive ? stopBreathing : startBreathing}
            className={`control-button ${isActive ? 'stop' : 'start'}`}
          >
            {isActive ? '⏸ Pause' : '▶ Start'}
          </button>
        </div>

        <div className="breath-tools">
          <h3>Symbolic Tools</h3>
          <div className="tools-grid">
            {breathFeatures.map(feature => (
              <button
                key={feature.name}
                onClick={() => toggleTool(feature.name as keyof typeof tools)}
                className={`tool-button ${tools[feature.name as keyof typeof tools] ? 'active' : ''}`}
                title={feature.description}
              >
                <div className="tool-icon">{feature.icon}</div>
                <div className="tool-name">{feature.name}</div>
                {tools[feature.name as keyof typeof tools] && (
                  <div className="tool-indicator">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
