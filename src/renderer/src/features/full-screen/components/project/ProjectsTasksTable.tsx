import { Colors } from '@renderer/constants/Colors'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { message } from 'antd'
import { compareDesc } from 'date-fns'
import { Plus } from 'lucide-react'
import { JSX, useEffect, useMemo, useState } from 'react'
import { Task, useGetTasks } from '../../services'
import { ProjectTableLoading } from './ProjectLoading'
import { getTaskColumns } from './TaskColumns'
import { TaskModel } from './TaskModel'

export const ProjectsTasksTable = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const { selectedProjectId } = useFullScreenState()
  const { data, isLoading } = useGetTasks(selectedProjectId)
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'priority', desc: true },
    { id: 'due_time', desc: false }
  ])
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (data && data.data) {
      const sortedTasks = data.data.sort((a, b) => {
        // Use date-fns to parse and compare dates
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0)
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0)
        // compareDesc returns positive if first date is after second date
        return compareDesc(dateA, dateB)
      })
      setTasks(sortedTasks)
    }
  }, [data])

  const handleOpenModal = (): void => {
    setIsOpen(true)
  }


  const columns = useMemo(() => getTaskColumns(messageApi), [messageApi])
  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: sorting
    },
    onSortingChange: setSorting
  })

  return (
    <>
      {contextHolder}
      <div className="p-4" style={{ padding: 10, fontFamily: '"Exo", sans-serif' }}>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="" style={{ borderBottom: '1px solid #10b981' }}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left"
                    style={{ color: Colors.primary, padding: 10 }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <ProjectTableLoading count={3} />
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#5e5e5e44] text-white "
                  style={{ borderBottom: '1px solid #353535' }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border border-gray-300 w-fit py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr
              className="text-white hover:bg-[#5e5e5e44] cursor-pointer"
              onClick={+selectedProjectId === 0 ? undefined : handleOpenModal}
              style={{ cursor: +selectedProjectId === 0 ? 'not-allowed' : 'pointer' }}
            >
              <td colSpan={columns.length} style={{ borderBottom: '1px solid #353535' }}>
                <div className="flex items-center justify-center" style={{ padding: 10 }}>
                  <Plus size={20} />
                  Add Task
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <TaskModel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
