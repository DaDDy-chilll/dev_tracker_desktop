import { JSX, useState, useMemo, CSSProperties, useEffect } from 'react'
import { ColumnDef, Row, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// DnD imports
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Colors } from '@renderer/constants/Colors'
import {
  ProjectStatus,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  useGetTasks
} from '@renderer/features/full-screen/services'
import { DatePicker } from 'antd'
import { CalendarRange } from 'lucide-react'
import { differenceInDays, differenceInHours, isBefore } from 'date-fns'
import dayjs, { Dayjs } from 'dayjs'
const { RangePicker } = DatePicker
// Task type definition
type Task = {
  id?: number
  name: string
  due_time: Date
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  project_id?: number
  created_at?: Date
  updated_at?: Date
  progress?: number
  branch_name: string
  start_date?: Date
  end_date?: Date
  project?: Project
  activities?: Activity[]
}

type Project = {
  id: number
  name: string
  image_id: number | null
  image: {
    id: number
    filename: string
    mimetype: string
    url: string
    created_at: string
    updated_at: string
  }
  status: ProjectStatus
  color?: string
  isNew?: boolean
  task_count?: number | string
  member_count?: number | string
  created_at?: string
  project_file_url?: string
}

type Activity = {
  id: number
  task_id: number
  task: Task
  start_time: Date
  end_time?: Date
  duration?: number
  percentage?: number
  status: TaskStatus
  notes?: string
  created_at: Date
  updated_at: Date
  created_by?: string
}

// Drag handle cell component
const RowDragHandleCell = (): JSX.Element => {
  return (
    <div className="cursor-grab active:cursor-grabbing p-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-400"
      >
        <circle cx="9" cy="5" r="1" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="19" r="1" />
      </svg>
    </div>
  )
}

// Status badge component
const StatusBadge = ({ status }: { status: string }): JSX.Element => {
  let bgColor = 'bg-gray-100 text-gray-800'

  if (status === 'Completed') {
    bgColor = 'bg-green-100 text-green-800'
  } else if (status === 'In Progress') {
    bgColor = 'bg-blue-100 text-blue-800'
  } else if (status === 'To Do') {
    bgColor = 'bg-yellow-100 text-yellow-800'
  }

  return (
    <span
      style={{ paddingBlock: 5, paddingInline: 10 }}
      className={`rounded-full text-xs font-medium ${bgColor}`}
    >
      {status}
    </span>
  )
}

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }): JSX.Element => {
  let bgColor = 'bg-gray-100 text-gray-800'
  if (priority === TaskPriority.HIGH) {
    bgColor = 'bg-red-100 text-red-800'
  } else if (priority === TaskPriority.MEDIUM) {
    bgColor = 'bg-orange-100 text-orange-800'
  } else if (priority === TaskPriority.LOW) {
    bgColor = 'bg-green-100 text-green-800'
  } else if (priority === TaskPriority.URGENT) {
    bgColor = 'bg-red-300 text-red-800'
  }

  return (
    <span
      style={{ paddingBlock: 5, paddingInline: 10 }}
      className={` rounded-full text-xs font-semibold ${bgColor}`}
    >
      {priority}
    </span>
  )
}

