import React from 'react'

interface ProjectStatusLabelProps {
  color: string
  label: string
  value: string | number
  className?: string
}

const ProjectStatusLabel: React.FC<ProjectStatusLabelProps> = ({
  color,
  label,
  value,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <div className="flex-1 text-sm text-white">
        <span className="block">{label}</span>
        <span className="text-xs text-gray-300">{value}</span>
      </div>
    </div>
  )
}

export default ProjectStatusLabel
