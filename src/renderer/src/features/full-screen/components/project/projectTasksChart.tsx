import { Colors } from '@renderer/constants/Colors'
import { JSX } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface MonthData {
  name: string
  color: string
}

interface ProjectData {
  name: string
  count: number
  color: string
}

interface ChartData {
  month: string
  [key: string]: string | number | ProjectData // For dynamic project properties
}

export const ProjectTasksChart = (): JSX.Element => {
  // Define months with their colors
  const months: MonthData[] = [
    { name: 'Feb', color: '#FF8A80' }, // Light Red
    { name: 'Mar', color: '#80DEEA' }, // Light Cyan
    { name: 'Apr', color: '#FFD54F' }, // Light Amber
    { name: 'May', color: '#81D4FA' }, // Light Blue
    { name: 'Jun', color: '#A5D6A7' }, // Light Green
    { name: 'Jul', color: '#B39DDB' }, // Light Purple
    { name: 'Aug', color: '#4DD0E1' }, // Cyan
    { name: 'Sep', color: '#4FC3F7' }, // Blue
    { name: 'Oct', color: '#FFF176' }, // Yellow
    { name: 'Nov', color: '#81C784' } // Green
  ]

  // Project names
  const projects = ['Project One', 'Project Two', 'Project Three']

  // Original data
  const projectData = [
    {
      name: 'Project One',
      tasks: [
        { month: 'Feb', count: 80 },
        { month: 'Mar', count: 85 },
        { month: 'Apr', count: 42 },
        { month: 'May', count: 85 },
        { month: 'Jun', count: 77 },
        { month: 'Jul', count: 95 },
        { month: 'Aug', count: 90 },
        { month: 'Sep', count: 75 },
        { month: 'Oct', count: 0 },
        { month: 'Nov', count: 0 }
      ]
    },
    {
      name: 'Project Two',
      tasks: [
        { month: 'Feb', count: 0 },
        { month: 'Mar', count: 20 },
        { month: 'Apr', count: 32 },
        { month: 'May', count: 92 },
        { month: 'Jun', count: 80 },
        { month: 'Jul', count: 25 },
        { month: 'Aug', count: 56 },
        { month: 'Sep', count: 12 },
        { month: 'Oct', count: 20 },
        { month: 'Nov', count: 88 }
      ]
    },
    {
      name: 'Project Three',
      tasks: [
        { month: 'Feb', count: 78 },
        { month: 'Mar', count: 80 },
        { month: 'Apr', count: 18 },
        { month: 'May', count: 65 },
        { month: 'Jun', count: 82 },
        { month: 'Jul', count: 0 },
        { month: 'Aug', count: 90 },
        { month: 'Sep', count: 76 },
        { month: 'Oct', count: 35 },
        { month: 'Nov', count: 12 }
      ]
    }
  ]

  // Format data for Recharts - group by month
  const data: ChartData[] = months.map((month) => {
    const monthData: ChartData = { month: month.name }

    projects.forEach((project, index) => {
      const projectInfo = projectData[index]
      const taskData = projectInfo.tasks.find((task) => task.month === month.name)

      monthData[project] = taskData?.count || 0
    })

    return monthData
  })

  return (
    <div
      className="w-full rounded-md shadow-sm"
      style={{ padding: 5, fontFamily: '"Exo", sans-serif', backgroundColor: Colors.darkGreen }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
        <div className="flex items-center">
          <p className="text-xl font-bold" style={{ color: Colors.primary, fontFamily: 'Skyer' }}>
            Project Tasks
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

      {/* Chart container */}
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#fff', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
            />
            <YAxis
              tick={{ fill: '#fff', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#333', border: 'none' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend
              formatter={(value) => <span style={{ color: '#fff', fontSize: 12 }}>{value}</span>}
            />
            {projects.map((project, index) => (
              <Bar
                key={project}
                dataKey={project}
                name={project}
                fill={months[index % months.length].color}
                barSize={15}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
