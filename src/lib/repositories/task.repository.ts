import { AppError, DatabaseError } from '@/errors/AppError'
import { getDb } from '../database/Connection'
import { Task } from '@/types/task'

export const TaskRepository = {
  getAllTasksByProjectId: async (projectId: number): Promise<Task[]> => {
    try {
      const db = await getDb()

      const tasks = await db.getAllAsync<Omit<Task, 'priority'> & { priority: string }>(`
        SELECT
          t.task_id AS taskId,
          t.title,
          t.description,
          t.status,
          t.due_date AS dueDate,
          t.created_date AS createdDate,
          t.project_id AS projectId,
          t.assigned_user_id AS assignedUserId,
          t.is_recurring AS isRecurring,
          t.project_id AS projectId,
          json_object(
            'id', p.priority_id,
            'name', p.level,
            'color', p.color
          ) AS priority
        FROM tasks AS t
        LEFT JOIN priorities AS p ON p.priority_id = t.priority_id
        WHERE t.project_id = ?
        ORDER BY t.due_date ASC;
      `, [projectId])

      const parsedTasks = tasks.map(task => ({
        ...task,
        priority: JSON.parse(task.priority)
      }))

      return parsedTasks
    } catch (error: any) {
      if(error instanceof AppError){
        throw error
      }
      throw new DatabaseError(error.message)
    }
  },
  getTaskDetailsByProjectId: async (projectId: number): Promise<{ totalTasks: number, completedTasks: number }> => {
    try {
      const db = await getDb()

      const res = await db.getFirstAsync<{ total_tasks: number, completed_tasks: number }>(`
        SELECT
          COUNT(task_id) AS total_tasks,
          COUNT(task_id) FILTER (WHERE status = 'completed') AS completed_tasks
        FROM tasks
        WHERE project_id = ?;
      `, [projectId])

      return {
        totalTasks: res?.total_tasks || 0,
        completedTasks: res?.completed_tasks || 0
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new DatabaseError(error.message)
    }
  }
}
