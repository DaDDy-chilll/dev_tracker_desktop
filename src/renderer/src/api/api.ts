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

// Use Vite's environment variables instead of process.env
const isDevelopment = import.meta.env.DEV
// Define API URLs based on environment
const DEV_URL = 'http://localhost:5001/'
const PROD_URL = 'https://devtrackapi.duckdns.org/'
const BASE_URL = isDevelopment ? DEV_URL : PROD_URL

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

// Function to get MAC address via Electron IPC
const getMacAddress = async (): Promise<string | null> => {
  try {
    if (window.api?.network?.getMacAddress) {
      return await window.api.network.getMacAddress()
    }
    return null
  } catch (error) {
    console.error('Error getting MAC address:', error)
    return null
  }
}

// Function to get the local IP address via Electron IPC
const getLocalIpAddress = async (): Promise<string | null> => {
  try {
    if (window.api?.network?.getLocalIp) {
      return await window.api.network.getLocalIp()
    }
    return null
  } catch (error) {
    console.error('Error getting local IP address:', error)
    return null
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

// Add request interceptor to handle authentication and security headers
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from electron-store instead of localStorage
    // const token = store.get('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    // Add security headers for backend middleware verification
    const macAddress = await getMacAddress()
    const localIp = await getLocalIpAddress()

    if (macAddress) {
      config.headers['x-mac-address'] = macAddress
    }

    if (localIp) {
      config.headers['x-client-ip'] = localIp
    }

    // Add device identification header
    config.headers['x-device-type'] = 'dev-track-desktop'

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Check network connectivity by pinging our own API server
const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    // Use a simple GET request to check connectivity
    // Use a more reliable endpoint that's guaranteed to exist
    await axios.get(`${BASE_URL}api/v1`, {
      timeout: 5000,
      validateStatus: function (status) {
        // Consider any response (even error responses) as a sign of connectivity
        return status >= 200 && status < 600
      }
    })
    return true
  } catch (error) {
    console.error('Network connectivity check failed:', error)
    return false
  }
}

export const api = async <T = unknown, R = unknown>(
  endpoint: string,
  config: FetchConfig<T> = { method: 'GET' }
): Promise<ApiResponse<R>> => {
  try {
    // Check network connectivity first
    const isConnected = await checkNetworkConnectivity()
    if (!isConnected) {
      console.error('Network connectivity check failed - no connection')
      throw new NetworkError('No internet connection. Please check your network settings.', 0)
    }

    const { method = 'GET', headers = {}, body, query, file, params } = config

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

    // Handle binary responses (images, files)
    if (headers && headers['Accept'] && headers['Accept'].includes('image/')) {
      axiosConfig.responseType = 'arraybuffer'
    }

    try {
      // Make the request with axios
      const response: AxiosResponse = await axiosInstance(axiosConfig)

      // Return successful response
      if (axiosConfig.responseType === 'arraybuffer') {
        return { success: true, data: Buffer.from(response.data) }
      } else {
        return { success: true, data: response.data }
      }
    } catch (error) {
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
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
