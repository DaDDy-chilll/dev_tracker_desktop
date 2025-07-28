import { Colors } from '@renderer/constants/Colors'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { JSX } from 'react'

export const FinanacalOverview = (): JSX.Element => {
  const { isViewPrice, priceToggle } = useFullScreenState()
  return (
    <div className="flex flex-col gap-3 w-[50%]" style={{ fontFamily: '"Exo", sans-serif' }}>
      <div className="grid grid-cols-2 gap-3">
        {/* Total Salary Card */}
        <div
          className="rounded-lg  p-6 flex flex-col gap-2 justify-center items-center"
          style={{ backgroundColor: Colors.darkGreen, paddingBlock: 30 }}
        >
          <p className="text-white font-bold text-xl mb-3">Total Salary</p>
          <div className="flex items-baseline">
            <span
              className="text-5xl font-bold cursor-pointer"
              style={{ fontFamily: 'Skyer', color: Colors.primary }}
              onClick={priceToggle}
            >
              {isViewPrice ? '********' : '950.000'}
            </span>
          </div>
        </div>

        {/* Remaining Balance Card */}
        <div
          className="rounded-lg  p-6 flex flex-col gap-2 justify-center items-center"
          style={{ backgroundColor: Colors.darkGreen, paddingBlock: 30 }}
        >
          <p className="text-white font-bold text-xl mb-3">Remaining Balance</p>
          <div className="flex items-baseline">
            <span
              className="text-5xl font-bold cursor-pointer"
              style={{ fontFamily: 'Skyer', color: Colors.primary }}
              onClick={priceToggle}
            >
              {isViewPrice ? '********' : '950.000'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Monthly Expenses Card */}
        <div
          className="rounded-lg  flex flex-col items-center gap-4"
          style={{ backgroundColor: Colors.darkGreen, paddingBlock: 20 }}
        >
          {/* Circular Progress */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#E1EFFF" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#FF0000"
                strokeWidth="3"
                strokeDasharray="100"
                strokeDashoffset="28" // 100 - 72 = 28 (for 72%)
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: '#FF0000' }}>
                72%
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl mb-1 text-white">Monthly Expenses</p>
            <div className="text-3xl font-bold" style={{ color: Colors.primary }}>
              {isViewPrice ? '********' : '650.000'}
            </div>
          </div>
        </div>

        {/* Savings Progress Card */}
        <div
          className="rounded-lg  flex flex-col items-center gap-4"
          style={{ backgroundColor: Colors.darkGreen, paddingBlock: 20 }}
        >
          {/* Circular Progress */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#FFF2D9" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#FFA500"
                strokeWidth="3"
                strokeDasharray="100"
                strokeDashoffset="33" // 100 - 67 = 33 (for 67%)
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: Colors.primary }}>
                67%
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white font-bold text-xl mb-1">Savings Progress</p>
            <div className="text-3xl font-bold" style={{ color: Colors.primary }}>
              {isViewPrice ? '********' : '200.000'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
