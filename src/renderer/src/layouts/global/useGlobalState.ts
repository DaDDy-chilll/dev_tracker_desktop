import { useContext } from 'react'
import { GlobalStateContext, GlobalStateContextType } from './globalStateContext'

// Export a properly typed hook
export const useGlobalState = (): GlobalStateContextType => useContext(GlobalStateContext)
