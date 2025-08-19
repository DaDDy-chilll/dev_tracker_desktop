import { CheckCircleFilled, ClockCircleFilled, CodeFilled, SyncOutlined } from '@ant-design/icons'
import { Colors } from '@renderer/constants/Colors'
import { Select, Tag } from 'antd'
import { JSX } from 'react'
import { TaskStatus, useUpdateTask } from '@renderer/features/full-screen/services'

const { Option } = Select

const statusOptions = [
  {
    value: TaskStatus.NOT_STARTED,
    label: 'Not Started',
    icon: <ClockCircleFilled />,
    color: 'default'
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: 'In Progress',
    icon: <SyncOutlined spin />,
    color: 'processing'
  },
  {
    value: TaskStatus.IN_REVIEW,
    label: 'In Review',
    icon: <CodeFilled />,
    color: 'warning'
  },
  {
    value: TaskStatus.IN_TEST,
    label: 'In Test',
    icon: <CodeFilled />,
    color: 'processing'
  },
  {
    value: TaskStatus.DONE,
    label: 'Done',
    icon: <CheckCircleFilled />,
    color: 'success'
  }
]

export const StatusComponent = ({
  status,
  id
}: {
  status: string
  id: number | undefined
}): JSX.Element => {
  const { mutateAsync: updateTask } = useUpdateTask()
  const currentStatus = statusOptions.find((option) => option.value === status) || statusOptions[0]

  const handleStatusChange = async (newStatus: string): Promise<void> => {
    if (id && newStatus !== status) {
      try {
        await updateTask({
          id,
          status: newStatus as TaskStatus
        })
      } catch (error) {
        console.error('Failed to update task status:', error)
      }
    }
  }

  return (
    <Select
      value={currentStatus.value}
      onChange={handleStatusChange}
      style={{ width: 150 }}
      bordered={false}
      dropdownStyle={{ backgroundColor: Colors.darkGreen }}
    >
      {statusOptions.map((option) => (
        <Option key={option.value} value={option.value}>
          <Tag
            icon={option.icon}
            color={option.color}
            style={{
              marginRight: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: Colors.light,
              border: `1px solid ${Colors.muted}`,
              background: 'transparent'
            }}
          >
            {option.label}
          </Tag>
        </Option>
      ))}
    </Select>
  )
}
