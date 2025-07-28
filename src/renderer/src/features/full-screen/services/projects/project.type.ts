export interface Project {
  id: number
  name: string
  image_id: number | null
  status: ProjectStatus
  color?: string
  isNew?: boolean
  task_count?: number | string
  member_count?: number | string
}

export enum ProjectStatus {
  PLANING = 'PLANING',
  DEVELOPMENT = 'DEVELOPMENT',
  COMPLETED = 'COMPLETED',
  MAINTENANCE = 'MAINTENANCE',
  HOLDING = 'HOLDING',
  FINISHED = 'FINISHED'
}


export interface ProjectCreate {
  name: string
  image_id: number | null
  status: ProjectStatus
  color?: string
  member_count?: number
}


