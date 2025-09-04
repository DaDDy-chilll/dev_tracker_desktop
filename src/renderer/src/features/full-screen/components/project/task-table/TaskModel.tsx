import { Colors } from '@renderer/constants/Colors'
import {
  TaskCategory,
  TaskPriority,
  TaskStatus,
  useCreateTask,
  useUpdateTask
} from '@renderer/features/full-screen/services'
import { Task } from '@renderer/features/full-screen/services/tasks/task.type'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { X } from 'lucide-react'
import { JSX, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { PulseLoader } from 'react-spinners'

const { RangePicker } = DatePicker
// Set the app element for accessibility
Modal.setAppElement('#root')

interface TaskModelProps {
  isOpen: boolean
  onClose: () => void
  data?: Task | null
  projectDir: string
}

// Custom styles for the modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: Colors.darkGreen,
    border: 'none',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    width: '24rem',
    maxWidth: '90%'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 50
  }
}

const priorityOptions = [
  { value: TaskPriority.LOW, label: 'Low' },
  { value: TaskPriority.MEDIUM, label: 'Medium' },
  { value: TaskPriority.HIGH, label: 'High' },
  { value: TaskPriority.URGENT, label: 'Urgent' }
]

const categoryOptions = [
  { value: TaskCategory.FEAUTURE, label: 'Feature' },
  { value: TaskCategory.BUG, label: 'Bug' },
  { value: TaskCategory.REFACTOR, label: 'Refactor' },
  { value: TaskCategory.TEST, label: 'Test' },
  { value: TaskCategory.ERROR, label: 'Error' }
]

