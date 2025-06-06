import { getDb } from '@/database/Connection'
import { projectQueries } from './queries/ProjectQueries'

interface Project {
  id: number
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export default {
  createNewProject: async (
    { userId, name, description }: { userId: number, name: string, description: string }
  ): Promise<Project> => {
    try {
      const db = await getDb()
      const project = await db.getFirstAsync<Project>(projectQueries.insertProject, [name, description, userId])

      if (!project) {
        throw new Error('Failed to create new project')
      }
      return project
    } catch (error) {
      console.error('Error creating new project:', error)
      throw error
    }
  },
  getProjectById: async (projectId: number): Promise<Project> => {
    try {
      const db = await getDb()
      const project = await db.getFirstAsync<Project>(projectQueries.getProjectById, [projectId])

      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`)
      }

      return project || null
    } catch (error) {
      console.error('Error fetching project by ID:', error)
      throw error
    }
  },
  getUserProjects: async (userId: number): Promise<Project[]> => {
    try {
      const db = await getDb()
      const projects = await db.getAllAsync<Project>(projectQueries.getUserProjects, [userId])

      if (!projects) {
        throw new Error(`No projects found for user ID ${userId}`)
      }

      return projects
    } catch (error) {
      console.error('Error fetching user projects:', error)
      throw error
    }
  }
}
