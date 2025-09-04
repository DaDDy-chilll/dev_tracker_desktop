import { Project } from "../projects/project.type"

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  IN_TEST = 'IN_TEST',
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TaskCategory {
  FEAUTURE = 'FEAUTURE',
  BUG = 'BUG',
  REFACTOR = 'REFACTOR',
  TEST = 'TEST',
  ERROR = 'ERROR'
}

export interface Task {
  id?: number
  name: string
  due_time: Date
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  project_id?: number
  created_at?: Date
  updated_at?: Date
  progress?: number
  branch_name: string
  start_date?: Date
  end_date?: Date
  project?: Project
}

export interface TaskCreate {
  name: string
  due_time: Date
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  project_id?: number
  progress?: number
  branch_name: string
  start_date?: Date
  end_date?: Date
}

export interface TaskUpdate {
  id: number
  status?: TaskStatus
  priority?: TaskPriority
  category?: TaskCategory
  progress?: number
  name?: string
  due_time?: Date
  project_id?: number
  isUpdateStatus?: boolean
  branch_name?: string
  start_date?: Date
  end_date?: Date
}


export interface GetTaskQuery {
  projectId?: number
  status?: TaskStatus
  start_date?: Date
  end_date?: Date
}

export interface TaskStatusCount {
  status?: TaskStatus
  _sum: {
    count: number
  }
}
