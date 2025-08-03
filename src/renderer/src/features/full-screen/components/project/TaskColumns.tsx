import { Colors } from '@renderer/constants/Colors'
import { getColorForPriority } from '@renderer/utils'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { CalendarFold, Flag } from 'lucide-react'
import { formatDate } from 'date-fns'
import { Task, TaskPriority } from '../../services'
import { DeleteButton } from './DeleteButton'
import { ProgressBarComponent } from './ProgressBarComponent'
import { StatusComponent } from './StatusComponent'
import { MessageInstance } from 'antd/es/message/interface'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTaskColumns = (messageApi: MessageInstance): ColumnDef<Task, any>[] => {
  const columnHelper = createColumnHelper<Task>()

  return [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <div className="w-fit" style={{ padding: 5 }}>
          {info.getValue()}
        </div>
      )
    }),
    columnHelper.accessor('due_time', {
      header: 'Duration',
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId))
        const dateB = new Date(rowB.getValue(columnId))
        return dateA.getTime() - dateB.getTime()
      },
      cell: (info) => {
        const dueDate = new Date(info.getValue())
        const now = new Date()

        const normalizedDueDate = new Date(
          dueDate.getFullYear(),
          dueDate.getMonth(),
          dueDate.getDate()
        )
        const normalizedNow = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        const diffDays = Math.floor(
          (normalizedDueDate.getTime() - normalizedNow.getTime()) / (1000 * 60 * 60 * 24)
        )

        let displayText = `Due in ${diffDays} days`
        let backgroundColor = Colors.muted
        let textColor = Colors.light

        if (diffDays === 0) {
          displayText = 'Due today'
          backgroundColor = '#f54242'
          textColor = Colors.darkGreen
        } else if (diffDays === 1) {
          displayText = 'Due tomorrow'
          backgroundColor = '#fda0a0'
          textColor = Colors.darkGreen
        } else if (diffDays < 0) {
          displayText = `${Math.abs(diffDays)} days overdue`
          backgroundColor = '#e60101'
          textColor = Colors.light
        } else if (diffDays <= 7) {
          backgroundColor = '#FEF9C3'
          textColor = Colors.darkGreen
        } else {
          backgroundColor = '#DCFCE7'
          textColor = Colors.darkGreen
        }

        return (
          <div className="w-fit" style={{ padding: 10 }}>
            <span
              style={{
                backgroundColor,
                padding: '2px 10px',
                borderRadius: 5,
                color: textColor,
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {displayText}
            </span>
          </div>
        )
      }
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      sortingFn: (rowA, rowB, columnId) => {
        const order = {
          [TaskPriority.URGENT]: 4,
          [TaskPriority.HIGH]: 3,
          [TaskPriority.MEDIUM]: 2,
          [TaskPriority.LOW]: 1
        }
        const a = order[rowA.getValue(columnId) as TaskPriority] || 0
        const b = order[rowB.getValue(columnId) as TaskPriority] || 0
        return a - b
      },
      cell: (info) => (
        <div className="w-fit" style={{ padding: 10 }}>
          <span
            className="flex w-fit justify-center items-center gap-2"
            style={{
              border: `1px solid ${Colors.muted}`,
              padding: '3px 5px',
              borderRadius: 5
            }}
          >
            <Flag size={20} color={getColorForPriority(info.getValue() as string)} />
            <p style={{ color: getColorForPriority(info.getValue() as string) }}>
              {typeof info.getValue() === 'string'
                ? info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1).toLowerCase()
                : info.getValue()}
            </p>
          </span>
        </div>
      )
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <div className="w-fit" style={{ padding: 10 }}>
          <StatusComponent
            status={info.getValue()}
            id={info.row.original.id!}
            messageApi={messageApi}
          />
        </div>
      )
    }),
    columnHelper.accessor('progress', {
      header: 'Progress',
      cell: (info) => {
        return (
          <div style={{ padding: '10px 15px' }}>
            <ProgressBarComponent progress={Number(info.getValue())} id={info.row.original.id!} />
          </div>
        )
      }
    }),
    columnHelper.accessor('created_at', {
      header: 'Create Date',
      cell: (info) => (
        <div className="w-fit" style={{ padding: 10 }}>
          <span className="flex flex-row items-center gap-2" style={{ color: Colors.muted }}>
            <CalendarFold size={20} />
            {formatDate(info.getValue() as Date, 'yyyy MMMM dd')}
          </span>
        </div>
      )
    }),
    columnHelper.accessor('id', {
      header: '',
      cell: (info) => (
        <div className="w-fit" style={{ padding: 10 }}>
          <DeleteButton id={info.row.original.id!} />
        </div>
      )
    })
  ]
}
