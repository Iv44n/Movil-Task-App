import { StateCreator } from 'zustand'
import { CategorySlice, RootState } from '../types'
import { CategoryService } from '@/lib/services/category.service'

type StateCreatorType = StateCreator<RootState, [], [], CategorySlice>

export const categorySlice: StateCreatorType = (set) => ({
  categories: [],
  createCategory: async (name) => {
    const newCategory = await CategoryService.create({ name })

    set((state) => ({
      categories: [newCategory, ...state.categories]
    }))
    return newCategory
  },
  getCategories: async () => {
    const categories = await CategoryService.getAllCategories()
    set({ categories })
  },
  deleteCategoryById: async (categoryId) => {
    await CategoryService.deleteCategoryById(categoryId)

    set((state) => ({
      categories: state.categories.filter((category) => category.id !== categoryId)
    }))
  }
})
