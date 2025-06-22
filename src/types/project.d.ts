import { Task } from './task'

export interface ProjectEntity {
  projectId: number
  name: string
  description?: string | null
  createdDate?: readonly Date
  updatedDate?: readonly Date
  userId: number,
  category: {
    id: number
    name: string
  }
  bgColor: string
}

export interface ProjectWithDetails extends ProjectEntity {
  details: {
    totalTasks: number
    completedTasks: number
  }
}

export interface Project extends ProjectEntity {
  details?: {
    totalTasks: number
    completedTasks: number
  },
  tasks?: Task[]
}

export interface NewProject {
  name: string
  description: string | null
  bgColor: string | null
  userId: number
  categoryId: number
}
