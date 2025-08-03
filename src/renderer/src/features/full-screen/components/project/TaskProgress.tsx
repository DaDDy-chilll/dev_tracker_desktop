import { Colors } from '@renderer/constants/Colors'
import { JSX } from 'react'

interface ProgressData {
  day: number
  percentage: number
  change: number
}

export const TaskProgress = (): JSX.Element => {
  // Sample data based on the image
  const progressData: ProgressData[] = [
    { day: 12, percentage: 30, change: 8 },
    { day: 13, percentage: 20, change: 2 },
    { day: 14, percentage: 35, change: 12 },
    { day: 15, percentage: 40, change: 5 },
    { day: 16, percentage: 65, change: 8 },
    { day: 17, percentage: 45, change: 6 },
    { day: 18, percentage: 50, change: 10 }
  ]

  // Find the highest percentage for the main indicator
  const highestProgress = progressData.reduce(
    (max, item) => (item.percentage > max.percentage ? item : max),
    progressData[0]
  )

  // const getChangeColor = (change: number): string => {
  //   if (change <= 2) return 'bg-black text-white' // Black for small changes
  //   if (change >= 10) return 'bg-orange-500 text-white' // Orange for large changes
  //   return 'bg-green-500 text-white' // Green for moderate changes
  // }

  return (
    <div
      className="w-full rounded-md shadow-sm"
      style={{ padding: 5, fontFamily: '"Exo", sans-serif', backgroundColor: Colors.darkGreen }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
        <div className="flex items-center">
          <p className="text-xl font-bold" style={{ color: Colors.primary, fontFamily: 'Skyer' }}>
            Task Progress
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
        {/* Progress bars with diagonal stripes background */}
        <div className="relative h-full flex items-end justify-between">
          {progressData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{ width: `${100 / progressData.length}%` }}
            >
              {/* Percentage change indicator */}
              <div>+{item.change}%</div>

              {/* Progress bar */}
              <div className="relative w-8 flex justify-center">
                <div
                  className={`w-8 rounded-full ${item.day === highestProgress.day ? 'bg-black' : 'bg-gray-200'}`}
                  style={{ height: `${item.percentage * 2}px` }}
                >
                  {/* Main percentage indicator for highest bar */}
                  {item.day === highestProgress.day && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                      <div className="bg-black text-white rounded-full px-4 py-2 text-lg font-bold">
                        {item.percentage}%
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    </div>
                  )}

                  {/* Orange indicator on the highest bar */}
                  {item.day === highestProgress.day && (
                    <div
                      className="absolute w-8 flex justify-center"
                      style={{ bottom: `${item.percentage * 0.6}px` }}
                    >
                      <div className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                        +{item.change}%
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Day number */}
              <div className="mt-2 font-medium">{item.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
