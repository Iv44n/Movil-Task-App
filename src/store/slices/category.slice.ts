import { StateCreator } from 'zustand'
import { CategorySlice, RootState } from '../types'
import { CategoryService } from '@/lib/services/category.service'

type StateCreatorType = StateCreator<RootState, [], [], CategorySlice>

export const categorySlice: StateCreatorType = (set, get) => ({
  categories: [],
  createCategory: async (name) => {
    const userId = get().user?.user_id
    if (!userId) return

    const newCategory = await CategoryService.create({ name, userId })

    set((state) => ({
      categories: [newCategory, ...state.categories]
    }))
    return newCategory
  },
  getCategories: async () => {
    const userId = get().user?.user_id
    if (!userId) return

    const categories = await CategoryService.getAllCategories(userId)
    set({ categories })
  },
  deleteCategoryById: async (categoryId) => {
    const userId = get().user?.user_id
    if (!userId) return

    await CategoryService.deleteCategoryById(categoryId, userId)

    set((state) => ({
      categories: state.categories.filter((category) => category.id !== categoryId)
    }))
  }
})
