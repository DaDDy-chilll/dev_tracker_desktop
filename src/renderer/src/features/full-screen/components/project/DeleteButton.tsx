import { Button } from 'antd'
import { Delete } from 'lucide-react'
import { JSX } from 'react'
import { useDeleteTask } from '../../services/tasks/task.service'

export const DeleteButton = ({ id }: { id: number }): JSX.Element => {
  const { mutateAsync: deleteTask, isPending } = useDeleteTask()
  const handleDelete = (id: number): void => {
    deleteTask(id)
  }
  return (
    <Button
      loading={isPending}
      icon={<Delete size={25} />}
      type="link"
      onClick={() => handleDelete(id)}
    ></Button>
  )
}
