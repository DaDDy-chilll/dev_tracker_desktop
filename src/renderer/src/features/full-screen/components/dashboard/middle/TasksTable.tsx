import { JSX, useState, useMemo, CSSProperties } from 'react'
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

// Task type definition
type Task = {
  id: string
  project: string
  name: string
  status: string
  priority: string
  timeLeft: string
  timeSpent: string
}

// Sample data
const initialTasks: Task[] = [
  {
    id: '1',
    project: 'Abc Project',
    name: 'Design Dashboard',
    status: 'In Progress',
    priority: 'High',
    timeLeft: '2025-07-28',
    timeSpent: '2025-07-22'
  },
  {
    id: '2',
    project: 'Abc Project',
    name: 'Implement Charts',
    status: 'Completed',
    priority: 'Medium',
    timeLeft: '2025-07-22',
    timeSpent: '2025-07-22'
  },
  {
    id: '3',
    project: 'Abc Project',
    name: 'Fix Navigation',
    status: 'To Do',
    priority: 'Low',
    timeLeft: '2025-07-30',
    timeSpent: '2025-07-22'
  },
  {
    id: '4',
    project: 'Abc Project',
    name: 'User Testing',
    status: 'To Do',
    priority: 'High',
    timeLeft: '2025-08-05',
    timeSpent: '2025-08-05'
  },
  {
    id: '5',
    project: 'Abc Project',
    name: 'Deploy to Production',
    status: 'To Do',
    priority: 'High',
    timeLeft: '2025-08-10',
    timeSpent: '2025-08-10'
  },
  {
    id: '6',
    project: 'Abc Project',
    name: 'Deploy to Production',
    status: 'To Do',
    priority: 'High',
    timeLeft: '2025-08-10',
    timeSpent: '2025-08-10'
  },
  {
    id: '7',
    project: 'Abc Project',
    name: 'Deploy to Production',
    status: 'To Do',
    priority: 'High',
    timeLeft: '2025-08-10',
    timeSpent: '2025-08-10'
  },
  {
    id: '8',
    project: 'Abc Project',
    name: 'Deploy to Production',
    status: 'To Do',
    priority: 'High',
    timeLeft: '2025-08-10',
    timeSpent: '2025-08-10'
  },
  {
    id: '9',
    project: 'Abc Project',
    name: 'Deploy to Production',
    status: 'To Do',
    priority: 'High',
    timeLeft: '2025-08-10',
    timeSpent: '2025-08-10'
  },
  {
    id: '10',
    project: 'Abc Project',
    name: 'Deploy to Production',
    status: 'To Do',
    priority: 'High',
    timeLeft: '2025-08-10',
    timeSpent: '2025-08-10'
  },
  {
    id: '11',
    project: 'Abc Project',
    name: 'Deploy to Production',
    status: 'To Do',
    priority: 'High',
    timeLeft: '2025-08-10',
    timeSpent: '2025-08-10'
  }
]

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

  if (priority === 'High') {
    bgColor = 'bg-red-100 text-red-800'
  } else if (priority === 'Medium') {
    bgColor = 'bg-orange-100 text-orange-800'
  } else if (priority === 'Low') {
    bgColor = 'bg-green-100 text-green-800'
  }

  return (
    <span
      style={{ paddingBlock: 5, paddingInline: 10 }}
      className={` rounded-full text-xs font-medium ${bgColor}`}
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

export const TasksTable = (): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>(() => initialTasks)

  // Define columns
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: 'project',
        header: 'Project',
        cell: (info) => (
          <span className="font-medium" style={{ fontFamily: 'Skyer', color: Colors.light }}>
            {info.getValue() as string}
          </span>
        )
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
        accessorKey: 'timeLeft',
        header: 'Time Left',
        cell: (info) => {
          const date = new Date(info.getValue() as string)
          return (
            <div style={{ color: Colors.light, textAlign: 'start' }}>
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          )
        }
      },
      {
        accessorKey: 'timeSpent',
        header: 'Time Spent',
        cell: (info) => {
          const date = new Date(info.getValue() as string)
          return (
            <div style={{ color: Colors.light, textAlign: 'center' }}>
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          )
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

  const taskIds = useMemo<UniqueIdentifier[]>(() => tasks.map(({ id }) => id), [tasks])

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id
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
        <p className="text-xl font-bold" style={{ color: Colors.primary, fontFamily: 'Skyer' }}>
          All Tasks
        </p>
        <div className="flex gap-2">
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
