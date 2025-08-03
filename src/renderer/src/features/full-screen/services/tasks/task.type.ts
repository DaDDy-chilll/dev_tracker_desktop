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

export interface Task {
  id?: number
  name: string
  due_time: Date
  status: TaskStatus
  priority: TaskPriority
  projectId?: number
  created_at?: Date
  updated_at?: Date
  progress?: number
}

export interface TaskCreate {
  name: string
  due_time: Date
  status: TaskStatus
  priority: TaskPriority
  projectId?: number
  progress?: number
}

export interface TaskUpdate {
  id: number
  status?: TaskStatus
  priority?: TaskPriority
  progress?: number
  name?: string
  due_time?: Date
  projectId?: number
}
