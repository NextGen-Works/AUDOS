import { useState, useEffect, useRef, useCallback } from 'react'

type SketchPoint = {
  x: number
  y: number
  time: number
  color: string
  size: number
}

type Tool = 'pen' | 'eraser' | 'picker'

type SketchColors = {
  primary: string
  secondary: string
  background: string
}

const defaultColors: SketchColors = {
  primary: '#9b87f2',
  secondary: '#7E69F2',
  background: '#F2F0FF',
}

export function useSketchpad() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState<string>(defaultColors.primary)
  const [size, setSize] = useState(3)
  const [points, setPoints] = useState<SketchPoint[]>([])
  const [colors, setColors] = useState<SketchColors>(defaultColors)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    ctxRef.current = canvas.getContext('2d')
    if (!ctxRef.current) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctxRef.current.scale(window.devicePixelRatio, window.devicePixelRatio)

    ctxRef.current.fillStyle = colors.background
    ctxRef.current.fillRect(0, 0, rect.width, rect.height)
  }, [colors])

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (tool === 'picker') {
      return
    }

    setIsDrawing(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    lastPointRef.current = { x, y }
  }, [tool])

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === 'picker') {
      return
    }

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const canvas = canvasRef.current
    if (!canvas || !ctxRef.current || !lastPointRef.current) return

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    ctxRef.current.beginPath()
    ctxRef.current.moveTo(lastPointRef.current.x, lastPointRef.current.y)
    ctxRef.current.lineTo(x, y)
    ctxRef.current.strokeStyle = tool === 'eraser' ? colors.background : color
    ctxRef.current.lineWidth = tool === 'eraser' ? size * 2 : size
    ctxRef.current.lineCap = 'round'
    ctxRef.current.lineJoin = 'round'
    ctxRef.current.stroke()

    setPoints(prev => [
      ...prev,
      { x, y, time: Date.now(), color, size }
    ])

    lastPointRef.current = { x, y }
  }, [isDrawing, tool, color, size, colors])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
    lastPointRef.current = null
  }, [])

  const clearCanvas = useCallback(() => {
    if (!ctxRef.current) return
    ctxRef.current.clearRect(0, 0, ctxRef.current.canvas.width, ctxRef.current.canvas.height)
    ctxRef.current.fillStyle = colors.background
    ctxRef.current.fillRect(0, 0, ctxRef.current.canvas.width, ctxRef.current.canvas.height)
    setPoints([])
  }, [colors])

  const exportImage = useCallback((quality: number = 1.0): string => {
    if (!canvasRef.current) return ''
    return canvasRef.current.toDataURL('image/png', quality)
  }, [])

  const exportSVG = useCallback(() => {
    if (points.length === 0) return ''

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasRef.current?.width || 800} ${canvasRef.current?.height || 600}">`
    svg += `<rect width="100%" height="100%" fill="${colors.background}"/>`

    points.forEach(point => {
      const prevPoint = points[points.indexOf(point) - 1]
      if (prevPoint) {
        svg += `<line x1="${prevPoint.x}" y1="${prevPoint.y}" x2="${point.x}" y2="${point.y}" stroke="${point.color}" stroke-width="${point.size}" stroke-linecap="round" stroke-linejoin="round"/>`
      }
    })

    svg += '</svg>'
    return svg
  }, [points, colors])

  const loadImage = useCallback((dataUrl: string) => {
    const img = new Image()
    img.onload = () => {
      if (!ctxRef.current) return
      ctxRef.current.clearRect(0, 0, ctxRef.current.canvas.width, ctxRef.current.canvas.height)
      ctxRef.current.drawImage(img, 0, 0, ctxRef.current.canvas.width, ctxRef.current.canvas.height)
    }
    img.src = dataUrl
  }, [])

  useEffect(() => {
    initializeCanvas()
  }, [initializeCanvas])

  return {
    canvasRef,
    isDrawing,
    tool,
    color,
    size,
    points,
    colors,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    setTool,
    setColor,
    setSize,
    initializeCanvas,
    exportImage,
    exportSVG,
    loadImage,
  }
}
