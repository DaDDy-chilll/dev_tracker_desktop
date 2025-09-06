import { Colors } from '@renderer/constants/Colors'
import { useGetProjects } from '@renderer/features/full-screen/services'
import { JSX, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

// Helper function to sanitize names for use as CSS IDs and data keys
const sanitizeName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9]/g, '')
}

export const ProjectChart = (): JSX.Element => {
  const { data: projectsResponse = { data: [] } } = useGetProjects()
  const projects = projectsResponse.data || []
  console.log('projects******', projects)

  const projectColors = useMemo(() => {
    console.log('projects', projects)
    return projects.map((project) => project.color || '#8b5cf6') // Fallback to purple if no color
  }, [projects])

  // Transform projects data to show task counts by month
  const transformProjectsData = useMemo(() => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]

    const monthlyData = months.map((month) => {
      const entry = { month }
      projects.forEach((project) => {
        // Use sanitized name as key
        entry[sanitizeName(project.name)] = 0
      })
      return entry
    })

    projects.forEach((project) => {
      const tasks = project.tasks || []
      console.log(`Project ${project.name} has ${tasks.length} tasks`)

      tasks.forEach((task) => {
        console.log('task', task)
        if (task.start_date) {
          try {
            const dueDate = new Date(task.start_date)
            const monthIndex = dueDate.getMonth()
            const monthName = months[monthIndex]

            const monthEntry = monthlyData.find((m) => m.month === monthName)
            if (monthEntry) {
              const sanitizedProjectName = sanitizeName(project.name)
              monthEntry[sanitizedProjectName] = (monthEntry[sanitizedProjectName] || 0) + 1
            }
          } catch (error) {
            console.error('Error processing task date:', task.start_date, error)
          }
        }
      })
    })

    return monthlyData
  }, [projects])

  console.log('transformProjectsData', transformProjectsData)

  // Generate gradient definitions dynamically
  const gradientDefs = useMemo(() => {
    return projects.map((project, index) => (
      <linearGradient
        key={project.id}
        id={`color${sanitizeName(project.name)}`}
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop offset="5%" stopColor={projectColors[index]} stopOpacity={0.4} />
        <stop offset="95%" stopColor={projectColors[index]} stopOpacity={0.1} />
      </linearGradient>
    ))
  }, [projects, projectColors])

  // Generate area components dynamically
  const areaComponents = useMemo(() => {
    return projects.map((project, index) => (
      <Area
        key={project.id}
        type="monotone"
        dataKey={sanitizeName(project.name)}
        name={project.name}
        stroke={projectColors[index]}
        strokeWidth={2}
        fillOpacity={1}
        fill={`url(#color${sanitizeName(project.name)})`}
        activeDot={{ r: 6, fill: projectColors[index], stroke: '#fff', strokeWidth: 2 }}
      />
    ))
  }, [projects, projectColors])

  return (
    <div
      className="w-[50%] rounded-lg h-[30vh]"
      style={{
        backgroundColor: Colors.darkGreen,
        fontFamily: '"Exo", sans-serif'
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <p
          className="text-xl font-bold"
          style={{ color: Colors.primary, fontFamily: 'Skyer', marginInline: 10 }}
        >
          My Projects
        </p>
      </div>

      <ResponsiveContainer width="100%" height="95%">
        <AreaChart data={transformProjectsData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>{gradientDefs}</defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af' }}
            // Remove fixed domain to allow dynamic values
            domain={[0, 'dataMax + 10']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: Colors.accent1,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          />

          {areaComponents}

          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => {
              return (
                <span className="text-sm text-white" style={{ marginInline: 5 }}>
                  {value}
                </span>
              )
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
