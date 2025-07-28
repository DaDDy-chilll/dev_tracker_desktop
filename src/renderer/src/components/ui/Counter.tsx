import { MotionValue, motion, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState, JSX } from 'react'

interface NumberProps {
  mv: MotionValue<number>
  number: number
  height: number
}

const Number = ({ mv, number, height }: NumberProps): JSX.Element => {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10
    const offset = (10 + number - placeValue) % 10
    let memo = offset * height
    if (offset > 5) {
      memo -= 10 * height
    }
    return memo
  })

  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return <motion.span style={{ ...style, y }}>{number}</motion.span>
}

interface DigitProps {
  place: number
  value: number
  height: number
  digitStyle?: React.CSSProperties
}

const Digit = ({ place, value, height, digitStyle }: DigitProps): JSX.Element => {
  const valueRoundedToPlace = Math.floor(value / place)
  const animatedValue = useSpring(valueRoundedToPlace)

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace)
  }, [animatedValue, valueRoundedToPlace])

  const defaultStyle: React.CSSProperties = {
    height,
    position: 'relative',
    width: '1ch',
    fontVariantNumeric: 'tabular-nums'
  }

  return (
    <div style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  )
}

interface CounterProps {
  value?: number
  fontSize?: number
  padding?: number
  timeFormat?: boolean
  liveClock?: boolean
  places?: number[]
  gap?: number
  borderRadius?: number
  horizontalPadding?: number
  textColor?: string
  fontWeight?: React.CSSProperties['fontWeight']
  containerStyle?: React.CSSProperties
  counterStyle?: React.CSSProperties
  digitStyle?: React.CSSProperties
  colonStyle?: React.CSSProperties
  gradientHeight?: number
  gradientFrom?: string
  gradientTo?: string
  topGradientStyle?: React.CSSProperties
  bottomGradientStyle?: React.CSSProperties
}

// Helper function to convert seconds to HH:MM:SS format
const secondsToTime = (seconds: number): { hours: number; minutes: number; seconds: number } => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return { hours, minutes, seconds: secs }
}

// Colon component for time display
const Colon = ({ height, style }: { height: number; style?: React.CSSProperties }): JSX.Element => {
  const defaultStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: height,
    fontSize: height * 0.8,
    lineHeight: 1
  }

  return <div style={{ ...defaultStyle, ...style }}>:</div>
}

export const Counter = ({
  value = 0,
  fontSize = 100,
  padding = 0,
  timeFormat = false,
  liveClock = false,
  places = [100, 10, 1],
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = 'white',
  fontWeight = 'bold',
  containerStyle,
  counterStyle,
  digitStyle,
  colonStyle,
  gradientHeight = 16,
  topGradientStyle,
  bottomGradientStyle
}: CounterProps): JSX.Element => {
  const height = fontSize + padding

  // State for live clock mode
  const [currentTime, setCurrentTime] = useState<number>(value)

  // Set up interval for live clock
  useEffect(() => {
    if (liveClock) {
      // Initialize with current time
      const now = new Date()
      const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
      setCurrentTime(seconds)

      // Update every second
      const interval = setInterval(() => {
        const now = new Date()
        const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
        setCurrentTime(seconds)
      }, 1000)

      return () => clearInterval(interval)
    } else {
      // If not in live clock mode, use the provided value
      setCurrentTime(value)
      return undefined // Explicit return to satisfy all code paths
    }
  }, [liveClock, value])

  const defaultContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block'
  }

  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    display: 'flex',
    gap: gap,
    overflow: 'hidden',
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    lineHeight: 1,
    color: textColor,
    fontWeight: fontWeight
  }

  const gradientContainerStyle: React.CSSProperties = {
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }

  const defaultTopGradientStyle: React.CSSProperties = {
    height: gradientHeight
  }

  const defaultBottomGradientStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: gradientHeight
  }

  // Handle time format display
  if (timeFormat || liveClock) {
    const time = secondsToTime(currentTime)
    return (
      <div style={{ ...defaultContainerStyle, ...containerStyle }}>
        <div style={{ ...defaultCounterStyle, ...counterStyle }}>
          {/* Hours */}
          <Digit
            key="hour-tens"
            place={10}
            value={time.hours}
            height={height}
            digitStyle={digitStyle}
          />
          <Digit
            key="hour-ones"
            place={1}
            value={time.hours}
            height={height}
            digitStyle={digitStyle}
          />
          {/* Colon between hours and minutes */}
          <Colon height={height} style={colonStyle} />
          {/* Minutes */}
          <Digit
            key="minute-tens"
            place={10}
            value={time.minutes}
            height={height}
            digitStyle={digitStyle}
          />
          <Digit
            key="minute-ones"
            place={1}
            value={time.minutes}
            height={height}
            digitStyle={digitStyle}
          />
          {/* Colon between minutes and seconds */}
          <Colon height={height} style={colonStyle} />
          {/* Seconds */}
          <Digit
            key="second-tens"
            place={10}
            value={time.seconds}
            height={height}
            digitStyle={digitStyle}
          />
          <Digit
            key="second-ones"
            place={1}
            value={time.seconds}
            height={height}
            digitStyle={digitStyle}
          />
        </div>
        <div style={gradientContainerStyle}>
          <div style={topGradientStyle ? topGradientStyle : defaultTopGradientStyle} />
          <div style={bottomGradientStyle ? bottomGradientStyle : defaultBottomGradientStyle} />
        </div>
      </div>
    )
  }

  // Original counter display
  return (
    <div style={{ ...defaultContainerStyle, ...containerStyle }}>
      <div style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place) => (
          <Digit key={place} place={place} value={value} height={height} digitStyle={digitStyle} />
        ))}
      </div>
      <div style={gradientContainerStyle}>
        <div style={topGradientStyle ? topGradientStyle : defaultTopGradientStyle} />
        <div style={bottomGradientStyle ? bottomGradientStyle : defaultBottomGradientStyle} />
      </div>
    </div>
  )
}
