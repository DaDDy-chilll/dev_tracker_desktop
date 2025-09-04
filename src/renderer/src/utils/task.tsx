import { Flag, Bug, Plus, TestTube, RefreshCw, AlertTriangle } from 'lucide-react'
import { JSX } from 'react'

export const getColorForCategory = (category: string): string => {
  switch (category) {
    case 'FEAUTURE':
      return '#22c55e' // Green - for new features/enhancements
    case 'BUG':
      return '#ef4444' // Red - for bugs/issues
    case 'REFACTOR':
      return '#3b82f6' // Blue - for code improvements
    case 'TEST':
      return '#f59e0b' // Orange - for testing tasks
    case 'ERROR':
      return '#dc2626' // Dark red - for critical errors
    default:
      return '#6b7280' // Gray - for unknown categories
  }
}

export const getCategoryIcon = (category: string): JSX.Element => {
  const color = getColorForCategory(category)
  switch (category) {
    case 'BUG':
      return <Bug size={20} color={color} />
    case 'FEATURE':
      return <Plus size={20} color={color} />
    case 'TEST':
      return <TestTube size={20} color={color} />
    case 'REFACTOR':
      return <RefreshCw size={20} color={color} />
    case 'ERROR':
      return <AlertTriangle size={20} color={color} />
    default:
      return <Flag size={20} color={color} />
  }
}
