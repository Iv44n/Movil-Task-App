import { AppError, DatabaseError } from '@/errors/AppError'
import { getDb } from '../database/Connection'

export const ColorRepository = {
  createColor: async ({ userId, color }: { userId: number, color: string }) => {
    try {
      const db = await getDb()

      const newColor = await db.getFirstAsync<{ id: number, color: string }>(`
        INSERT INTO colors (user_id, color)
        VALUES (?, ?)
        RETURNING color_id as id, color;
      `, [userId, color])

      if (!newColor) {
        throw new DatabaseError('Failed to create color')
      }

      return newColor
    } catch (error: any) {
      if(error instanceof AppError) {
        throw error
      }
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new DatabaseError('Color already exists')
      }
      throw new DatabaseError(error.message)
    }
  },
  getAllColors: async (userId: number) => {
    try {
      const db = await getDb()

      const result = await db.getAllAsync<{ id: number, color: string }>(`
        SELECT 
          color_id AS id,
          color
        FROM colors
        WHERE user_id = ?
      `, [userId])

      return result
    } catch (error: any) {
      throw new DatabaseError(error.message)
    }
  }
}
