export interface Project {
  id: number
  name: string
  image_id: number | null
  image: {
    id: number
    filename: string
    mimetype: string
    url: string
    created_at: string
    updated_at: string
  }
  status: ProjectStatus
  color?: string
  isNew?: boolean
  task_count?: number | string
  member_count?: number | string
  created_at?: string
  project_file_url?: string
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
  project_file_url?: string
}

export interface ImageUpload {
  image: File
  projectId: number
}

export interface AllProjectTask {
  id: number
  name: string
  status: ProjectStatus
  color: string
  _count: {
    tasks: number
  }
}
