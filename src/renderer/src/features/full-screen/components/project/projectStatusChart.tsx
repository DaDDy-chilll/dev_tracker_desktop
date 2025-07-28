import { Colors } from '@renderer/constants/Colors'
import { JSX } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

interface StatusData {
  month: string
  backlog: number
  done: number
  overdue: number
}

export const ProjectStatusChart = (): JSX.Element => {
  // Sample data based on the image
  const data: StatusData[] = [
    { month: 'Jan', backlog: 15, done: 70, overdue: 82 },
    { month: 'Feb', backlog: 90, done: 85, overdue: 75 },
    { month: 'Mar', backlog: 70, done: 65, overdue: 95 },
    { month: 'Apr', backlog: 35, done: 25, overdue: 65 },
    { month: 'May', backlog: 80, done: 70, overdue: 35 },
    { month: 'Jun', backlog: 90, done: 95, overdue: 30 },
    { month: 'Jul', backlog: 78, done: 75, overdue: 78 },
    { month: 'Aug', backlog: 78, done: 75, overdue: 78 },
    { month: 'Sep', backlog: 78, done: 75, overdue: 78 },
    { month: 'Oct', backlog: 78, done: 75, overdue: 78 },
    { month: 'Nov', backlog: 78, done: 75, overdue: 78 },
    { month: 'Dec', backlog: 78, done: 75, overdue: 78 }
  ]

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
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBacklog" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff8a80" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff8a80" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorOverdue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#80deea" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#80deea" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="backlog"
              name="Backlog"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorBacklog)"
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="done"
              name="Done"
              stroke="#ff8a80"
              fillOpacity={1}
              fill="url(#colorDone)"
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="overdue"
              name="Overdue"
              stroke="#80deea"
              fillOpacity={1}
              fill="url(#colorOverdue)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