export const TaskModel = ({ isOpen, onClose, data, projectDir }: TaskModelProps): JSX.Element => {
  const [taskName, setTaskName] = useState('')
  const [duration, setDuration] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.NOT_STARTED)
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM)
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.FEAUTURE)
  const [branchName, setBranchName] = useState('')
  const { mutateAsync: createTask, isPending: isCreating } = useCreateTask()
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask()
  const { selectedProjectId } = useFullScreenState()

  // Initialize form with task data if in edit mode
  useEffect(() => {
    if (data) {
      console.log('data', data)
      setTaskName(data.name)
      setDuration(data.due_time ? new Date(data.due_time).toISOString().slice(0, 16) : '')
      setStartDate(data.start_date ? new Date(data.start_date).toISOString().slice(0, 16) : '')
      setEndDate(data.end_date ? new Date(data.end_date).toISOString().slice(0, 16) : '')
      setStatus(data.status as TaskStatus)
      setPriority(data.priority as TaskPriority)
      setCategory((data.category as TaskCategory) || TaskCategory.FEAUTURE)
      setBranchName(data.branch_name || '')
    } else {
      // Reset form for new task
      setTaskName('')
      setDuration('')
      setStartDate('')
      setEndDate('')
      setStatus(TaskStatus.NOT_STARTED)
      setPriority(TaskPriority.MEDIUM)
      setCategory(TaskCategory.FEAUTURE)
      setBranchName('')
    }
  }, [data])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    try {
      const taskData = {
        name: taskName,
        due_time: new Date(duration),
        status,
        priority,
        category,
        project_id: selectedProjectId.id,
        branch_name: branchName,
        start_date: new Date(startDate),
        end_date: new Date(endDate)
      }
      console.log('taskData', taskData)
      if (data?.id) {
        // Update existing task
        await updateTask({
          id: data.id,
          ...taskData
        })
      } else {
        // Create new task
        await createTask(taskData, {
          onSuccess: () => {
            window.api.taskStatus.changeState(status, projectDir, category, branchName)
          }
        })
      }

      // Reset form and close modal
      resetForm()
      onClose()
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  // Reset form when modal is closed
  const resetForm = (): void => {
    setTaskName('')
    setDuration('')
    setStatus(TaskStatus.NOT_STARTED)
    setPriority(TaskPriority.MEDIUM)
    setCategory(TaskCategory.FEAUTURE)
  }

  const handleAfterClose = (): void => {
    resetForm()
  }

  const isEditMode = Boolean(data?.id)
  const isSubmitting = isCreating || isUpdating

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={isEditMode ? 'Edit Task' : 'Create New Task'}
      onAfterClose={handleAfterClose}
    >
      <div className="text-white" style={{ fontFamily: 'Exo, sans-serif' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 10 }}>
          <p className="text-xl font-bold" style={{ fontFamily: 'Skyer', color: Colors.primary }}>
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </p>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-white focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Task Name */}
          <div style={{ marginBottom: 20, borderBottom: '1px solid #cccccc88' }}>
            <label
              htmlFor="task-name"
              className="block text-sm font-medium text-gray-300"
              style={{ marginBottom: 5 }}
            >
              Task Name
            </label>
            <input
              type="text"
              id="task-name"
              value={taskName}
              onChange={(e): void => setTaskName(e.target.value)}
              className="w-full rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
              style={{ color: Colors.light, borderRadius: 5, paddingInline: 5, paddingBlock: 10 }}
              required
            />
          </div>

          {!data?.id && (
            <div style={{ marginBottom: 20, borderBottom: '1px solid #cccccc88' }}>
              <label
                htmlFor="branch-name"
                className="block text-sm font-medium text-gray-300"
                style={{ marginBottom: 5 }}
              >
                Branch Name
              </label>
              <input
                type="text"
                id="branch-name"
                value={branchName}
                onChange={(e): void => setBranchName(e.target.value)}
                className="w-full rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
                style={{ color: Colors.light, borderRadius: 5, paddingInline: 5, paddingBlock: 10 }}
                required
              />
            </div>
          )}

          {/* Duration (Date) */}
          <div style={{ marginBottom: 20, borderBottom: '1px solid #cccccc88' }}>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-300"
              style={{ marginBottom: 5 }}
            >
              Due Date
            </label>
            <RangePicker
              size="large"
              variant="borderless"
              style={{ color: Colors.light, width: '100%' }}
              placeholder={['Start Date', 'End Date']}
              value={[
                startDate ? dayjs(startDate, 'YYYY-MM-DDTHH:mm') : null,
                endDate ? dayjs(endDate, 'YYYY-MM-DDTHH:mm') : null
              ]}
              onChange={(dates): void => {
                if (dates) {
                  setStartDate(dates[0]?.format('YYYY-MM-DDTHH:mm') || '')
                  setEndDate(dates[1]?.format('YYYY-MM-DDTHH:mm') || '')
                  setDuration(dates[0]?.format('YYYY-MM-DDTHH:mm') || '')
                } else {
                  setStartDate('')
                  setEndDate('')
                  setDuration('')
                }
              }}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
            />
          </div>

          {/* Priority */}
          <div style={{ marginBottom: 20, borderBottom: '1px solid #cccccc88' }}>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-300"
              style={{ marginBottom: 5 }}
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e): void => setPriority(e.target.value as TaskPriority)}
              style={{ borderRadius: 5, paddingInline: 5, paddingBlock: 10, color: Colors.light }}
              className="w-full  rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              {priorityOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  style={{ color: Colors.light, backgroundColor: Colors.darkGreen }}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div style={{ marginBottom: 20, borderBottom: '1px solid #cccccc88' }}>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-300"
              style={{ marginBottom: 5 }}
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e): void => setCategory(e.target.value as TaskCategory)}
              style={{ borderRadius: 5, paddingInline: 5, paddingBlock: 10, color: Colors.light }}
              className="w-full  rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              {categoryOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  style={{ color: Colors.light, backgroundColor: Colors.darkGreen }}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
            style={{
              borderRadius: 5,
              backgroundColor: Colors.primary,
              color: Colors.light,
              padding: 10
            }}
            disabled={isSubmitting || !taskName.trim() || !duration}
          >
            {isSubmitting ? (
              <PulseLoader color={Colors.light} size={10} />
            ) : isEditMode ? (
              'Update Task'
            ) : (
              'Create Task'
            )}
          </button>
        </form>
      </div>
    </Modal>
  )
}
