import { Colors } from '@renderer/constants/Colors'
import { JSX } from 'react'
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

// Sample data for the projects chart
const projectData = [
  { month: 'Jan', japanJob: 15, shopZar: 65, ratisInventory: 50 },
  { month: 'Feb', japanJob: 60, shopZar: 90, ratisInventory: 75 },
  { month: 'Mar', japanJob: 40, shopZar: 65, ratisInventory: 60 },
  { month: 'Apr', japanJob: 30, shopZar: 35, ratisInventory: 25 },
  { month: 'May', japanJob: 55, shopZar: 85, ratisInventory: 40 },
  { month: 'Jun', japanJob: 75, shopZar: 55, ratisInventory: 65 },
  { month: 'Jul', japanJob: 75, shopZar: 75, ratisInventory: 75 },
  { month: 'Aug', japanJob: 75, shopZar: 75, ratisInventory: 75 },
  { month: 'Sep', japanJob: 75, shopZar: 75, ratisInventory: 75 },
  { month: 'Oct', japanJob: 75, shopZar: 75, ratisInventory: 75 },
  { month: 'Nov', japanJob: 75, shopZar: 75, ratisInventory: 75 },
  { month: 'Dec', japanJob: 75, shopZar: 75, ratisInventory: 75 }
]

// Colors for the areas
const japanJobColor = '#8b5cf6' // Purple color
const shopZarColor = '#38bdf8' // Light blue color
const ratisInventoryColor = '#fb7185' // Pink/red color

export const ProjectChart = (): JSX.Element => {
  return (
    <div
      className="w-[50%] rounded-lg h-[30vh]"
      style={{
        backgroundColor: Colors.darkGreen,
        paddingBlock: 10,
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
        <AreaChart data={projectData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorJapanJob" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={japanJobColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={japanJobColor} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorShopZar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={shopZarColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={shopZarColor} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorRatisInventory" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={ratisInventoryColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={ratisInventoryColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af' }}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, undefined]}
            contentStyle={{
              backgroundColor: Colors.accent1,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          />

          <Area
            type="monotone"
            dataKey="japanJob"
            name="Japan Job"
            stroke={japanJobColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorJapanJob)"
            activeDot={{ r: 6, fill: japanJobColor, stroke: '#fff', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="shopZar"
            name="Shop Zar"
            stroke={shopZarColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorShopZar)"
            activeDot={{ r: 6, fill: shopZarColor, stroke: '#fff', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="ratisInventory"
            name="Ratis Inventory"
            stroke={ratisInventoryColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRatisInventory)"
            activeDot={{ r: 6, fill: ratisInventoryColor, stroke: '#fff', strokeWidth: 2 }}
          />

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
