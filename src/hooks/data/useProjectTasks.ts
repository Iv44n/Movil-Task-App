import { randomUUID } from 'expo-crypto'
import { Database } from '@/lib/database.types'
import { use$ } from '@legendapp/state/react'
import { observable } from '@legendapp/state'
import { globalSync } from '@/lib/syncConfig'
import { supabase } from '@/lib/supabase'

type TaskInsertType = Omit<Database['public']['Tables']['project_tasks']['Insert'], 'id' | 'created_at' | 'updated_at' | 'task_count' | 'deleted'>
type TaskUpdateType = Omit<Database['public']['Tables']['project_tasks']['Update'], 'updated_at'>

const tasks$ = observable(
  globalSync({
    supabase,
    collection: 'project_tasks',
    actions: ['read', 'create', 'update', 'delete'],
    select: q => q.select('*'),
    realtime: true,
    persist: { name: 'project_tasks', retrySync: true },
    retry: { infinite: true },
    onError: (error) => console.log(error)
  })
)

export default function useProjectTasks() {
  const data = use$(tasks$)
  const tasks = Object.values(data || {}).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  function getTaskById(id: string) {
    return tasks$[id].get()
  }

  function createTask(project: TaskInsertType) {
    const id = randomUUID()

    const record = tasks$[id].assign({
      id,
      ...project
    })

    tasks$.set((prev) => ({
      [id]: record.get(),
      ...prev
    }))

    return record.get()
  }

  function updateTask(id: string, changes: TaskUpdateType) {
    const existing = tasks$[id].get()
    if (!existing) throw new Error(`Task ${id} not found`)

    const updated = tasks$[id].assign({
      ...changes,
      updated_at: new Date().toISOString()
    })

    return updated.get()
  }

  function deleteTaskById(id: string) {
    tasks$[id].delete()
  }

  function deleteTaskByProjectId(projectId: string){
    const idsToDelete = tasks
      .filter(t => t.project_id === projectId)
      .map(t => t.id)

    idsToDelete.forEach(id => {
      tasks$[id].delete()
    })
  }

  return {
    tasks: tasks || [],
    totalTasks: tasks ? tasks.length : 0,
    updateTask,
    getTaskById,
    createTask,
    deleteTaskById,
    deleteTaskByProjectId
  }
}
