import { createContext } from 'react'

// Define the theme type

// Define the shape of our global state context
export interface FullScreenLayoutType {
  dockType: 'dashboard' | 'kanban'
  setDockType: React.Dispatch<React.SetStateAction<'dashboard' | 'kanban'>>
  isViewPrice: boolean
  priceToggle: () => void
  selectedProjectId: number
  setSelectedProjectId: React.Dispatch<React.SetStateAction<number>>
}

// Create context with proper typing and default values
export const FullScreenLayoutContext = createContext<FullScreenLayoutType>({
  dockType: 'dashboard',
  setDockType: () => {},
  isViewPrice: false,
  priceToggle: () => {},
  selectedProjectId: 0,
  setSelectedProjectId: () => {}
})
