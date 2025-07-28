import { Colors } from '@renderer/constants/Colors'
import { Check, ChevronDown, Circle } from 'lucide-react'
import { JSX, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useOnClickOutside, useDebounceValue } from 'usehooks-ts'
import { useUpdateTask } from '../../services'
import { TaskStatus } from '../../services/tasks/task.type'

type StatusOption = {
  value: string
  label: string
  icon: JSX.Element
  color: string
}

export const StatusComponent = ({
  status,
  id
}: {
  status: string
  id: number | undefined
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(status)
  // Debounce the status changes with 300ms delay
  const [debouncedStatus, updateDebouncedStatus] = useDebounceValue(selectedStatus, 300)
  const { mutateAsync: updateTask } = useUpdateTask()
  // Using HTMLDivElement type for the ref
  const ref = useRef<HTMLDivElement>(null)

  // Memoize status options to prevent unnecessary re-renders
  const statusOptions: StatusOption[] = useMemo(
    () => [
      {
        value: TaskStatus.NOT_STARTED,
        label: 'Not Started',
        icon: <Circle size={16} color="#6B7280" />,
        color: '#F3F4F6'
      },
      {
        value: TaskStatus.IN_PROGRESS,
        label: 'In Progress',
        icon: <Circle size={16} fill="#F59E0B" color="#F59E0B" />,
        color: '#FEF3C7'
      },
      {
        value: TaskStatus.IN_REVIEW,
        label: 'In Review',
        icon: <Circle size={16} fill="#8B5CF6" color="#8B5CF6" />,
        color: '#EDE9FE'
      },
      {
        value: TaskStatus.IN_TEST,
        label: 'In Test',
        icon: <Circle size={16} fill="#3B82F6" color="#3B82F6" />,
        color: '#DBEAFE'
      },
      {
        value: TaskStatus.DONE,
        label: 'Done',
        icon: <Check size={16} color="#10B981" />,
        color: '#D1FAE5'
      }
    ],
    []
  )

  // Memoize the current status to prevent unnecessary recalculations
  const currentStatus = useMemo(
    () => statusOptions.find((option) => option.value === selectedStatus) || statusOptions[0],
    [selectedStatus, statusOptions]
  )

  // Use useCallback to prevent unnecessary recreation of this function
  const handleStatusChange = useCallback(
    (newStatus: string): void => {
      setSelectedStatus(newStatus)
      // Update debounced value when status changes
      updateDebouncedStatus(newStatus)
      setIsOpen(false)
    },
    [updateDebouncedStatus]
  )

  // Use useCallback for click outside handler
  const handleClickOutside = useCallback((): void => {
    setIsOpen(false)
  }, [])

  // Memoize the update task function to prevent unnecessary API calls
  const performUpdate = useCallback(() => {
    if (id !== undefined) {
      updateTask({
        id,
        status: debouncedStatus as TaskStatus
      })
    }
  }, [id, debouncedStatus, updateTask])

  // Only trigger the update when debouncedStatus changes
  useEffect(() => {
    performUpdate()
  }, [performUpdate])

  // Using the hook to detect clicks outside the dropdown
  useOnClickOutside(ref as RefObject<HTMLElement>, handleClickOutside)

  return (
    <div className="relative" ref={ref} style={{ color: Colors.light }}>
      <button
        className="flex items-center justify-between w-fit px-3 py-2 text-sm rounded-md cursor-pointer"
        style={{
          border: `1px solid ${Colors.muted}`,
          padding: 5,
          borderRadius: 5,
          minWidth: '140px'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {currentStatus.icon}
          <span>{currentStatus.label}</span>
        </div>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-fit  rounded-md "
          style={{
            border: '1px solid #10B981',
            padding: 10,
            backgroundColor: Colors.darkGreen,
            boxShadow: '0 5px 2px 2px rgba(48, 48, 48, 0.349)'
          }}
        >
          <ul className="py-1">
            {statusOptions.map((option) => (
              <li key={option.value}>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-white text-sm text-left cursor-pointer hover:text-green-400"
                  style={{
                    padding: 5
                  }}
                  onClick={() => handleStatusChange(option.value)}
                >
                  {option.icon}
                  <span className="hover:text-green-300">{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
