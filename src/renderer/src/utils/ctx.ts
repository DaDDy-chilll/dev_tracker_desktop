import { createContext } from 'react'

export const ctx = createContext<{
  merge: (a: Record<string, string>, b: Record<string, string>) => Record<string, string>
}>({
  merge: (a, b) => ({ ...a, ...b })
})
