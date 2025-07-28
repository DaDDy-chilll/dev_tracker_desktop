import { Colors } from '@renderer/constants/Colors'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { JSX } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

// Sample data for the yearly income vs expense report
const yearlyData = [
  { month: 'Jan', income: 24000, expense: 13000 },
  { month: 'Feb', income: 26000, expense: 16000 },
  { month: 'Mar', income: 19000, expense: 14000 },
  { month: 'Apr', income: 24600, expense: 13290 }, // Reference month
  { month: 'May', income: 18000, expense: 15000 },
  { month: 'Jun', income: 22000, expense: 17000 },
  { month: 'Jul', income: 25000, expense: 19000 }
]

// Colors for the lines
const incomeColor = Colors.primary // Blue color for Income
const expenseColor = Colors.accent3 // Orange color for Expense

export const IncomeVsExpenseYearlyReport = (): JSX.Element => {
  const { isViewPrice } = useFullScreenState()
  // Reference month (April in this case)
  const referenceMonth = 'Apr'

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
          Income VS Expense
        </p>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={yearlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={incomeColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={incomeColor} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={expenseColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={expenseColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af' }}
            tickFormatter={(value) => `${value / 1000}k`}
            domain={['dataMin - 5000', 'dataMax + 5000']}
          />

          {/* Reference line for April */}
          <ReferenceLine
            x={referenceMonth}
            stroke="#cbd5e1"
            strokeDasharray="3 3"
            label={{
              position: 'top',
              value: '',
              fill: '#9ca3af',
              fontSize: 12
            }}
          />

          <Tooltip
            formatter={(value, name) => [
              `${isViewPrice ? '********' : `${name === 'income' ? 'Income' : 'Expense'}: ${value}$`}`,
              undefined
            ]}
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: 'none'
            }}
            itemStyle={{ padding: '2px 0' }}
            wrapperStyle={{ zIndex: 100 }}
          />

          <Line
            type="monotone"
            dataKey="income"
            name="income"
            stroke={incomeColor}
            strokeWidth={3}
            dot={{ r: 4, fill: incomeColor, stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: incomeColor, stroke: '#fff', strokeWidth: 2 }}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />

          <Line
            type="monotone"
            dataKey="expense"
            name="expense"
            stroke={expenseColor}
            strokeWidth={3}
            dot={{ r: 4, fill: expenseColor, stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: expenseColor, stroke: '#fff', strokeWidth: 2 }}
            fillOpacity={1}
            fill="url(#colorExpense)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend with values */}
      <div className="flex justify-center gap-8 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: incomeColor }}></div>
          <span className="text-sm font-medium text-white">
            Income: {isViewPrice ? '********' : '24,600$'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: expenseColor }}></div>
          <span className="text-sm font-medium text-white">
            Expense: {isViewPrice ? '********' : '13,290$'}
          </span>
        </div>
      </div>
    </div>
  )
}
