import { createContext } from 'react'

// Define the theme type

// Define the shape of our global state context
export interface FullScreenLayoutType {
  middleTest: string
  setMiddleTest: React.Dispatch<React.SetStateAction<string>>
}

// Create context with proper typing and default values
export const MiddleScreenLayoutContext = createContext<FullScreenLayoutType>({
  middleTest: '',
  setMiddleTest: () => {}
})
