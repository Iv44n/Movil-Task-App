import { AppError } from '@/errors/AppError'
import { ProjectRepository } from '../repositories/project.repository'
import { Project } from '@/types/project'
import { TaskService } from './task.service'

export const ProjectService = {
  getProjects: async (userId: number): Promise<Project[]> => {
    try {

      const projectWithCategory = await ProjectRepository.getAllProjectsByUserId(userId)

      if (projectWithCategory.length === 0) {
        return []
      }

      const projectWithDetails: Project[] = []
      const taskDetails = await TaskService.getTaskDetailsByProjectId(projectWithCategory[0].projectId)

      for (const project of projectWithCategory) {
        projectWithDetails.push({
          ...project,
          details: {
            totalTasks: taskDetails.totalTasks,
            completedTasks: taskDetails.completedTasks
          }
        })
      }

      return projectWithDetails
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(error.message, 'GetProjectsError', 'GET_PROJECTS_ERROR')
    }
  },
  getProjectWithTasksById: async (projectId: number, userId: number): Promise<Project> => {
    try {
      const project = await ProjectRepository.getProjectById(projectId, userId)
      const tasks = await TaskService.getAllTasksByProjectId(project.projectId)

      const projectWithTasks = {
        ...project,
        tasks
      }

      return projectWithTasks
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(error.message, 'GetProjectWithTasksByIdError', 'GET_PROJECT_WITH_TASKS_BY_ID_ERROR')
    }
  },
  deleteProjectById: async (projectId: number, userId: number): Promise<void> => {
    try {
      await ProjectRepository.deleteProjectById(projectId, userId)
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(error.message, 'DeleteProjectByIdError', 'DELETE_PROJECT_BY_ID_ERROR')
    }
  }
}
