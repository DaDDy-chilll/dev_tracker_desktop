export const getColorForPriority = (priority: string): string => {
  switch (priority) {
    case 'HIGH':
      return '#eb4949'
    case 'MEDIUM':
      return '#f2be5e'
    case 'LOW':
      return '#6cf5a9'
    default:
      return '#000000'
  }
}
