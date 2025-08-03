import { Colors } from '@renderer/constants/Colors'
import { JSX } from 'react'

interface TimelineTask {
  id: number
  name: string
  startDay: number
  endDay: number
  color: string
}

export const TaskTimeline = (): JSX.Element => {
  // Sample data based on the image
  const tasks: TimelineTask[] = [
    {
      id: 1,
      name: 'Interview',
      startDay: 12,
      endDay: 14,
      color: '#FF6B3D' // Orange
    },
    {
      id: 2,
      name: 'Ideate',
      startDay: 13,
      endDay: 16,
      color: '#1DB68B' // Green
    },
    {
      id: 3,
      name: 'Wireframe',
      startDay: 14,
      endDay: 17,
      color: '#6B7AFF' // Blue
    },
    {
      id: 4,
      name: 'Evaluate',
      startDay: 15,
      endDay: 18,
      color: '#1A1A1A' // Black
    }
  ]

  // Days to display on the timeline
  const days = [12, 13, 14, 15, 16, 17, 18]

  // Current progress day (the day with the marker)
  const currentDay = 16

  return (
    <div
      className="w-full rounded-md shadow-sm"
      style={{ padding: 5, fontFamily: '"Exo", sans-serif', backgroundColor: Colors.darkGreen }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
        <div className="flex items-center">
          <p className="text-xl font-bold" style={{ color: Colors.primary, fontFamily: 'Skyer' }}>
            Task Timeline
          </p>
        </div>
        <div className="ml-auto">
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative h-64">
        {/* Timeline content */}
        <div className="relative h-full p-4">
          {/* Tasks */}
          <div className="relative h-full">
            {tasks.map((task, index) => {
              // Calculate position and width based on days
              const startPosition =
                ((task.startDay - days[0]) / (days[days.length - 1] - days[0])) * 100

              const width =
                ((task.endDay - task.startDay) / (days[days.length - 1] - days[0])) * 100

              const topPosition = index * 60 + 10 // Stagger tasks vertically

              return (
                <div
                  key={task.id}
                  className="absolute flex items-center justify-center rounded-full text-white font-medium"
                  style={{
                    left: `${startPosition}%`,
                    top: `${topPosition}px`,
                    width: `${width}%`,
                    height: '50px',
                    backgroundColor: task.color
                  }}
                >
                  {task.name}
                </div>
              )
            })}

            {/* Progress line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-orange-500"
              style={{
                left: `${((currentDay - days[0]) / (days[days.length - 1] - days[0])) * 100}%`,
                height: '100%'
              }}
            >
              {/* Progress marker */}
              <div
                className="absolute -top-2 w-4 h-4 rounded-full bg-orange-500"
                style={{ left: '-6px' }}
              />
            </div>
          </div>

          {/* Day labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            {days.map((day) => (
              <div
                key={`day-${day}`}
                className="font-medium"
                style={{ color: day === currentDay ? Colors.primary : '#fff' }}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
