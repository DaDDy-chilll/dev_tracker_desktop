// types.ts
import { NetworkError, ServerError, ApiError } from './api'

export interface FetchConfig<T = unknown> {
  method?: string
  headers?: Record<string, string>
  body?: T
  query?: Record<string, string>
  params?: Record<string, string>
  file?: FormData
}

export interface ErrorResponse {
  message: string
  [key: string]: unknown
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: NetworkError | ServerError | ApiError | Error
}
