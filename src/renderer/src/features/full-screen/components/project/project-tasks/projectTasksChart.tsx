/* eslint-disable @typescript-eslint/no-explicit-any */
import { Colors } from '@renderer/constants/Colors'
import { useGetAllProjectStatus } from '@renderer/features/full-screen/services'
import { RectangleEllipsis } from 'lucide-react'
import { JSX } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface ProjectData {
  name: string
  count: number
  color: string
}

interface ProjectData {
  name: string
  count: number
  color: string
}

export const ProjectTasksChart = (): JSX.Element => {
  const { data, isLoading } = useGetAllProjectStatus()

  const projects: ProjectData[] = data?.data
    ? data.data.map((project) => ({
        name: project.name,
        count: project._count.tasks,
        color: project.color
      }))
    : []

  // Calculate total tasks for percentage
  const totalTasks = projects.reduce((sum, project) => sum + project.count, 0)

  // Format data for the pie chart with percentage
  const pieData = projects.map((project) => ({
    ...project,
    percentage: ((project.count / totalTasks) * 100).toFixed(1) + '%'
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any): JSX.Element => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`flex flex-row items-center gap-2 bg-gray-900 p-2 rounded-md`}>
          <div className="w-3 h-3 rounded-xs" style={{ backgroundColor: data.fill }} />
          <span className="text-sm block text-gray-400">{data.name}</span>
          <span className="text-sm font-bold text-white">{data.count}</span>
        </div>
      )
    }
    return <></>
  }

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="w-full rounded-md shadow-sm"
        style={{ padding: 5, fontFamily: '"Exo", sans-serif', backgroundColor: Colors.darkGreen }}
      >
        <div
          className="flex items-center justify-between"
          style={{ paddingInline: 10, marginTop: 5 }}
        >
          <div className="flex items-center">
            <p className="text-xl font-bold" style={{ color: Colors.primary, fontFamily: 'Skyer' }}>
              Project Tasks
            </p>
          </div>
          <div className="ml-auto">
            <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <RectangleEllipsis size={26} color={Colors.primary} strokeWidth={1.7} />
            </button>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            height: 260,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <p style={{ color: Colors.light }}>Loading...</p>
        </div>
      </div>
    )
  }

  // Show empty state if no data
  if (!projects.length) {
    return (
      <div
        className="w-full rounded-md shadow-sm"
        style={{ padding: 5, fontFamily: '"Exo", sans-serif', backgroundColor: Colors.darkGreen }}
      >
        <div
          className="flex items-center justify-between"
          style={{ paddingInline: 10, marginTop: 5 }}
        >
          <div className="flex items-center">
            <p className="text-xl font-bold" style={{ color: Colors.primary, fontFamily: 'Skyer' }}>
              Project Tasks
            </p>
          </div>
          <div className="ml-auto">
            <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <RectangleEllipsis size={26} color={Colors.primary} strokeWidth={1.7} />
            </button>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            height: 260,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <p style={{ color: Colors.light }}>No project data available</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full rounded-md shadow-sm"
      style={{ padding: 5, fontFamily: '"Exo", sans-serif', backgroundColor: Colors.darkGreen }}
    >
      <div
        className="flex items-center justify-between"
        style={{ paddingInline: 10, marginTop: 5 }}
      >
        <div className="flex items-center">
          <p className="text-xl font-bold" style={{ color: Colors.primary, fontFamily: 'Skyer' }}>
            Project Tasks
          </p>
        </div>
        <div className="ml-auto">
          <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <RectangleEllipsis size={26} color={Colors.primary} strokeWidth={1.7} />
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`}
              innerRadius="60%"
              outerRadius="90%"
              fill="#8884d8"
              dataKey="count"
              paddingAngle={3}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color}  />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: Colors.light, fontSize: 12 }}>{value}</span>
              )}
              verticalAlign="top"
              align="right"
              layout="vertical"
              overflow="visible"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
