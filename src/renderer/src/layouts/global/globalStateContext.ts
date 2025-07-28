import { createContext } from 'react'

// Define types for user
export type User = {
  id?: string
  name?: string
  email?: string
  // Add other user properties as needed
} | null

// Define the theme type
export type Theme = 'light' | 'dark'
export type WindowState = 'tiny' | 'minimize' | 'maximize'
// Define the shape of our global state context
export interface GlobalStateContextType {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  theme: Theme
  setTheme: React.Dispatch<React.SetStateAction<Theme>>
  setScreen: React.Dispatch<React.SetStateAction<WindowState>>
  screen: WindowState
}

// Create context with proper typing and default values
export const GlobalStateContext = createContext<GlobalStateContextType>({
  user: null,
  setUser: () => {},
  theme: 'light',
  setTheme: () => {},
  setScreen: () => {},
  screen: 'maximize'
})
