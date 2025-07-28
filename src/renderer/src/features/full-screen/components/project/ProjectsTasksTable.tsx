import { Colors } from '@renderer/constants/Colors'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { formatDate } from 'date-fns'
import { CalendarFold, Flag, Plus } from 'lucide-react'
import { JSX, useEffect, useMemo, useState } from 'react'
import { ProgressComponent } from './ProgressComponent'
import { StatusComponent } from './StatusComponent'
import { TaskModel } from './TaskModel'
import { Task, useGetTasks } from '../../services'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { format, compareDesc } from 'date-fns'
import { ProjectTableLoading } from './ProjectLoading'

export const ProjectsTasksTable = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const { selectedProjectId } = useFullScreenState()
  const { data, isLoading } = useGetTasks(selectedProjectId)

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

  const columnHelper = createColumnHelper<Task>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => <div style={{ padding: 10 }}>{info.getValue()}</div>
      }),
      columnHelper.accessor('duration', {
        header: 'Duration',
        cell: (info) => (
          <div style={{ padding: 10 }}>
            <span
              style={{
                backgroundColor: Colors.muted,
                padding: 5,
                borderRadius: 5,
                color: Colors.light
              }}
            >
              {format(info.getValue(), 'yyyy MMMM dd')}
            </span>
          </div>
        )
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        cell: (info) => (
          <div style={{ padding: 10 }}>
            <span
              className="flex w-fit justify-center items-center gap-2"
              style={{
                border: `1px solid ${Colors.muted}`,
                padding: 5,
                borderRadius: 5
              }}
            >
              <Flag size={20} />
              <p style={{ textTransform: 'capitalize' }}>{info.getValue()}</p>
            </span>
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <div style={{ padding: 10 }}>
            <StatusComponent status={info.getValue()} id={info.row.original.id!} />
          </div>
        )
      }),
      columnHelper.accessor('progress', {
        header: 'Progress',
        cell: (info) => (
          <div style={{ padding: 10 }}>
            <ProgressComponent progress={Number(info.getValue())} />
          </div>
        )
      }),
      columnHelper.accessor('created_at', {
        header: 'Create Date',
        cell: (info) => (
          <div style={{ padding: 10 }}>
            <span className="flex flex-row items-center gap-2" style={{ color: Colors.muted }}>
              <CalendarFold size={20} />
              {formatDate(info.getValue() as Date, 'yyyy MMMM dd')}
            </span>
          </div>
        )
      })
    ],
    [columnHelper]
  )

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <>
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
                    <td key={cell.id} className="border border-gray-300 px-4 py-2">
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
