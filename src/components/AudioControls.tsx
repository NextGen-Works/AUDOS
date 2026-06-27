import { useState, useEffect } from 'react'
import { useAudio } from '../store/audioStore'

const timerOptions = [5, 10, 15, 20, 30]

export function AudioControls() {
  const {
    isPlaying,
    frequency,
    frequencyLadder,
    type,
    timer,
    progress,
    volume,
    setFrequency,
    setType,
    setTimer,
    setVolume,
    setPlaying,
    setProgress,
    resetAudio,
  } = useAudio()

  const [currentStep, setCurrentStep] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (timer) {
      setTimeLeft(timer * 60)
    }
  }, [timer])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && timer && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 60) {
            setProgress(prev / (timer * 60))
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, timer, timeLeft, setProgress])

  useEffect(() => {
    if (timeLeft <= 0 && isPlaying) {
      setPlaying(false)
      setProgress(0)
    }
  }, [timeLeft, isPlaying, setPlaying, setProgress])

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrequency(parseInt(e.target.value))
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as any)
  }

  const handleTimerChange = (value: number) => {
    setTimer(value)
    setCurrentStep(0)
  }

  const handlePlayPause = () => {
    setPlaying(!isPlaying)
  }

  const handleStop = () => {
    setPlaying(false)
    setProgress(0)
  }

  const handleReset = () => {
    resetAudio()
    setCurrentStep(0)
    setTimeLeft(0)
  }

  const handleLadderToggle = () => {
    setCurrentStep(prev => {
      const nextStep = (prev + 1) % frequencyLadder.length
      setFrequency(frequencyLadder[nextStep])
      return nextStep
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' + secs : secs}`
  }

  return (
    <div className="audio-controls">
      <div className="controls-header">
        <h2>Audio Entrainment Engine</h2>
        <div className="controls-grid">
          <div className="control-group">
            <label htmlFor="frequency">Frequency (Hz)</label>
            <select
              id="frequency"
              value={frequency}
              onChange={handleFrequencyChange}
              className="control-input"
            >
              <option value="3">3 Hz</option>
              <option value="6">6 Hz</option>
              <option value="9">9 Hz</option>
              <option value="12">12 Hz</option>
              <option value="15">15 Hz</option>
              <option value="18">18 Hz</option>
              <option value="21">21 Hz</option>
              <option value="24">24 Hz</option>
              <option value="27">27 Hz</option>
              <option value="30">30 Hz</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="type">Tone Type</label>
            <select
              id="type"
              value={type}
              onChange={handleTypeChange}
              className="control-input"
            >
              <option value="pure">Pure Tone</option>
              <option value="bin">Binaural</option>
              <option value="iso">Isochronic</option>
            </select>
          </div>

          <div className="control-group ladder-toggle">
            <button
              onClick={handleLadderToggle}
              className="toggle-button"
              title="Toggle Frequency Ladder (3→6→9 Hz)"
            >
              Ladder: {frequencyLadder[currentStep]} Hz
            </button>
          </div>

          <div className="control-group">
            <label htmlFor="timer">Timer</label>
            <select
              id="timer"
              value={timer || ''}
              onChange={e => handleTimerChange(parseInt(e.target.value) || 0)}
              className="control-input"
            >
              <option value="">No Timer</option>
              {timerOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt} min
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="volume">Volume</label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="control-range"
            />
          </div>

          <div className="control-group play-controls">
            <button
              onClick={handlePlayPause}
              className={`play-button ${isPlaying ? 'playing' : ''}`}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={handleStop}
              className="stop-button"
              title="Stop"
            >
              ■
            </button>
            <button
              onClick={handleReset}
              className="reset-button"
              title="Reset"
            >
              ⟲
            </button>
          </div>

          {timer > 0 && (
            <div className="control-group timer-display">
              <div className="timer-bar-container">
                <div
                  className="timer-bar"
                  style={{ width: `${(timeLeft / (timer * 60)) * 100}%` }}
                />
              </div>
              <div className="timer-text">{formatTime(timeLeft)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
