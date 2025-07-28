import { useContext } from 'react'
import { MiddleScreenLayoutContext, FullScreenLayoutType } from './middle-screenContext'

// Export a properly typed hook
export const useMiddleScreenState = (): FullScreenLayoutType =>
  useContext(MiddleScreenLayoutContext)
