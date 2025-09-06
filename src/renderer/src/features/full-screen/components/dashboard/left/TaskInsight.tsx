import { Colors } from '@renderer/constants/Colors'
import clsx from 'clsx'
import { JSX, useMemo } from 'react'
import { useGetTasks } from '@renderer/features/full-screen/services'

export const TaskInsight = (): JSX.Element => {
  const { data: tasksResponse = { data: [] } } = useGetTasks()
  const tasks = tasksResponse.data || []

  // Calculate insights from tasks
  const insights = useMemo(() => {
    // Calculate time spent from activities
    const totalTimeSpent = tasks.reduce((total, task) => {
      if (task.activities && task.activities.length > 0) {
        const taskTime = task.activities.reduce((sum, activity) => {
          return sum + (activity.duration || 0)
        }, 0)
        return total + taskTime
      }
      return total
    }, 0)

    // Convert minutes to hours
    const timeSpentHours = Math.round(totalTimeSpent / 60)

    // Calculate task status counts
    const backlogs = tasks.filter((task) => task.status === 'NOT_STARTED').length
    const inProgress = tasks.filter((task) => task.status === 'IN_PROGRESS').length
    const completed = tasks.filter((task) => task.status === 'DONE').length
    const totalTasks = tasks.length

    // Calculate percentages
    const timeSpentPercentage =
      totalTimeSpent > 0 ? Math.min(100, Math.round((timeSpentHours / 8) * 100)) : 0
    const tasksPercentage = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0

    // Calculate today's tasks
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayTasks = tasks.filter((task) => {
      const dueDate = task.due_time ? new Date(task.due_time) : null
      return dueDate && dueDate >= today && dueDate < tomorrow
    }).length

    // Calculate weekly data for chart (last 7 days)
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const dayTasks = tasks.filter((task) => {
        const taskDate = task.updated_at ? new Date(task.updated_at) : new Date(task.created_at)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === date.getTime()
      })

      return {
        completed: tasks.filter((t) => t.status === 'DONE').length,
        inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
        notStarted: tasks.filter((t) => t.status === 'NOT_STARTED').length
      }
    }).reverse()

    return {
      timeSpent: timeSpentHours,
      timeSpentPercentage,
      totalTasks,
      tasksPercentage,
      backlogs,
      inProgress,
      completed,
      todayTasks,
      weeklyData
    }
  }, [tasks])

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
      <div className="flex justify-between items-center" style={{ marginBlock: 10 }}>
        <div className="flex text-2xl justify-between items-center gap-2 w-full">
          <h1 style={{ color: Colors.primary, fontWeight: 600, fontFamily: 'Skyer' }}>
            Task Insights
          </h1>

          <div className="flex items-center gap-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 10L6 6L9 9L14 4"
                stroke="#4ADE80"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 4H14V8"
                stroke="#4ADE80"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#4ADE80] text-sm">+19.24</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-lg flex flex-row gap-4">
        {/* Time Spent & Tasks */}
        <div className="flex flex-col justify-start items-start">
          <div>
            <p className="text-gray-500 text-sm">Time Spent</p>
            <div className="flex items-center gap-2">
              <span className="text-white text-lg font-bold">{insights.timeSpent}h</span>
              <span
                className="bg-indigo-900 text-indigo-300 text-xs rounded"
                style={{ paddingInline: 10 }}
              >
                {insights.timeSpentPercentage}%
              </span>
            </div>
          </div>

          <div className="flex-1" style={{ marginTop: 10 }}>
            <p className="text-gray-500 text-sm mb-1">Tasks</p>
            <div className="flex items-center gap-2">
              <span className="text-white text-lg font-bold">{insights.todayTasks}</span>
              <span
                className="bg-indigo-900 text-indigo-300 text-xs rounded"
                style={{ paddingInline: 10 }}
              >
                {insights.tasksPercentage}%
              </span>
            </div>
          </div>

          {/* Status Legend */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
              <span className="text-white text-base">Backlogs</span>
              <span className="text-gray-400 ml-1 text-xs" style={{ color: Colors.primary }}>
                {insights.backlogs}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-400"></div>
              <span className="text-white text-base">Progress</span>
              <span className="text-gray-400 ml-1 text-xs" style={{ color: Colors.primary }}>
                {insights.inProgress}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-white text-base">Completed</span>
              <span className="text-gray-400 ml-1 text-xs" style={{ color: Colors.primary }}>
                {insights.completed}
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div
          className="w-full flex items-end justify-between"
          style={{ padding: 5, paddingTop: 40 }}
        >
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
            const dayData = insights.weeklyData[index] || {
              completed: 0,
              inProgress: 0,
              notStarted: 0
            }
            const maxHeight = 60 // Maximum height for bars

            return (
              <div key={index} className="flex flex-col items-center gap-1">
                {/* Bar Chart - Each day has stacked bars with different colors */}
                <div className="relative w-3 flex flex-col gap-1 items-center">
                  {/* Completed tasks (green) */}
                  <div
                    className="w-1 bg-green-400 rounded-full"
                    style={{
                      height: `${Math.max(2, (dayData.completed / Math.max(1, Math.max(...insights.weeklyData.map((d) => d.completed)))) * maxHeight)}px`
                    }}
                  ></div>
                  {/* In progress tasks (pink) */}
                  <div
                    className="w-1 bg-pink-400 rounded-full"
                    style={{
                      height: `${Math.max(2, (dayData.inProgress / Math.max(1, Math.max(...insights.weeklyData.map((d) => d.inProgress)))) * maxHeight)}px`
                    }}
                  ></div>
                  {/* Not started tasks (indigo) */}
                  <div
                    className="w-1 bg-indigo-400 rounded-full"
                    style={{
                      height: `${Math.max(2, (dayData.notStarted / Math.max(1, Math.max(...insights.weeklyData.map((d) => d.notStarted)))) * maxHeight)}px`
                    }}
                  ></div>

                  {/* Today indicator */}
                  {index === new Date().getDay() && (
                    <div
                      className="absolute -top-6 text-xs rounded"
                      style={{
                        paddingInline: 5,
                        paddingBlock: 2,
                        color: Colors.secondary,
                        backgroundColor: Colors.primary
                      }}
                    >
                      Today
                    </div>
                  )}
                </div>
                <span className="text-gray-400 text-xs">{day}</span>
              </div>
            )
          })}
        </div>
      </div>

     
    </div>
  )
}
