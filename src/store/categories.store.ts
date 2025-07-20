import { globalSync } from '@/lib/syncConfig'
import { supabase } from '@/lib/supabase'
import { observable } from '@legendapp/state'

export const categories$ = observable(
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
