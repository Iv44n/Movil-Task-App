import { globalSync } from '@/lib/syncConfig'
import { supabase } from '@/lib/supabase'
import { observable } from '@legendapp/state'

export const projects$ = observable(
  globalSync({
    supabase,
    collection: 'projects',
    actions: ['read', 'create', 'update', 'delete'],
    select: q => q.select('*'),
    realtime: true,
    persist: { name: 'projects', retrySync: true },
    retry: { infinite: true },
    onError: error => console.error('Projects sync error:', error)
  })
)
