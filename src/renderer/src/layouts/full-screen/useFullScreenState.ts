import { useContext } from 'react'
import { FullScreenLayoutContext, FullScreenLayoutType } from './full-screenContext'

// Export a properly typed hook
export const useFullScreenState = (): FullScreenLayoutType => useContext(FullScreenLayoutContext)
