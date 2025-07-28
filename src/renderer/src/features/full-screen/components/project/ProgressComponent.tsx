import { JSX } from 'react'

export const ProgressComponent = ({ progress }: { progress: number }): JSX.Element => {
  // Convert progress string to number (remove % if present)
  const progressValue = progress
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${progressValue}%`,
            backgroundColor:
              progressValue < 30 ? '#EF4444' : progressValue < 70 ? '#F59E0B' : '#10B981'
          }}
        />
      </div>
      <span className="text-sm text-gray-300">{progress}</span>
    </div>
  )
}
