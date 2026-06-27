import { useRef, useEffect, useState, useCallback } from 'react'

interface ParallaxLayer {
  speed: number
  opacity: number
  scale: number
  blur: number
  element: HTMLDivElement | null
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  maxLife: number
  frequency: number
  amplitude: number
}

export function useParallaxVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>(0)
  const layersRef = useRef<ParallaxLayer[]>([])
  const particlesRef = useRef<Particle[]>([])
  const audioDataRef = useRef<Float32Array>(new Float32Array(256))
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [blendMode, setBlendMode] = useState<'overlay' | 'multiply' | 'screen'>('overlay')
  const [isAudioReactive, setIsAudioReactive] = useState(true)
  const analyserRef = useRef<AnalyserNode | null>(null)

  const createLayers = useCallback(() => {
    const layers: ParallaxLayer[] = []
    for (let i = 0; i < 3; i++) {
      const element = document.createElement('div')
      element.className = `parallax-layer layer-${i}`
      if (containerRef.current) {
        containerRef.current.appendChild(element)
      }
      layers.push({\n        speed: 0.5 + i * 0.2,
        opacity: 0.8 - i * 0.2,
        scale: 1 + i * 0.1,
        blur: i * 2,
        element,
      })
    }
    layersRef.current = layers
  }, [])

  const createParticles = useCallback((count: number = 50) => {
    const particles: Particle[] = []
    const colors = ['#9b87f2', '#7E69F2', '#D6BCFA', '#F2F0FF']
    
    for (let i = 0; i < count; i++) {
      const particle: Particle = {
        x: Math.random() * (window.innerWidth || 1920),
        y: Math.random() * (window.innerHeight || 1080),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 100,
        maxLife: 100,
        frequency: Math.random() * 0.02,
        amplitude: Math.random() * 0.5 + 0.2,
      }
      particles.push(particle)
    }
    particlesRef.current = particles
  }, [])

  const animate = useCallback(() => {
    if (!containerRef.current) return

    const time = Date.now() * 0.001
    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    layersRef.current.forEach((layer, index) => {
      if (!layer.element) return

      const speed = layer.speed
      const rotation = time * speed * (index + 1)
      const translateX = Math.sin(time * speed) * 20
      const translateY = Math.cos(time * speed) * 20

      layer.element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(${layer.scale})`
      layer.element.style.opacity = layer.opacity.toString()
      
      if (layer.blur > 0) {
        layer.element.style.filter = `blur(${layer.blur}px)`
      }
    })

    const audioFrequency = audioDataRef.current ? audioDataRef.current.reduce((a, b) => a + b, 0) / audioDataRef.current.length : 0.5

    particlesRef.current.forEach((particle, i) => {
      particle.life--
      if (particle.life <= 0) {
        particle.life = particle.maxLife
        particle.x = Math.random() * (window.innerWidth || 1920)
        particle.y = Math.random() * (window.innerHeight || 1080)
      }

      const waveX = Math.sin(time * 2 + particle.frequency * i) * 20 * audioFrequency
      const waveY = Math.cos(time * 1.5 + particle.frequency * i) * 15 * audioFrequency

      particle.x += particle.vx + waveX
      particle.y += particle.vy + waveY

      if (particle.x < 0) particle.x = window.innerWidth || 1920
      if (particle.x > (window.innerWidth || 1920)) particle.x = 0
      if (particle.y < 0) particle.y = window.innerHeight || 1080
      if (particle.y > (window.innerHeight || 1080)) particle.y = 0

      const size = particle.size * (particle.life / particle.maxLife)

      if (layer.element && layer.element.parentNode) {
        const particleElement = document.createElement('div')
        particleElement.className = 'particle'
        particleElement.style.left = `${particle.x}px`
        particleElement.style.top = `${particle.y}px`
        particleElement.style.width = `${size}px`
        particleElement.style.height = `${size}px`
        particleElement.style.backgroundColor = particle.color
        particleElement.style.borderRadius = '50%'
        particleElement.style.position = 'absolute'
        particleElement.style.boxShadow = `0 0 ${size * 2}px ${particle.color}`
        layer.element.appendChild(particleElement)

        setTimeout(() => {
          if (particleElement.parentNode === layer.element) {
            particleElement.remove()
          }
        }, 50)
      }
    })

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [])

  const setAnalyser = useCallback((analyser: AnalyserNode | null) => {
    analyserRef.current = analyser
    if (analyser) {
      const dataArray = new Float32Array(analyser.frequencyBinCount)
      analyser.getFloatFrequencyData(dataArray)
      audioDataRef.current = dataArray
    }
  }, [])

  const startAnimation = useCallback(() => {
    createLayers()
    createParticles()
    animate()
  }, [createLayers, createParticles, animate])

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = 0
    }
    layersRef.current.forEach(layer => {
      if (layer.element && layer.element.parentNode) {
        layer.element.remove()
      }
    })
    layersRef.current = []
    particlesRef.current = []
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  useEffect(() => {
    startAnimation()
    return () => {
      stopAnimation()
    }
  }, [startAnimation, stopAnimation])

  useEffect(() => {
    const handleResize = () => {
      layersRef.current.forEach(layer => {
        if (layer.element) {
          layer.element.style.width = `${window.innerWidth}px`
          layer.element.style.height = `${window.innerHeight}px`
        }
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return {
    containerRef,
    isFullscreen,
    blendMode,
    setBlendMode,
    isAudioReactive,
    setIsAudioReactive,
    setAnalyser,
    toggleFullscreen,
  }
}
