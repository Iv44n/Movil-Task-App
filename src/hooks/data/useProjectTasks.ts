import { randomUUID } from 'expo-crypto'
import { use$ } from '@legendapp/state/react'
import { observable, computed } from '@legendapp/state'
import { globalSync } from '@/lib/syncConfig'
import { supabase } from '@/lib/supabase'
import type {
  InsertProjectTaskForForm,
  ProjectTask,
  UpdateProjectTaskForForm
} from '@/types/ProjectTask'

const projectTasks$ = observable(
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

export default function useProjectTasks() {
  const rawData = use$(projectTasks$)

  const tasks = use$(
    computed(() =>
      Object.values(rawData || {}).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    )
  )

  const getTaskById = (taskId: string): ProjectTask | null => projectTasks$[taskId]?.get() || null

  const createTask = (projectId: string, payload: InsertProjectTaskForForm) => {
    if (!payload.title) throw new Error('Title is required')
    if (!projectId) throw new Error('Project ID is required')

    const newTaskId = randomUUID()
    const newTask = projectTasks$[newTaskId].assign({
      id: newTaskId,
      project_id: projectId,
      ...payload
    })

    projectTasks$.set(prev => ({ [newTaskId]: newTask.get(), ...prev }))
    return newTask.get()
  }

  const updateTask = (taskId: string, changes: Partial<UpdateProjectTaskForForm>) => {
    if (!taskId) throw new Error('Task ID is required')

    const node = projectTasks$[taskId]
    if (!node.get()) throw new Error(`Task not found: ${taskId}`)

    node.set(prev => ({
      ...prev,
      ...changes
    }))
  }

  const deleteTaskById = (taskId: string) => {
    projectTasks$[taskId]?.delete()
  }

  const deleteTasksByProjectId = (projectId: string) => {
    tasks
      .filter(task => task.project_id === projectId)
      .forEach(task => projectTasks$[task.id]?.delete())
  }

  return {
    tasks,
    totalTasks: tasks.length,
    getTaskById,
    createTask,
    updateTask,
    deleteTaskById,
    deleteTasksByProjectId
  }
}
