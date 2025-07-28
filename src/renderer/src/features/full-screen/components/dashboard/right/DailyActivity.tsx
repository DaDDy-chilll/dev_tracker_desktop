import { JSX } from 'react'
import { Colors } from '@renderer/constants/Colors'
import clsx from 'clsx'
import { MoreVertical, TrendingUp } from 'lucide-react'

type DayActivity = {
  day: string
  percentage: number
  color?: string
}

export const DailyActivity = (): JSX.Element => {
  // Sample data - this would come from props or state in a real app
  const activities: DayActivity[] = [
    { day: 'Mon', percentage: 92, color: 'white' },
    { day: 'Tue', percentage: 41, color: '#E74C3C' },
    { day: 'Wed', percentage: 78, color: 'white' },
    { day: 'Thu', percentage: 0, color: 'white' },
    { day: 'Fri', percentage: 0, color: 'white' }
  ]

  const overallPercentage = 83
  const trend = 12

  return (
    <div
      className={clsx('w-full h-fit', 'rounded-md')}
      style={{
        backgroundColor: Colors.darkGreen,
        padding: 16,
        fontFamily: '"Exo", sans-serif'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
        <div className="flex items-center gap-4 text-2xl">
          <h1
            style={{
              color: Colors.primary,
              fontWeight: 600,
              fontFamily: 'Skyer'
            }}
          >
            Activity
          </h1>
          <div
            className="rounded-md flex items-center gap-2"
            style={{
              backgroundColor: '#10B981',
              color: 'white',
              fontSize: '0.9rem',
              paddingInline: 10,
              paddingBlock: 4
            }}
          >
            <span>+{trend}%</span>
            <TrendingUp size={16} />
          </div>
        </div>

        <button className="text-gray-400">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Main Percentage */}
      <div className="text-5xl">
        <h2
          style={{
            color: '#10B981',
            fontWeight: 'bold',
            lineHeight: 1,
            marginBlock: 20,
            WebkitTextStroke: '1px #00ffaa'
          }}
        >
          {overallPercentage}%
        </h2>
      </div>

      {/* Activity Bars */}
      <div className="flex justify-between gap-3 mt-4">
        {activities.map((activity) => (
          <div key={activity.day} className="flex flex-col items-center flex-1">
            {/* Bar */}
            <div
              className="w-full rounded-lg overflow-hidden relative"
              style={{
                backgroundColor: '#1e1e1e',
                height: 180
              }}
            >
              <div
                className="absolute bottom-0 w-full"
                style={{
                  backgroundColor: '#333',
                  height: `${activity.percentage}%`,
                  transition: 'height 0.5s ease'
                }}
              ></div>
            </div>

            {/* Day Label */}
            <div className="mt-2 text-gray-400">{activity.day}</div>

            {/* Percentage */}
            <div
              style={{
                color: activity.color || 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              {activity.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
