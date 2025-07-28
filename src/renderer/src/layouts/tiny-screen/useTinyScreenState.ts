import { useContext } from 'react'
import { TinyScreenLayoutContext, TinyScreenLayoutType } from './tiny-screenContext'

// Export a properly typed hook
export const useTinyScreenState = (): TinyScreenLayoutType => useContext(TinyScreenLayoutContext)
