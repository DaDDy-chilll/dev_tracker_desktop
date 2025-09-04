import { api } from '@renderer/api'
import { apiRoute } from '@renderer/api/api.route'
import { ApiResponse } from '@renderer/api/type'
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { AllProjectTask, Project, ProjectCreate } from './project.type'
/**
 * Project data interface
 */

/**
 * Creates a new project
 * @param projectData The project data to create
 * @returns Promise with the API response
 */
const postProjects = async (projectData: ProjectCreate): Promise<ApiResponse<Project>> => {
  try {
    const response = await api<ProjectCreate, Project>(apiRoute.project.index, {
      method: 'POST',
      body: projectData
    })
    return response
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export const useCreateProject = (): UseMutationResult<
  ApiResponse<Project>,
  unknown,
  ProjectCreate
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postProjects,
    mutationKey: ['create-project'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
}

const getProjects = async (): Promise<ApiResponse<Project[]>> => {
  try {
    const response = await api<Project[], Project[]>(apiRoute.project.index, {
      method: 'GET'
    })
    return response
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}

export const useGetProjects = (): UseQueryResult<ApiResponse<Project[]>> => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })
}

const updateProject = async (
  id: number,
  projectData: ProjectCreate
): Promise<ApiResponse<Project>> => {
  try {
    const response = await api<ProjectCreate, Project>(apiRoute.project.index + `/${id}`, {
      method: 'PATCH',
      body: projectData
    })
    return response
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export const useUpdateProject = (): UseMutationResult<
  ApiResponse<Project>,
  unknown,
  { id: number; projectData: ProjectCreate }
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, projectData }: { id: number; projectData: ProjectCreate }) =>
      updateProject(id, projectData),
    mutationKey: ['update-project'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
}

const deleteProject = async (id: number): Promise<ApiResponse<Project>> => {
  try {
    const response = await api<Project, Project>(apiRoute.project.index + `/${id}`, {
      method: 'DELETE'
    })
    return response
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

export const useDeleteProject = (): UseMutationResult<ApiResponse<Project>, unknown, number> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    mutationKey: ['delete-project'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
}

const getAllProjectStatus = async (): Promise<ApiResponse<AllProjectTask[]>> => {
  try {
    const response = await api<Project[], AllProjectTask[]>(apiRoute.project.index, {
      method: 'GET'
    })
    return response
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}

export const useGetAllProjectStatus = (): UseQueryResult<ApiResponse<AllProjectTask[]>> => {
  return useQuery({
    queryKey: ['all-project-status'],
    queryFn: getAllProjectStatus
  })
}
