import {
  CheckOutlined,
  ClockCircleFilled,
  HistoryOutlined,
  SyncOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { Colors } from '@renderer/constants/Colors'
import { Select } from 'antd'
import { JSX } from 'react'
import { useUpdateTask } from '../../services'
import { TaskStatus } from '../../services/tasks/task.type'
import type { MessageInstance } from 'antd/es/message/interface'

const statusOptions = [
  {
    value: TaskStatus.NOT_STARTED,
    label: 'Not Started',
    icon: <ClockCircleFilled size={16} style={{ color: '#6B7280' }} />,
    color: '#6B7280'
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: 'In Progress',
    icon: <SyncOutlined spin size={16} style={{ color: '#F59E0B' }} />,
    color: '#F59E0B'
  },
  {
    value: TaskStatus.IN_REVIEW,
    label: 'In Review',
    icon: <HistoryOutlined size={16} style={{ color: '#8B5CF6' }} />,
    color: '#8B5CF6'
  },
  {
    value: TaskStatus.IN_TEST,
    label: 'In Test',
    icon: <ThunderboltOutlined size={16} style={{ color: '#3B82F6' }} />,
    color: '#3B82F6'
  },
  {
    value: TaskStatus.DONE,
    label: 'Done',
    icon: <CheckOutlined size={16} style={{ color: '#10B981' }} />,
    color: '#10B981'
  }
]

export const StatusComponent = ({
  status,
  id,
  messageApi
}: {
  status: string
  id: number | undefined
  messageApi: MessageInstance
}): JSX.Element => {
  const { mutateAsync: updateTask } = useUpdateTask()
  const currentStatus = statusOptions.find((option) => option.value === status) || statusOptions[0]
  const handleStatusChange = async (newStatus: string): Promise<void> => {
    if (id && newStatus !== status) {
      try {
        await updateTask(
          {
            id,
            status: newStatus as TaskStatus
          },
          {
            onError: (error) => {
              messageApi.error(`Failed to update task status ${error}`, 3)
            }
          }
        )
      } catch (error) {
        messageApi.error(`Failed to update task status ${error}`, 3)
      }
    }
  }

  return (
    <Select
      value={currentStatus.value}
      onChange={handleStatusChange}
      style={{ width: 150, borderRadius: '6px', border: `1px solid #606161` }}
      bordered={false}
      dropdownStyle={{
        backgroundColor: Colors.darkGreen,
        border: `1px solid #10B981`,
        borderRadius: '6px',
        padding: '8px 0'
      }}
      dropdownRender={(menu) => <div style={{ padding: '4px 0' }}>{menu}</div>}
    >
      {statusOptions.map((option) => (
        <Select.Option
          key={option.value}
          value={option.value}
          style={{
            backgroundColor: 'transparent',
            margin: 0,
            padding: '4px 12px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',

              gap: '8px',
              color: Colors.light,
              padding: '4px 0'
            }}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  )
}
