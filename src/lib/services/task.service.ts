import { AppError, DatabaseError } from '@/errors/AppError'
import { TaskRepository } from '../repositories/task.repository'

export const TaskService = {
  getAllTasksByProjectId: async (projectId: number) => {
    try {
      const tasks = await TaskRepository.getAllTasksByProjectId(projectId)

      return tasks
    } catch (error: any) {
      if(error instanceof AppError){
        throw error
      }
      throw new DatabaseError(error.message)
    }
  },
  getTaskDetailsByProjectId: async (projectId: number): Promise<{ totalTasks: number, completedTasks: number }> => {
    try {
      const res = await TaskRepository.getTaskDetailsByProjectId(projectId)

      return res
    } catch (error: any) {
      if(error instanceof AppError){
        throw error
      }
      throw new DatabaseError(error.message)
    }
  }
}
