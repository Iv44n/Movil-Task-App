import { observable } from '@legendapp/state'
import { supabase } from '@/lib/supabase'
import { globalSync } from '@/lib/syncConfig'

const categories$ = observable(
  globalSync({
    supabase,
    collection: 'categories',
    actions: ['read', 'create', 'update', 'delete'],
    onError: (error) => console.log(error),
    select: (from) => from.select(`
      id,
      name,
      created_at,
      updated_at,
      user_id
      `),
    realtime: true,
    persist: {
      name: 'categories',
      retrySync: true
    },
    retry: { infinite: true }
  })
)

export default function useCategories() {
  const data = categories$.get()
  const categories = Object.values(data || {}).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  function getCategoryById(id: string) {
    const category = categories$[id].get()

    if (!category) return undefined

    return category
  }

  return { categories, getCategoryById }
}
