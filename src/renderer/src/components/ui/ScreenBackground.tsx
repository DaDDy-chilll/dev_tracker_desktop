import React, { useEffect, useState, JSX } from 'react'
interface ScreenBackgroundProps {
  children: React.ReactNode
}

const ScreenBackground = ({ children }: ScreenBackgroundProps): JSX.Element => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  // Create a dot pattern canvas and convert to data URL
  useEffect(() => {
    // Create canvas for dot pattern
    const canvas = document.createElement('canvas')
    const size = 100 // Size of the canvas/pattern
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Set dark background
      ctx.fillStyle = '#1a1a1a' // Dark background color
      ctx.fillRect(0, 0, size, size)

      // Draw dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)' // Light dots with low opacity

      // Configure dot pattern
      const dotSize = 2 // Smaller dots
      const spacing = 15 // Closer spacing for more dots

      // Draw dots in a grid pattern
      for (let x = 0; x < size; x += spacing) {
        for (let y = 0; y < size; y += spacing) {
          ctx.beginPath()
          ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png')
      setBackgroundImage(dataUrl)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full">
      {/* Base layer with dot pattern from generated image */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 1,
          backgroundColor: '#1a1a1a', // Dark background color
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundRepeat: 'repeat',
          pointerEvents: 'none'
        }}
      />

      {/* Optional subtle gradient overlay for depth */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 2,
          // background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default ScreenBackground
