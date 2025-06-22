import { Category, NewCategory } from '@/types/category'
import { CategoryRepository } from '../repositories/category.repository'
import { AppError } from '@/errors/AppError'

export const CategoryService = {
  create: async ({ name }: NewCategory): Promise<Category> => {
    try {
      return await CategoryRepository.create({ name })
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(error.message, 'CreateProjectError', 'CREATE_PROJECT_ERROR')
    }
  },
  getAllCategories: async (): Promise<Category[]> => {
    try {
      return await CategoryRepository.getAllCategories()
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(error.message, 'CreateProjectError', 'CREATE_PROJECT_ERROR')
    }
  },
  deleteCategoryById: async (categoryId: number): Promise<void> => {
    try {
      await CategoryRepository.deleteById(categoryId)
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(error.message, 'DeleteCategoryError', 'DELETE_CATEGORY_ERROR')
    }
  }
}