// Draggable row component
const DraggableRow = ({ row }: { row: Row<Task> }): JSX.Element => {
  const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({
    id: row.original.id
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    backgroundColor: isDragging ? '#5faa61' : undefined
  }

  return (
    <tr
      ref={setNodeRef}
      style={{ ...style, height: 50 }} // Set a fixed row height
      className="border-b border-gray-700 hover:bg-[#6eb3a1]"
      {...attributes}
    >
      {row.getVisibleCells().map((cell) => {
        // Apply listeners only to the drag handle cell
        if (cell.column.id === 'drag-handle') {
          return (
            <td key={cell.id} className="px-4 py-3 text-sm text-gray-700" {...listeners}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          )
        }
        return (
          <td key={cell.id} className="px-4 py-3 text-sm text-gray-700">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        )
      })}
    </tr>
  )
}

interface DateRange {
  startDate: Date
  endDate: Date
}

export const TasksTable = (): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null)
  const { data: tasksResponse = { data: [] }, refetch } = useGetTasks({
    start_date: dateRange?.[0]?.toDate(),
    end_date: dateRange?.[1]?.toDate()
  })
  useEffect(() => {
    setTasks(tasksResponse.data || [])
  }, [tasksResponse])

  useEffect(() => {
    if (dateRange) {
      refetch()
    }
  }, [dateRange, refetch])

  // Define columns
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: 'project',
        header: 'Project',
        cell: (info) => {
          const project = info.getValue() as Project
          return (
            <span className="font-medium" style={{ fontFamily: 'Skyer', color: Colors.light }}>
              {project?.name || 'No Project'}
            </span>
          )
        }
      },
      {
        accessorKey: 'name',
        header: 'Task',
        cell: (info) => <span className="text-white">{info.getValue() as string}</span>
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: (info) => (
          <div style={{ textAlign: 'start' }}>
            <PriorityBadge priority={info.getValue() as string} />
          </div>
        )
      },
      {
        id: 'drag-handle',
        header: '',
        cell: () => <RowDragHandleCell />,
        size: 70
      },
      {
        accessorKey: 'end_date',
        header: 'Time Left',
        cell: (info) => {
          const endDate = new Date(info.getValue() as string)
          const now = new Date()

          let display = ''
          let color = Colors.primary

          if (isBefore(endDate, now)) {
            display = 'Expired'
            color = Colors.expired
          } else {
            const days = differenceInDays(endDate, now)
            const hours = differenceInHours(endDate, now) % 24

            if (days > 3) {
              color = Colors.primary
            } else if (days > 1) {
              color = Colors.warning
            } else {
              color = Colors.error
            }

            display = days > 0 ? `${days}d ${hours}h` : `${hours}h`
          }

          return <div style={{ color, textAlign: 'start' }}>{display}</div>
        }
      },
      {
        accessorKey: 'activities',
        header: 'Time Spent',
        cell: (info) => {
          const activities = info.getValue() as Activity[]
          return <div style={{ color: Colors.light, textAlign: 'center' }}>{activities.length}</div>
        }
      },
      {
        accessorKey: 'status',
        header: 'Progress',
        cell: (info) => (
          <div style={{ textAlign: 'end', marginInline: 10 }}>
            <StatusBadge status={info.getValue() as string} />
          </div>
        )
      }
      // {
      //   id: 'actions',
      //   header: '',
      //   cell: () => (
      //     <div className="flex gap-2 justify-end">
      //       <button className="text-gray-500 hover:text-gray-700">
      //         <svg
      //           xmlns="http://www.w3.org/2000/svg"
      //           width="16"
      //           height="16"
      //           viewBox="0 0 24 24"
      //           fill="none"
      //           stroke="currentColor"
      //           strokeWidth="2"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         >
      //           <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      //           <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      //         </svg>
      //       </button>
      //       <button className="text-gray-500 hover:text-red-600">
      //         <svg
      //           xmlns="http://www.w3.org/2000/svg"
      //           width="16"
      //           height="16"
      //           viewBox="0 0 24 24"
      //           fill="none"
      //           stroke="currentColor"
      //           strokeWidth="2"
      //           strokeLinecap="round"
      //           strokeLinejoin="round"
      //         >
      //           <path d="M3 6h18" />
      //           <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      //           <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      //           <line x1="10" y1="11" x2="10" y2="17" />
      //           <line x1="14" y1="11" x2="14" y2="17" />
      //         </svg>
      //       </button>
      //     </div>
      //   )
      // }
    ],
    []
  )

  const taskIds = useMemo<UniqueIdentifier[]>(
    () => tasks.map(({ id }) => id).filter((id): id is number => id !== undefined),
    [tasks]
  )

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString()
  })

  // Handle drag end event
  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = taskIds.indexOf(active.id)
        const newIndex = taskIds.indexOf(over.id)
        return arrayMove(tasks, oldIndex, newIndex)
      })
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Lower the activation constraint for better drag detection
      activationConstraint: {
        distance: 5 // Start dragging after moving 5px instead of the default
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Small delay for touch
        tolerance: 5 // Allow small movement before activating
      }
    }),
    useSensor(KeyboardSensor, {})
  )

  return (
    <div
      className="rounded-lg h-[37vh] w-full"
      style={{
        backgroundColor: Colors.darkGreen,
        padding: 20,
        fontFamily: '"Exo", sans-serif'
      }}
    >
      <div className="flex justify-between items-center " style={{ marginBottom: 10 }}>
        <p
          className="text-xl font-bold"
          style={{ color: Colors.primaryForeground, fontFamily: 'Skyer' }}
        >
          All Tasks
        </p>
        <div className="flex gap-2">
          <RangePicker
            picker="month"
            value={dateRange}
            onChange={(value) => {
              if (!value) {
                setDateRange(null)
                // Reset to show all tasks or handle empty state
                refetch()
              } else {
                setDateRange([dayjs(value[0]), dayjs(value[1])])
              }
            }}
            suffixIcon={
              <CalendarRange size={20} strokeWidth={1} style={{ color: Colors.primary }} />
            }
            styles={{
              root: {
                backgroundColor: Colors.darkGreen,
                color: Colors.primary,
                fill: Colors.primary
              }
            }}
          />
          <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Task
          </button>
        </div>
      </div>

      <div className="relative" style={{ height: '28vh' }}>
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <table className="min-w-full table-fixed">
            <thead style={{ backgroundColor: Colors.buttonGhostForeground }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-700 ">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-end text-base font-medium text-white uppercase tracking-wider"
                      style={{ paddingBlock: 8, paddingInline: 35 }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          </table>
          <div className="overflow-y-auto" style={{ height: '30vh', width: '100%' }}>
            <table className="min-w-full table-fixed">
              <tbody>
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </div>
        </DndContext>
      </div>
    </div>
  )
}
