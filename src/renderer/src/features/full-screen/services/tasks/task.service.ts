import { api } from '@renderer/api'
import { ApiResponse } from '@renderer/api/type'
import { apiRoute } from '@renderer/api/api.route'
import {
  UseMutationResult,
  useMutation,
  UseQueryResult,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { TaskCreate, Task, TaskUpdate } from './task.type'

/**
 * Creates a new task
 * @param taskData The task data to create
 * @returns Promise with the API response
 */
const postTask = async (taskData: TaskCreate): Promise<ApiResponse<Task>> => {
  try {
    const response = await api<Task, Task>(apiRoute.task.index, {
      method: 'POST',
      body: taskData
    })
    return response
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export const useCreateTask = (): UseMutationResult<ApiResponse<Task>, unknown, TaskCreate> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postTask,
    mutationKey: ['create-task'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}

const getTasks = async (projectId?: number): Promise<ApiResponse<Task[]>> => {
  try {
    const url = projectId ? `${apiRoute.task.index}?projectId=${projectId}` : apiRoute.task.index

    const response = await api<Task[], Task[]>(url, {
      method: 'GET'
    })
    return response
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

export const useGetTasks = (projectId?: number): UseQueryResult<ApiResponse<Task[]>> => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasks(projectId),
    enabled: !!projectId
  })
}

const updateTask = async (taskData: TaskUpdate): Promise<ApiResponse<Task>> => {
  try {
    const response = await api<TaskUpdate, Task>(apiRoute.task.index + `/${taskData.id}`, {
      method: 'PATCH',
      body: taskData
    })
    return response
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export const useUpdateTask = (): UseMutationResult<ApiResponse<Task>, unknown, TaskUpdate> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTask,
    mutationKey: ['update-task'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}


const deleteTask = async (id: number): Promise<ApiResponse<Task>> => {
  try {
    const response = await api<Task, Task>(apiRoute.task.index + `/${id}`, {
      method: 'DELETE'
    })
    return response
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

export const useDeleteTask = (): UseMutationResult<ApiResponse<Task>, unknown, number> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    mutationKey: ['delete-task'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}
