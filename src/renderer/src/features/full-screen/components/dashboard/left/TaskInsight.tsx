import { Colors } from '@renderer/constants/Colors'
import clsx from 'clsx'
import { JSX } from 'react'
export const TaskInsight = (): JSX.Element => {
  return (
    <div
      className={clsx('w-full h-fit', 'rounded-md')}
      style={{
        backgroundColor: Colors.darkGreen,
        padding: 10,
        fontFamily: '"Exo", sans-serif'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBlock: 10 }}>
        <div className="flex text-2xl justify-between items-center gap-2 w-full">
          <h1 style={{ color: Colors.primary, fontWeight: 600, fontFamily: 'Skyer' }}>
            Task Insights
          </h1>

          <div className="flex items-center gap-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 10L6 6L9 9L14 4"
                stroke="#4ADE80"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 4H14V8"
                stroke="#4ADE80"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#4ADE80] text-sm">+19.24</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-lg flex flex-row gap-4  ">
        {/* Time Spent & Tasks */}
        <div className="flex flex-col justify-start items-start">
          <div>
            <p className="text-gray-500 text-sm">Time Spent</p>
            <div className="flex items-center gap-2">
              <span className="text-white text-lg font-bold">9h</span>
              <span
                className="bg-indigo-900 text-indigo-300 text-xs  rounded"
                style={{ paddingInline: 10 }}
              >
                78%
              </span>
            </div>
          </div>

          <div className="flex-1" style={{ marginTop: 10 }}>
            <p className="text-gray-500 text-sm mb-1">Tasks</p>
            <div className="flex items-center gap-2">
              <span className="text-white text-lg font-bold">10</span>
              <span
                className="bg-indigo-900 text-indigo-300 text-xs rounded"
                style={{ paddingInline: 10 }}
              >
                68%
              </span>
            </div>
          </div>

          {/* Status Legend */}
          <div className=" flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
              <span className="text-white text-base">Backlogs</span>
              <span className="text-gray-400 ml-1 text-xs" style={{ color: Colors.primary }}>
                3
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-400"></div>
              <span className="text-white text-base">Progress</span>
              <span className="text-gray-400 ml-1 text-xs" style={{ color: Colors.primary }}>
                2
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-white text-base">Completed</span>
              <span className="text-gray-400 ml-1 text-xs" style={{ color: Colors.primary }}>
                5
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div
          className="w-full flex items-end justify-between "
          style={{ padding: 5, paddingTop: 40 }}
        >
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              {/* Bar Chart - Each day has stacked bars with different colors */}
              <div className="relative w-3 flex flex-col gap-2 items-center">
                {/* Different height bars for each day */}
                <div
                  className="w-1 bg-pink-400 rounded-full"
                  style={{ height: `${[20, 30, 60, 40, 25, 15, 35][index]}px` }}
                ></div>
                <div
                  className="w-1 bg-green-400 rounded-full"
                  style={{ height: `${[20, 30, 60, 40, 25, 15, 35][index]}px` }}
                ></div>
                <div
                  className="w-1 bg-indigo-400 rounded-full"
                  style={{ height: `${[20, 30, 60, 40, 25, 15, 35][index]}px` }}
                ></div>
                {index === 2 && (
                  <div
                    className="absolute -top-6  text-xs  rounded"
                    style={{
                      paddingInline: 5,
                      paddingBlock: 2,
                      color: Colors.secondary,
                      backgroundColor: Colors.primary
                    }}
                  >
                    Today
                  </div>
                )}
              </div>
              <span className="text-gray-400 text-xs">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
