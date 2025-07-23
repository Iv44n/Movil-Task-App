import { observable } from '@legendapp/state'
import { globalSync } from '@/lib/syncConfig'
import { supabase } from '@/lib/supabase'

export const projectTasks$ = observable(
  globalSync({
    supabase,
    collection: 'project_tasks',
    actions: ['read', 'create', 'update', 'delete'],
    select: q => q.select('*'),
    realtime: true,
    persist: { name: 'project_tasks', retrySync: true },
    retry: { infinite: true },
    onError: error => console.error('Sync error:', error)
  })
)
