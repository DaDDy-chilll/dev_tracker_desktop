import { JSX, useState, useEffect } from 'react'
import { Colors } from '@renderer/constants/Colors'
import { X } from 'lucide-react'
import Modal from 'react-modal'
import { PulseLoader } from 'react-spinners'
import { TaskPriority, TaskStatus, useCreateTask, useUpdateTask } from '../../services'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { Task } from '../../services/tasks/task.type'

// Set the app element for accessibility
Modal.setAppElement('#root')

interface TaskModelProps {
  isOpen: boolean
  onClose: () => void
  data?: Task | null
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

const statusOptions = [
  { value: TaskStatus.NOT_STARTED, label: 'Not Started' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.IN_REVIEW, label: 'Review' },
  { value: TaskStatus.IN_TEST, label: 'Test' },
  { value: TaskStatus.DONE, label: 'Done' }
]

const priorityOptions = [
  { value: TaskPriority.LOW, label: 'Low' },
  { value: TaskPriority.MEDIUM, label: 'Medium' },
  { value: TaskPriority.HIGH, label: 'High' },
  { value: TaskPriority.URGENT, label: 'Urgent' }
]

export const TaskModel = ({ isOpen, onClose, data }: TaskModelProps): JSX.Element => {
  const [taskName, setTaskName] = useState('')
  const [duration, setDuration] = useState<string>('')
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.NOT_STARTED)
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM)
  const { mutateAsync: createTask, isPending: isCreating } = useCreateTask()
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask()
  const { selectedProjectId } = useFullScreenState()

  console.log(selectedProjectId)
  // Initialize form with task data if in edit mode
  useEffect(() => {
    if (data) {
      setTaskName(data.name)
      setDuration(data.due_time ? new Date(data.due_time).toISOString().slice(0, 16) : '')
      setStatus(data.status)
      setPriority(data.priority)
    } else {
      // Reset form for create mode
      setTaskName('')
      setDuration('')
      setStatus(TaskStatus.NOT_STARTED)
      setPriority(TaskPriority.MEDIUM)
    }
  }, [data, isOpen])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    try {
      const taskData = {
        name: taskName,
        due_time: new Date(duration),
        status,
        priority,
        project_id: selectedProjectId
      }

      if (data?.id) {
        // Update existing task
        await updateTask({
          id: data.id,
          ...taskData
        })
      } else {
        // Create new task
        await createTask(taskData)
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
          <button onClick={onClose} className="text-gray-400 hover:text-white focus:outline-none">
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
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
              style={{ color: Colors.light, borderRadius: 5, paddingInline: 5, paddingBlock: 10 }}
              required
            />
          </div>

          {/* Duration (Date) */}
          <div style={{ marginBottom: 20, borderBottom: '1px solid #cccccc88' }}>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-300"
              style={{ marginBottom: 5 }}
            >
              Due Date
            </label>
            <input
              type="datetime-local"
              id="duration"
              value={duration}
              onChange={(e): void => setDuration(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
              style={{ color: Colors.light, borderRadius: 5, paddingInline: 5, paddingBlock: 10 }}
              required
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom: 20, borderBottom: '1px solid #cccccc88' }}>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-300"
              style={{ marginBottom: 5 }}
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e): void => setStatus(e.target.value as TaskStatus)}
              style={{ borderRadius: 5, paddingInline: 5, paddingBlock: 10, color: Colors.light }}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              {statusOptions.map((option) => (
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
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
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
