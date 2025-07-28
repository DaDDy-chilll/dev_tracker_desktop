import { Colors } from '@renderer/constants/Colors'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { JSX } from 'react'
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

// Sample data for the weekly report
const weeklyData = [
  { day: 'Mon', income: 18000, expense: 25000 },
  { day: 'Tue', income: 30000, expense: 39000 },
  { day: 'Wed', income: 43000, expense: 55000 },
  { day: 'Thu', income: 36000, expense: 46000 }, // Highlighted day
  { day: 'Fri', income: 17000, expense: 20000 },
  { day: 'Sat', income: 42000, expense: 54000 },
  { day: 'Sun', income: 31000, expense: 40000 }
]

// Colors for the bars
const incomeColor = Colors.primary // Pink/magenta color for Income
const expenseColor = Colors.secondary // Purple/indigo color for Expense

export const IncomeVsExpenseWeeklyReport = (): JSX.Element => {
  // Find the highlighted day (Thursday in this case)
  const { isViewPrice } = useFullScreenState()
  const highlightedDay = 'Thu'

  return (
    <div
      className="w-full rounded-lg"
      style={{ backgroundColor: Colors.darkGreen, padding: 10, fontFamily: '"Exo", sans-serif' }}
    >
      <div className="flex justify-between items-center mb-6">
        <p
          className="text-xl font-semibold "
          style={{ color: Colors.primary, fontFamily: 'Skyer' }}
        >
          Weekly Report
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: incomeColor }}></div>
            <span className="text-sm text-white">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: expenseColor }}></div>
            <span className="text-sm text-white">Expense</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: Colors.light }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: Colors.light }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => [isViewPrice ? '********' : `${value}`, undefined]}
            labelFormatter={(label) => `Day: ${label}`}
            contentStyle={{
              backgroundColor: Colors.accent1,
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          />

          {/* Income bars */}
          <Bar dataKey="income" radius={[10, 10, 10, 10]} maxBarSize={20}>
            {weeklyData.map((entry, index) => (
              <Cell
                key={`income-${index}`}
                fill={incomeColor}
                fillOpacity={entry.day === highlightedDay ? 1 : 0.8}
              />
            ))}
          </Bar>

          {/* Expense bars */}
          <Bar dataKey="expense" radius={[10, 10, 10, 10]} maxBarSize={20}>
            {weeklyData.map((entry, index) => (
              <Cell
                key={`expense-${index}`}
                fill={expenseColor}
                fillOpacity={entry.day === highlightedDay ? 1 : 0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Highlight indicator dot at bottom */}
      {/* <div className="flex justify-center">
        <div
          className="w-2 h-2 rounded-full bg-blue-500"
          style={{ backgroundColor: '#cbd5e1' }}
        ></div>
      </div> */}
    </div>
  )
}
