import { Colors } from '@renderer/constants/Colors'
import { useGetTasks } from '@renderer/features/full-screen/services'
import { JSX, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

interface ProgressData {
  day: number
  dayName: string
  percentage: number
  change: number
  tasksCompleted: number
  totalTasks: number
  date: Date
}

export const TaskProgress = (): JSX.Element => {
  const { data: tasksResponse = { data: [] } } = useGetTasks()
  const tasks = tasksResponse.data || []

  // Calculate daily progress data from tasks with correct dates
  const progressData = useMemo(() => {
    const today = new Date()
    const last7Days: ProgressData[] = []
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Get the most recent Monday as starting point
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const monday = new Date(today)
    monday.setDate(today.getDate() - daysSinceMonday)
    monday.setHours(0, 0, 0, 0)

    // Create data for Monday to Sunday of current week
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const day = date.getDate()
      const dayName = dayNames[date.getDay()]

      // Filter tasks for this specific day
      const dayStart = new Date(date)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      const dayTasks = tasks.filter((task) => {
        const taskDate =
          task.status === 'DONE' && task.updated_at
            ? new Date(task.updated_at)
            : new Date(task.created_at)
        return taskDate >= dayStart && taskDate <= dayEnd
      })

      const completedTasks = dayTasks.filter((task) => task.status === 'DONE').length
      const totalTasks = dayTasks.length
      const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      last7Days.push({
        day,
        dayName,
        percentage,
        change: 0,
        tasksCompleted: completedTasks,
        totalTasks,
        date
      })
    }

    // Calculate day-to-day changes
    for (let i = 1; i < last7Days.length; i++) {
      last7Days[i].change = last7Days[i].percentage - last7Days[i - 1].percentage
    }

    return last7Days
  }, [tasks])

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.status === 'DONE').length
    const totalTasks = tasks.length
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    return { completed: completedTasks, total: totalTasks, percentage }
  }, [tasks])

  // Find the highest percentage for highlighting
  const highestPercentage = useMemo(() => {
    return Math.max(...progressData.map((item) => item.percentage))
  }, [progressData])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
          <p className="text-white font-semibold">{data.dayName}</p>
          <p className="text-blue-400">{data.percentage}% Complete</p>
          <p className="text-gray-400 text-sm">
            {data.tasksCompleted}/{data.totalTasks} tasks
          </p>
          {data.change !== 0 && (
            <p className={`text-xs ${data.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.change > 0 ? '+' : ''}
              {data.change}% from previous day
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div
      className="w-full rounded-lg p-1 px-2"
      style={{
        fontFamily: '"Exo", sans-serif',
        backgroundColor: Colors.darkGreen,
        color: 'white'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <p className="text-xl font-bold" style={{ color: Colors.primary, fontFamily: 'Skyer' }}>
            Task Progress
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{overallProgress.percentage}%</div>
          <div className="text-sm text-gray-300">
            {overallProgress.completed}/{overallProgress.total} tasks completed
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-64 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={progressData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="dayName"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]} barSize={40}>
              {progressData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.percentage === highestPercentage ? '#F97316' : '#3B82F6'}
                  opacity={entry.percentage === highestPercentage ? 1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Change Indicators */}
      <div className="grid grid-cols-7 gap-2 mb-1">
        {progressData.map((item, index) => (
          <div key={index} className="text-center">
            <div
              className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold ${
                item.change === 0
                  ? 'bg-gray-600 text-gray-300'
                  : item.change > 0
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
              }`}
            >
              {item.change > 0 ? '+' : ''}
              {item.change}%
            </div>
          </div>
        ))}
      </div>

      {/* Task Counts */}
      {/* <div className="grid grid-cols-7 gap-2 mb-2 text-xs text-gray-400">
        {progressData.map((item, index) => (
          <div key={index} className="text-center">
            {item.tasksCompleted}/{item.totalTasks}
          </div>
        ))}
      </div> */}

      {/* Dates */}
      {/* <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-1">
        {progressData.map((item, index) => (
          <div key={index} className="text-center">
            {item.date.getDate()}/{item.date.getMonth() + 1}
          </div>
        ))}
      </div> */}

      {/* Summary stats */}
      {/* <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-xl font-bold text-green-400">
            {tasks.filter((t) => t.status === 'DONE').length}
          </div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-xl font-bold text-blue-400">
            {tasks.filter((t) => t.status === 'IN_PROGRESS').length}
          </div>
          <div className="text-xs text-gray-400">In Progress</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-xl font-bold text-orange-400">
            {tasks.filter((t) => t.status === 'NOT_STARTED').length}
          </div>
          <div className="text-xs text-gray-400">Pending</div>
        </div>
      </div> */}
    </div>
  )
}
