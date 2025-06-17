export interface Task {
  task_id: number
  title: string
  description?: string | null
  createdDate: Date
  startDate?: Date | null
  dueDate?: Date | null
  status: 'pending' | 'in_progress' | 'completed'
  isRecurring: boolean
  projectId?: number | null
  assignedUserId: number
  priority?: {
    id: number
    level: string,
    color: string
  }
}
