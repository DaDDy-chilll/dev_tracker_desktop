import { Colors } from '@renderer/constants/Colors'
import { useGetTasks } from '@renderer/features/full-screen/services'
import type { Task } from '@renderer/features/full-screen/services/tasks/task.type'
import { addDays, format, startOfWeek } from 'date-fns'
import { JSX } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

export const TaskTimeline = (): JSX.Element => {
  const now = new Date()
  const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }) // 1 = Monday
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i)
    return {
      date,
      dayOfMonth: format(date, 'd'),
      dayName: format(date, 'EEE')
    }
  })

  // Current progress day (the day with the marker)
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 })
  const endOfWeekDate = addDays(startOfWeekDate, 6)

  const { data: tasks = [] } = useGetTasks({
    start_date: startOfWeekDate,
    end_date: endOfWeekDate
  })

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

      <div className="relative h-64 px-2">
        {/* Timeline content */}
        <div className="relative h-full pb-7">
          {/* Tasks */}
          <div className="relative h-[90%]  overflow-auto">
            {tasks?.data?.map((task, index) => {
              // Parse the dates
              const startDate = task.start_date ? new Date(task.start_date) : new Date()
              const endDate = task.end_date ? new Date(task.end_date) : new Date()

              // Convert dates to timestamps for comparison
              const startTime = startDate.getTime()
              const endTime = endDate.getTime()

              // Find the start and end indices in the days array
              const startDayIndex = days.findIndex((day) => {
                const dayStart = new Date(day.date)
                dayStart.setHours(0, 0, 0, 0)
                const dayEnd = new Date(dayStart)
                dayEnd.setHours(23, 59, 59, 999)
                return startTime <= dayEnd.getTime()
              })

              const endDayIndex = days.findLastIndex((day) => {
                const dayStart = new Date(day.date)
                dayStart.setHours(0, 0, 0, 0)
                const dayEnd = new Date(dayStart)
                dayEnd.setHours(23, 59, 59, 999)
                return endTime >= dayStart.getTime()
              })

              // Calculate position and width based on days
              const startPosition =
                startDayIndex >= 0 ? (startDayIndex / (days.length - 1)) * 100 : 0
              const visibleEndIndex = endDayIndex >= 0 ? endDayIndex : days.length - 1
              const width =
                startDayIndex >= 0 && endDayIndex >= 0
                  ? ((visibleEndIndex - startDayIndex + 1) / days.length) * 100
                  : 0

              const topPosition = index * 60 + 10 // Stagger tasks vertically

              return (
                <Tooltip.Provider key={task.id}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <div
                        className="absolute rounded-md p-2 text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
                        style={{
                          left: `${startPosition}%`,
                          width: `${width}%`,
                          top: `${topPosition}px`,
                          backgroundColor: task.project?.color,
                          zIndex: 1
                        }}
                      >
                        {task.name}
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="bg-gray-900 rounded-md shadow-lg p-3 text-sm text-gray-800 max-w-xs z-50"
                        side="bottom"
                        sideOffset={5}
                      >
                        <div
                          className="font-bold mb-1 text-white"
                          style={{ fontFamily: '"Exo", sans-serif' }}
                        >
                          {task.name}
                        </div>
                        <div
                          className="text-xs mb-1"
                          style={{ fontFamily: '"Exo", sans-serif', color: task.project?.color }}
                        >
                          {task.project?.name || 'No Project'}
                        </div>
                        <div
                          className="text-xs text-gray-500"
                          style={{ fontFamily: '"Exo", sans-serif' }}
                        >
                          {task.start_date
                            ? format(new Date(task.start_date), 'MMM dd')
                            : 'No start date'}
                          {' - '}
                          {task.end_date
                            ? format(new Date(task.end_date), 'MMM dd')
                            : 'No end date'}
                        </div>
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )
            })}

            {/* Current day indicator */}
            <div
              className="absolute top-2 bottom-0 w-0.5 bg-[#10b981] z-40"
              style={{
                left: `${(days.findIndex((d) => d.dayOfMonth === currentDay.toString()) / (days.length - 1)) * 100}%`,
                height: '110%'
              }}
            >
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-[#10b981] flex items-center justify-center"></div>
            </div>
          </div>

          {/* Day numbers */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between bg-[#565656] z-50 p-1 rounded-md">
            {days.map((day) => (
              <div
                key={day.date.toISOString()}
                className="flex flex-col items-center justify-center gap-2"
              >
                <div
                  className={`text-xs  ${
                    day.dayOfMonth === currentDay.toString()
                      ? 'font-bold text-[#10b981]'
                      : 'text-gray-300'
                  }`}
                  style={{ fontFamily: 'Skyer' }}
                >
                  {day.dayName}
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${
                    day.dayOfMonth === currentDay.toString()
                      ? 'bg-[#10b981] text-white'
                      : 'text-white'
                  }`}
                  style={{ fontFamily: 'Skyer' }}
                >
                  {day.dayOfMonth}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
