import { JSX } from 'react'
import { Colors } from '@renderer/constants/Colors'
import clsx from 'clsx'
import { MoreVertical, TrendingDown } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

type Project = {
  name: string
  value: number
  color: string
}

export const ProjectOverview = (): JSX.Element => {
  // Sample data - this would come from props or state in a real app
  const projects: Project[] = [
    { name: 'Over9k', value: 44, color: '#b910a2' },
    { name: 'MagnumShop', value: 24, color: '#10B981' },
    { name: 'Doctor+', value: 18, color: '#E74C3C' },
    { name: 'AfterMidnight', value: 14, color: '#3B82F6' }
  ]

  const projectCount = projects.length
  const trend = -5

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
            Projects worked
          </h1>
          <div
            className="rounded-md flex items-center gap-2"
            style={{
              backgroundColor: '#3A0A0A',
              color: '#E74C3C',
              fontSize: '0.9rem',
              paddingInline: 10,
              paddingBlock: 4
            }}
          >
            <span>{trend}%</span>
            <TrendingDown size={16} />
          </div>
        </div>

        <button className="text-gray-400">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Chart and Legend */}
      <div className="flex items-center justify-between">
        {/* Donut Chart */}
        <div className="relative" style={{ width: 200, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projects}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {projects.map((project, index) => (
                  <Cell key={`cell-${index}`} fill={project.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-4xl font-bold" style={{ color: Colors.primary }}>
              {projectCount}
            </div>
            <div className="text-sm text-white">Projects</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 ml-4">
          {projects.map((project, index) => (
            <div key={index} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                ></div>
                <span className="text-white">{project.name}</span>
              </div>
              <span className="text-white font-bold">{project.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
