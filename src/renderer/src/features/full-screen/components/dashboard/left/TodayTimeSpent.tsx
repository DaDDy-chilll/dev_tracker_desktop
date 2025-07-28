import { Colors } from '@renderer/constants/Colors'
import clsx from 'clsx'
import { AudioWaveform } from 'lucide-react'
import { JSX } from 'react'

export const TodayTimeSpent = (): JSX.Element => {
  return (
    <div
      className={clsx('w-full h-fit', 'rounded-md')}
      style={{
        backgroundColor: Colors.darkGreen,
        padding: 10,
        fontFamily: '"Exo", sans-serif'
      }}
    >
      {/* Header */}
      <div className="flex justify-center items-center flex-col gap-3" style={{ marginTop: 10 }}>
        <h1 style={{ color: 'white', fontWeight: 600, fontSize: '1.5rem', fontFamily: 'Skyer' }}>
          Color Palette Selection
        </h1>
        <p style={{ color: Colors.primary, fontSize: '0.9rem' }}>Over9k: Gamers App</p>
      </div>

      {/* Pause Button */}
      <div className="flex justify-center items-center " style={{ marginBlock: 20 }}>
        <div
          className="rounded-full flex justify-center items-center"
          style={{
            backgroundColor: Colors.primary,
            width: '120px',
            height: '120px',
            cursor: 'pointer'
          }}
        >
          <div className="flex justify-center items-center">
            <AudioWaveform size={50} color="white" />
          </div>

          {/* <div className="flex justify-center items-center">
            <OctagonPause size={50} color="white" />
          </div> */}
        </div>
      </div>

      {/* Time Display */}
      <div
        className="flex justify-between items-center"
        style={{ paddingInline: 16, paddingBlock: 4, marginBlock: 10 }}
      >
        {/* Today's Time */}
        <div
          className="flex flex-col items-center rounded-lg"
          style={{ backgroundColor: Colors.mutedForeground, paddingInline: 10 }}
        >
          <span style={{ color: '#888', fontSize: '1rem' }}>Today</span>
          <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>00:57:56</span>
        </div>

        {/* Limits */}
        <div
          className="flex flex-col items-center rounded-lg"
          style={{ backgroundColor: Colors.mutedForeground, paddingInline: 10 }}
        >
          <span style={{ color: '#888', fontSize: '1rem' }}>Limits</span>
          <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>06:00:00</span>
        </div>
      </div>
    </div>
  )
}
