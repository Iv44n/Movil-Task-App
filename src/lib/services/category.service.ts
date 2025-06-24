import { Category, NewCategory } from '@/types/category'
import { CategoryRepository } from '../repositories/category.repository'
import { AppError } from '@/errors/AppError'

export const CategoryService = {
  create: async (newCategory: NewCategory): Promise<Category> => {
    try {
      return await CategoryRepository.create(newCategory)
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(error.message, 'CreateProjectError', 'CREATE_PROJECT_ERROR')
    }
  },
  getAllCategories: async (userId: number): Promise<Category[]> => {
    try {
      return await CategoryRepository.getAllCategories(userId)
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(error.message, 'CreateProjectError', 'CREATE_PROJECT_ERROR')
    }
  },
  deleteCategoryById: async (categoryId: number, userId: number): Promise<void> => {
    try {
      await CategoryRepository.deleteById(categoryId, userId)
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(error.message, 'DeleteCategoryError', 'DELETE_CATEGORY_ERROR')
    }
  }
}
