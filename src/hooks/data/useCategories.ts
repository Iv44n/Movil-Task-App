import { observable } from '@legendapp/state'
import { supabase } from '@/lib/supabase'
import { globalSync } from '@/lib/syncConfig'
import { randomUUID } from 'expo-crypto'
import useProjects from './useProjects'

const categories$ = observable(
  globalSync({
    supabase,
    collection: 'categories',
    actions: ['read', 'create', 'update', 'delete'],
    onError: (error) => console.log(error),
    select: q => q.select('*'),
    realtime: true,
    persist: { name: 'categories', retrySync: true },
    retry: { infinite: true }
  })
)

export default function useCategories() {
  const data = categories$.get()
  const projects = useProjects().projects
  const categories = Object.values(data || {}).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  function getCategoryById(id: string) {
    const category = categories$[id].get()

    if (!category) return undefined

    return category
  }

  function createCategory(name: string) {
    const id = randomUUID()

    const newC = categories$[id].assign({
      id,
      name
    })

    categories$.set((prev) => ({
      [id]: newC.get(),
      ...prev
    }))

    return newC.get()
  }

  function deleteCategoryById(id: string) {
    if (projects.some((p: { category_id: string }) => p.category_id === id)) {
      throw new Error('The category you are trying to delete is in use by some project')
    }

    categories$[id].delete()
  }

  return { categories, getCategoryById, createCategory, deleteCategoryById }
}
