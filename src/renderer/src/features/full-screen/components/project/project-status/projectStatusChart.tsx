import { Colors } from '@renderer/constants/Colors'
import { JSX } from 'react'
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts'
import { useGetAllTaskCount } from '../../../services'
import ProjectStatusLabel, { ChartTooltip, ChartTooltipContent } from './ProjectStatusLabel'

interface StatusDatum {
  name: string
  value: number
  fill: string
}

export const ProjectStatusChart = (): JSX.Element => {
  const { data } = useGetAllTaskCount()
  const legendStyle = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px'
  } as const

  // Status mapping and colors
  const statusConfig = {
    DONE: { name: 'Done', fill: '#10B981' },
    IN_TEST: { name: 'In test', fill: '#3B82F6' },
    IN_REVIEW: { name: 'In review', fill: '#8B5CF6' },
    IN_PROGRESS: { name: 'In progress', fill: '#F59E0B' },
    NOT_STARTED: { name: 'Not started', fill: '#6B7280' }
  }

  // Transform API data to chart format
  // Transform API data to chart format with consistent ordering
  const dataChart: StatusDatum[] = (() => {
    const defaultData = [
      { name: 'Done', value: 0, fill: '#10B981' },
      { name: 'In test', value: 0, fill: '#3B82F6' },
      { name: 'In review', value: 0, fill: '#8B5CF6' },
      { name: 'In progress', value: 0, fill: '#F59E0B' },
      { name: 'Not started', value: 0, fill: '#6B7280' }
    ]

    if (!data?.success || !data.data) return defaultData

    // Create a map of status names to their values
    const statusMap = data.data.reduce(
      (acc, item) => {
        const statusName = statusConfig[item.status as keyof typeof statusConfig]?.name
        if (statusName) {
          acc[statusName] = {
            name: statusName,
            value: item._sum?.count || 0,
            fill: statusConfig[item.status as keyof typeof statusConfig]?.fill || '#cccccc'
          }
        }
        return acc
      },
      {} as Record<string, StatusDatum>
    )

    // Map over the default order and merge with actual data
    return defaultData.map((item) => statusMap[item.name] || item)
  })()

  const CustomTooltip = ({ active, payload }: any): JSX.Element => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`flex flex-row items-center gap-2 bg-gray-900 p-2 rounded-md`}>
          <div className="w-3 h-3 rounded-xs" style={{ backgroundColor: data.fill }} />
          <span className="text-sm block text-gray-400">{data.name}</span>
          <span className="text-sm font-bold text-white">{data.value}</span>
        </div>
      )
    }
    return <></>
  }

  return (
    <div
      className="w-full rounded-md shadow-sm"
      style={{ padding: 5, fontFamily: '"Exo", sans-serif', backgroundColor: Colors.darkGreen }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
        <div className="flex items-center">
          <p className="text-xl font-bold" style={{ color: Colors.primary, fontFamily: 'Skyer' }}>
            Project Status
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
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="100%"
            barSize={40}
            data={dataChart}
          >
            <RadialBar dataKey="value" radius="100%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconSize={20}
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={legendStyle}
              formatter={(value) => <span style={{ color: '#fff', fontSize: 12 }}>{value}</span>}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
