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
import { ProjectCreate, Project } from './project.type'
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
