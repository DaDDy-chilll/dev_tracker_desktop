import { Colors } from '@renderer/constants/Colors'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { JSX } from 'react'
import {
  ProjectLists,
  ProjectStatusChart,
  ProjectTasksChart,
  TaskProgress,
  TaskTimeline
} from './components/project'
import { ProjectsTasksTable } from './components/project/task-table/ProjectsTasksTable'

const Project = (): JSX.Element => {
  const { dockType } = useFullScreenState()

  if (dockType !== 'kanban') return <></>

  return (
    <>
      <div
        className="w-full h-[96.3vh] flex flex-col relative gap-2"
        style={{ paddingInline: 5, paddingBlock: 10 }}
      >
        <div className="w-full h-80 rounded-md flex flex-row gap-2 justify-between">
          <TaskProgress />
          <TaskTimeline />
          <ProjectTasksChart />
          <ProjectStatusChart />
        </div>
        <div className="w-full h-28 rounded-md" style={{ backgroundColor: Colors.darkGreen }}>
          <ProjectLists />
        </div>
        <div
          className="w-full h-[70%] rounded-md overflow-y-auto"
          style={{ backgroundColor: Colors.darkGreen }}
        >
          <ProjectsTasksTable />
        </div>
      </div>
    </>
  )
}

export default Project
