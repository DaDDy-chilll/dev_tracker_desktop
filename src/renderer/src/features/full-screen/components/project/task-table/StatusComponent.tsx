/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CheckOutlined,
  ClockCircleFilled,
  HistoryOutlined,
  SyncOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { Colors } from '@renderer/constants/Colors'
import { Select, message } from 'antd'
import { JSX, useEffect } from 'react'
import { useUpdateTask } from '@renderer/features/full-screen/services'
import { TaskStatus } from '@renderer/features/full-screen/services/tasks/task.type'

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
  projectId,
  projectDir,
  category,
  branchName
}: {
  status: string
  id: number | undefined
  projectId: number | undefined
  projectDir: string | undefined
  category: string
  branchName: string
}): JSX.Element => {
  const { mutateAsync: updateTask } = useUpdateTask()
  const [messageApi] = message.useMessage()
  const currentStatus = statusOptions.find((option) => option.value === status) || statusOptions[0]

  // Set up IPC listeners for git checkout responses
  useEffect(() => {
    const handleGitSuccess = (
      _event: any,
      data: { status: string; branch: string; output: string }
    ): void => {
      messageApi.success(`Successfully switched to branch: ${data.branch}`, 3)
      console.log('Git checkout success:', data)
    }

    const handleGitError = (_event: any, error: string): void => {
      messageApi.error(`Git checkout failed: ${error}`, 5)
      console.error('Git checkout error:', error)
    }

    // Add IPC listeners
    window.electron?.ipcRenderer?.on('task-status-success', handleGitSuccess)
    window.electron?.ipcRenderer?.on('task-status-error', handleGitError)

    // Cleanup listeners on unmount
    return () => {
      window.electron?.ipcRenderer?.removeListener('task-status-success', handleGitSuccess)
      window.electron?.ipcRenderer?.removeListener('task-status-error', handleGitError)
    }
  }, [messageApi])

  const handleStatusChange = async (newStatus: string): Promise<void> => {
    console.log('category@@@@@', category)
    if (id && newStatus !== status) {
      try {
        await updateTask(
          {
            id,
            status: newStatus as TaskStatus,
            project_id: projectId,
            isUpdateStatus: true
          },
          {
            onSuccess: () => {
              if (projectDir) {
                window.api.taskStatus.changeState(newStatus, projectDir, category, branchName)
              }
            },
            onError: (error) => {
              console.log(error)
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
