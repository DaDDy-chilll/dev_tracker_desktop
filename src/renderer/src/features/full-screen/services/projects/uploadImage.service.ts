import { api } from '@renderer/api'
import { ApiResponse } from '@renderer/api/type'
import { apiRoute } from '@renderer/api/api.route'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'

interface UploadImageResponse {
  id: string
  url: string
  // Add other fields returned by your API
}

interface UploadImageParams {
  file: File
  projectId?: string
}

/**
 * Uploads an image file to the server
 * @param params Object containing the file and optional projectId
 * @returns Promise with the API response containing the uploaded image details
 */
const postUploadImage = async (
  params: UploadImageParams
): Promise<ApiResponse<UploadImageResponse>> => {
  try {
    const formData = new FormData()
    formData.append('file', params.file)
    if (params.projectId) {
      formData.append('projectId', params.projectId)
    }

    const response = await api<FormData, UploadImageResponse>(apiRoute.image.upload, {
      method: 'POST',
      body: formData,
      headers: {
        // Let the browser set the Content-Type with boundary
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const useUploadImage = (): UseMutationResult<
  ApiResponse<UploadImageResponse>,
  unknown,
  UploadImageParams
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postUploadImage,
    mutationKey: ['upload-image'],
    onSuccess: () => {
      // Invalidate relevant queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['images'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }
  })
}
