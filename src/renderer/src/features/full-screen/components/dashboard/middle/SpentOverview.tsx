import { Colors } from '@renderer/constants/Colors'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { JSX } from 'react'

// Salary and spent data
const baseSalary = 2500
const spentAmount = 1950
const remainingAmount = baseSalary - spentAmount

// Spending breakdown by category
const spendingCategories = [
  { name: 'Products', amount: 850, color: '#4C6EF5' }, // Blue
  { name: 'Expense', amount: 650, color: '#E64980' }, // Pink
  { name: 'Food', amount: 450, color: '#FFA94D' } // Orange
]

// Calculate percentage spent
const percentageSpent = Math.round((spentAmount / baseSalary) * 100)

export const SpentOverview = (): JSX.Element => {
  const { isViewPrice } = useFullScreenState()
  return (
    <div
      className="rounded-lg h-[37vh] w-[50%]"
      style={{
        backgroundColor: Colors.darkGreen,
        padding: 20,
        fontFamily: '"Exo", sans-serif'
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col justify-start items-start gap-1 mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold uppercase text-white">Spent : </span>
            <span
              className="text-2xl font-bold"
              style={{ color: Colors.primary, fontFamily: 'Skyer' }}
            >
              {isViewPrice ? '********' : `${spentAmount.toLocaleString()} MMK`}
            </span>
            {/* <span className="text-white text-sm ml-2">From ${baseSalary.toLocaleString()}</span> */}
          </div>

          {/* Remaining Amount indicator */}
          <div className="flex items-baseline gap-1">
            <span className="text-xl text-white uppercase">Remaining : </span>
            <span
              className="text-lg font-bold"
              style={{ color: Colors.accent2, fontFamily: 'Skyer' }}
            >
              {isViewPrice ? '********' : `${remainingAmount.toLocaleString()} MMK`}
            </span>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex-grow flex items-center justify-center relative">
          <div className="relative w-64 h-64">
            {/* Background Circle */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#ffffff40"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Category Arcs */}
              {spendingCategories.map((category, index) => {
                // Calculate percentages and angles
                const categoryPercentage = (category.amount / baseSalary) * 100
                const previousCategories = spendingCategories.slice(0, index)
                const previousTotal = previousCategories.reduce((sum, cat) => sum + cat.amount, 0)
                const previousPercentage = (previousTotal / baseSalary) * 100

                // Calculate stroke dash values
                const circumference = 2 * Math.PI * 45
                const dashLength = (circumference * categoryPercentage) / 100
                const dashSpace = circumference - dashLength
                const dashOffset = (circumference * (25 - previousPercentage)) / 100

                return (
                  <circle
                    key={category.name}
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={category.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${dashLength} ${dashSpace}`}
                    strokeDashoffset={dashOffset}
                    transform="rotate(-90 50 50)"
                  />
                )
              })}
            </svg>
            {/* Percentage in the middle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold" style={{ color: Colors.primary }}>
                {percentageSpent}%
              </span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex justify-between mt-4 px-4">
          {spendingCategories.map((category) => (
            <div key={category.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-white">{category.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffffff40' }}></div>
            <span className="text-white">Remaining</span>
          </div>
        </div>
      </div>
    </div>
  )
}
