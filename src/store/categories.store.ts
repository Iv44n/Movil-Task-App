import { globalSync } from '@/lib/syncConfig'
import { supabase } from '@/lib/supabase'
import { computed, observable } from '@legendapp/state'
import { randomUUID } from 'expo-crypto'
import { projectsStore$ } from './projects.store'
import { Category } from '@/types/Category'

export const localCategories$ = observable(
  globalSync({
    supabase,
    collection: 'categories',
    actions: ['read', 'create', 'update', 'delete'],
    onError: (error) => console.log('Categories sync error:', error),
    select: q => q.select('*'),
    realtime: true,
    persist: { name: 'categories', retrySync: true },
    retry: { infinite: true }
  })
)

const returnDefault = {
  categories: {} as Record<string, Category>,
  createCategory: undefined,
  deleteCategory: undefined
}

export const categoriesStore$ = observable(
  (userId: string) => {
    if (!userId || userId.length < 1) return returnDefault

    const raw = localCategories$.get()
    if (!raw || typeof raw !== 'object') return returnDefault

    const filtered = Object.fromEntries(
      Object.entries(raw)
        .filter(([_, cat]) => cat.user_id === userId)
        .sort(([, a], [, b]) => Date.parse(b.createdAtLocal) - Date.parse(a.createdAtLocal))
    )

    const categoryNames = computed(() => new Set(Object.values(filtered).map(cat => cat.name?.toLowerCase())))

    return {
      categories: filtered,
      createCategory: (name: string) => {
        try {
          const sanitizedName = validateCategoryName(name)

          if (categoryNames.get().has(sanitizedName.toLowerCase())) {
            throw new Error('Category already exists')
          }

          const newCategoryId = randomUUID()
          const timestamp = new Date().toISOString()

          const categoryData = {
            id: newCategoryId,
            name: sanitizedName,
            user_id: userId,
            createdAtLocal: timestamp,
            updatedAtLocal: timestamp
          }

          const newCategory = localCategories$[newCategoryId].assign(categoryData)
          categoryNames.add(sanitizedName.toLowerCase())

          return newCategory.get()
        } catch (error) {
          throw error
        }
      },
      deleteCategory: (id: string) => {
        try {
          const category = localCategories$[id].get()
          if (!category) throw new Error('Category not found')
          if (category.user_id !== userId) {
            throw new Error('Unauthorized: Cannot delete category')
          }

          const projects = projectsStore$(userId).projects
          const isInUse = Object.values(projects).some(p => p.category_id === id)

          if (isInUse) {
            throw new Error('Category is in use by some projects')
          }

          categoryNames.delete(category.name?.toLowerCase())
          localCategories$[id].delete()
        } catch (error) {
          throw error
        }
      }
    }
  }
)

const validateCategoryName = (name: string): string => {
  if (!name?.trim()) throw new Error('Category name is required')

  const sanitized = name.trim()
  if (sanitized.length > 50) throw new Error('Category name must be 50 characters or less')
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(sanitized)) {
    throw new Error('Category name contains invalid characters')
  }

  return sanitized
}
