import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { FetchConfig, ApiResponse, ErrorResponse } from './type' // Adjust the import path as needed
// import Store from 'electron-store';

// // Define the store schema/interface
// interface StoreSchema {
//   token?: string;
//   [key: string]: unknown;
// }

// const store = new Store();

// For Electron, we'll use localStorage or Electron Store instead of AsyncStorage
// And we'll use Node.js network checking instead of NetInfo

const BASE_URL = 'http://localhost:5001/'
// Electron uses process.env instead of EXPO_PUBLIC_*

// Custom error classes for better error handling
export class NetworkError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number = 0) {
    super(message)
    this.name = 'NetworkError'
    this.statusCode = statusCode
  }
}

export class ServerError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ServerError'
    this.status = status
  }
}

export class ApiError extends Error {
  status?: number
  data?: ErrorResponse
  constructor(message: string, status?: number, data?: ErrorResponse) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    Accept: 'application/json'
  }
})

// Check network connectivity by pinging our own API server
const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    // Try to connect to our own API server instead of an external service
    // This complies with CSP that only allows connections to 'self'
    await axios.head(BASE_URL, { timeout: 5000 })
    return true
  } catch {
    // Ignoring the error since we just want to return false on any failure
    return false
  }
}

// Add request interceptor to handle authentication
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     // Get token from electron-store instead of localStorage
//     const token = store.get('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

export const api = async <T = unknown, R = unknown>(
  endpoint: string,
  config: FetchConfig<T> = { method: 'GET' }
): Promise<ApiResponse<R>> => {
  try {
    // Check network connectivity first
    // const isConnected = await checkNetworkConnectivity()
    // if (!isConnected) {
    //   throw new NetworkError('No internet connection. Please check your network settings.', 0)
    // }

    const { method = 'GET', headers = {}, body, query, file, params } = config
    console.log('config',config)

    // Prepare axios request config
    const axiosConfig: AxiosRequestConfig = {
      url: endpoint,
      method: method,
      headers: headers,
      params: query || params
    }

    // Handle regular JSON body
    if (body && !file) {
      axiosConfig.data = body
    }

    // Handle file uploads with FormData
    if (file) {
      // For FormData, let axios set the correct content type with boundary
      axiosConfig.headers = {
        ...axiosConfig.headers,
        'Content-Type': 'multipart/form-data'
      }
      axiosConfig.data = file
    }

    try {
      // Make the request with axios
      const response: AxiosResponse = await axiosInstance(axiosConfig)

      // Return successful response
      return { success: true, data: response.data }
    } catch (error) {
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        console.log('axiosError', axiosError)
        // Log the error details
        console.error('API Error Response:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          url: `${BASE_URL}${endpoint}`,
          method: method
        })

        // Handle specific HTTP status codes
        const status = axiosError.response?.status
        const errorData: ErrorResponse = axiosError.response?.data as ErrorResponse

        if (status === 500) {
          throw new ServerError(errorData.message, status)
        } else if (status === 401 || status === 403) {
          throw new ApiError(`Authentication error: ${status}`, status, errorData)
        } else if (status === 404) {
          throw new ApiError(`Resource not found: ${endpoint}`, 404, errorData)
        } else {
          // Handle other errors
          const message =
            typeof errorData === 'object' && errorData?.message
              ? errorData.message
              : `HTTP error! status: ${status || 'unknown'}`

          throw new ApiError(message, status, errorData)
        }
      }

      // Re-throw the error
      throw error
    }
  } catch (error) {
    console.error('API Request Failed:', {
      error,
      url: `${BASE_URL}${endpoint}`,
      method: config.method,
      body: config.body
    })

    // Handle network errors
    if (axios.isAxiosError(error) && !error.response) {
      // Network error (no response received)
      const connectionError = new NetworkError(
        error.message || 'Network connection error',
        503 // 503 Service Unavailable
      )

      // Return a formatted error response for the calling code
      return { success: false, error: connectionError }
    }

    // Handle timeout errors
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      throw new NetworkError('Request timed out. Please try again.', 408) // 408 is Request Timeout
    } else if (
      error instanceof NetworkError ||
      error instanceof ServerError ||
      error instanceof ApiError
    ) {
      throw error
    } else {
      // Handle unknown error type safely
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      throw new Error(errorMessage)
    }
  }
}
