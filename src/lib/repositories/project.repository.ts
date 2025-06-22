import { NewProject, ProjectEntity } from '@/types/project'
import { getDb } from '../database/Connection'
import { AppError, DatabaseError } from '@/errors/AppError'
import { FailedToCreateProjectError, ProjectAlreadyExistsError, ProjectNotFoundError } from '@/errors/ProjectError'

export const ProjectRepository = {
  createProject: async({ name, description, bgColor, userId, categoryId }: NewProject): Promise<ProjectEntity> => {
    try {
      const db = await getDb()
      const finalColor = bgColor || '#ffffff'

      await db.runAsync(
        `
        INSERT INTO projects (name, description, bg_color, user_id, category_id)
        VALUES (?, ?, ?, ?, ?);
        `,
        [name, description ?? null, finalColor, userId, categoryId]
      )

      const res = await db.getFirstAsync<{ lastInsertRowid: number }>(
        'SELECT last_insert_rowid() AS lastInsertRowid;'
      )

      if (!res) throw new FailedToCreateProjectError()

      const newProject = await db.getFirstAsync<Omit<ProjectEntity, 'category'> & { category: string }>(
        `
        SELECT  
          p.project_id AS projectId,
          p.name,
          p.description,
          p.created_date AS createdDate,
          p.updated_date AS updatedDate,
          p.bg_color AS bgColor,
          p.user_id AS userId,
          json_object(
            'id', c.category_id,
            'name', c.category_name
          ) AS category
        FROM projects AS p
        LEFT JOIN categories AS c ON c.category_id = p.category_id
        WHERE p.project_id = ?;
        `,
        [res.lastInsertRowid]
      )

      if(!newProject) throw new FailedToCreateProjectError()

      return {
        ...newProject,
        category: JSON.parse(newProject.category)
      }
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new ProjectAlreadyExistsError()
      }
      throw new DatabaseError(error.message)
    }
  },
  getAllProjectsByUserId: async (userId: number): Promise<ProjectEntity[]> => {
    try {
      const db = await getDb()

      const projects = await db.getAllAsync<Omit<ProjectEntity, 'category'> & { category: string }>(`
        SELECT  
          p.project_id AS projectId,
          p.name,
          p.description,
          p.created_date AS createdDate,
          p.updated_date AS updatedDate,
          p.bg_color AS bgColor,
          p.user_id AS userId,
          json_object(
            'id', c.category_id,
            'name', c.category_name
          ) AS category
        FROM projects AS p
        LEFT JOIN categories AS c ON c.category_id = p.category_id
        WHERE p.user_id = ?
        ORDER BY p.created_date DESC;
      `, [userId])

      const parsedProjects = projects.map(project => ({
        ...project,
        category: JSON.parse(project.category)
      }))

      return parsedProjects
    } catch (error: any) {
      throw new DatabaseError(error.message)
    }
  },
  getProjectById: async (projectId: number, userId: number): Promise<ProjectEntity> => {
    try {
      const db = await getDb()

      const project = await db.getFirstAsync<Omit<ProjectEntity, 'category'> & { category: string }>(`
        SELECT
          p.project_id AS projectId,
          p.name,
          p.description,
          p.created_date AS createdDate,
          p.updated_date AS updatedDate,
          p.bg_color AS bgColor,
          p.user_id AS userId,
          json_object(
            'id', c.category_id,
            'name', c.category_name
          ) AS category
        FROM projects AS p
        LEFT JOIN categories AS c ON c.category_id = p.category_id
        WHERE p.project_id = ? AND p.user_id = ?;
      `, [projectId, userId])

      if (!project) {
        throw new ProjectNotFoundError(`Project with id ${projectId} not found`)
      }

      return {
        ...project,
        category: JSON.parse(project.category)
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new DatabaseError(error.message)
    }
  },
  deleteProjectById: async (projectId: number, userId: number): Promise<void> => {
    try {
      const db = await getDb()
      await db.runAsync('DELETE FROM projects WHERE project_id = ? AND user_id = ?;', [projectId, userId])
    } catch (error: any) {
      if(error instanceof Error) {
        console.error('Failed to get projects:', error.message)
      }
      throw new DatabaseError(error.message)
    }
  }
}
