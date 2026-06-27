import { useRef, useEffect, useState } from 'react'
import { useParallaxVisualizer } from '../hooks/useParallaxVisualizer'

interface ParallaxBackgroundProps {
  isVisible: boolean
  audioAnalyser: AnalyserNode | null
}

export function ParallaxBackground({ isVisible, audioAnalyser }: ParallaxBackgroundProps) {
  const {
    containerRef,
    isFullscreen,
    blendMode,
    setBlendMode,
    isAudioReactive,
    setIsAudioReactive,
    setAnalyser,
    toggleFullscreen,
  } = useParallaxVisualizer()

  const [isCollapsed, setIsCollapsed] = useState(false)
  const previousBlendMode = useRef<'overlay' | 'multiply' | 'screen'>('overlay')

  useEffect(() => {
    if (audioAnalyser) {
      setAnalyser(audioAnalyser)
    }
  }, [audioAnalyser, setAnalyser])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCollapsed(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleBlendModeChange = (mode: 'overlay' | 'multiply' | 'screen') => {
    setBlendMode(mode)
    previousBlendMode.current = mode
  }

  const blendModeButtons = [
    { mode: 'overlay', icon: '🔀', label: 'Overlay' },
    { mode: 'multiply', icon: '⛶', label: 'Multiply' },
    { mode: 'screen', icon: '✂', label: 'Screen' },
  ]

  return (
    <div
      ref={containerRef}
      className={`parallax-container ${isVisible ? 'visible' : ''}`}>
      <div className="parallax-header">
        <h2>Multi-Layer Parallax Visualizer</h2>
        <div className="parallax-controls">
          <button
            onClick={() => setIsAudioReactive(!isAudioReactive)}
            className={`control-button ${isAudioReactive ? 'active' : ''}`}
            title="Toggle Audio Reactivity"
          >
            🎵
          </button>
          <button
            onClick={toggleFullscreen}
            className="control-button fullscreen-toggle"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? '⊞' : '⛶'}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="control-button collapse-toggle"
            title="Collapse/Expand"
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
        </div>
      </div>

      <div className="blend-modes">
        <div className="blend-mode-label">Blend Mode:</div>
        <div className="blend-mode-buttons">
          {blendModeButtons.map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => handleBlendModeChange(mode)}
              className={`blend-mode-button ${blendMode === mode ? 'active' : ''}`}
              title={label}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {!isCollapsed && (
        <div className="parallax-canvas">
          <canvas id="parallax-canvas" style={{ display: 'none' }}></canvas>
        </div>
      )}

      <div className="visualizer-info">
        {!isAudioReactive && <div className="info-item">Manual Control Mode</div>}
        {isAudioReactive && <div className="info-item">Audio Reactive Mode</div>}
        <div className="info-item">Layers: 3</div>
        <div className="info-item">Blend: {blendMode}</div>
      </div>
    </div>
  )
}
