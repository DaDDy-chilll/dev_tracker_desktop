import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { JSX } from 'react'
import {
  TaskInsight,
  TodayTimeSpent,
  ToadyTasks,
  TodayMeeting,
  DailyActivity,
  ProjectOverview,
  TaskReminder,
  FinanacalOverview,
  IncomeVsExpenseWeeklyReport,
  ProjectChart,
  SpentOverview,
  TasksTable,
  IncomeVsExpenseYearlyReport
} from './components/dashboard'

export const Dashboard = (): JSX.Element => {
  const { dockType } = useFullScreenState()
  if (dockType !== 'dashboard') return <></>
  else
    return (
      <div className="w-full h-[96.3vh] grid grid-cols-11">
        {/* Left Section */}
        <div
          className=" h-full col-span-2 flex gap-3 flex-col"
          style={{ paddingInline: 5, paddingBlock: 10 }}
        >
          <TodayTimeSpent />
          <TaskInsight />
          <ToadyTasks />
          <TodayMeeting />
        </div>

        {/* Middle Section */}
        <div
          className="h-full col-span-7 flex gap-3 flex-col"
          style={{ paddingInline: 5, paddingBlock: 10 }}
        >
          <div className="flex gap-3 w-full justify-between">
            <FinanacalOverview />
            <IncomeVsExpenseWeeklyReport />
          </div>

          <div className="flex gap-3 w-full justify-between">
            <ProjectChart />
            <IncomeVsExpenseYearlyReport />
          </div>

          <div className="flex gap-3 w-full justify-between">
            <SpentOverview />
            <TasksTable />
          </div>
        </div>

        {/* Right Section */}
        <div
          className=" h-full col-span-2 flex gap-3 flex-col"
          style={{ paddingInline: 5, paddingBlock: 10 }}
        >
          <DailyActivity />
          <ProjectOverview />
          <TaskReminder />
        </div>
      </div>
    )
}
