import { DatabaseError } from '@/errors/AppError'
import { getDb } from '../database/Connection'
import { Category, NewCategory } from '@/types/category'
import { CategoryAlreadyExistsError } from '@/errors/CategoryError'

export const CategoryRepository = {
  create: async ({ name }: NewCategory): Promise<Category> => {
    try {
      const db = await getDb()

      const createdCategory = await db.getFirstAsync<Category>(`
        INSERT INTO categories (category_name)
        VALUES (?)
        RETURNING category_id AS id, category_name AS name
      `, [name])

      if (!createdCategory) {
        throw new DatabaseError('Failed to create category')
      }

      return createdCategory
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new CategoryAlreadyExistsError()
      }
      throw new DatabaseError(error.message)
    }
  },
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const db = await getDb()

      const categories = await db.getAllAsync<Category>(`
        SELECT
          category_id AS id,
          category_name AS name 
        FROM categories;
      `)

      return categories
    } catch (error: any) {
      throw new DatabaseError(error.message)
    }
  },
  deleteById: async (categoryId: number): Promise<void> => {
    try {
      const db = await getDb()

      const result = await db.runAsync(`
        DELETE FROM categories
        WHERE category_id = ? AND category_id NOT IN (SELECT category_id FROM projects);
      `, [categoryId])

      if (result.changes === 0) {
        const exists = await db.getFirstAsync<number>(
          'SELECT 1 FROM categories WHERE category_id = ?',
          [categoryId]
        )

        if (!exists) {
          throw new DatabaseError('Category not found')
        } else {
          throw new DatabaseError('Cannot delete category with associated projects')
        }
      }

    } catch (error: any) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(error.message)
    }
  }
}
