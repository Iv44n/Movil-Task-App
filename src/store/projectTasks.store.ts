import { computed, observable } from '@legendapp/state'
import { globalSync } from '@/lib/syncConfig'
import { supabase } from '@/lib/supabase'
import { randomUUID } from 'expo-crypto'
import { InsertProjectTaskForForm, ProjectTask, UpdateProjectTaskForForm } from '@/types/ProjectTask'

export const localProjectTasks$ = observable(
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

type ProjectUpdates =
  | Partial<UpdateProjectTaskForForm>
  | ((prev: ProjectTask) => Partial<UpdateProjectTaskForForm>)

const returnDefault = {
  projectTasks: {} as Record<string, ProjectTask>,
  createProjectTask: undefined,
  updateProjectTask: undefined,
  deleteProjectTask: undefined
}

export const projectTasksStore$ = observable(
  (userId: string) => {
    if (!userId || userId.length < 1) return returnDefault

    const raw = localProjectTasks$.get()
    if (!raw || typeof raw !== 'object') return returnDefault

    const filtered = Object.fromEntries(
      Object.entries(raw)
        .filter(([_, projectTask]) => projectTask.user_id === userId)
        .sort(([, a], [, b]) => Date.parse(b.createdAtLocal) - Date.parse(a.createdAtLocal))
    )

    const projectTaskNames = computed(() => new Set(Object.values(filtered).map(projectTask => projectTask.title?.toLowerCase())))

    return {
      projectTasks: filtered,
      createProjectTask: (data: InsertProjectTaskForForm) => {
        try {
          const validatedData = validateTaskData(data)

          if (projectTaskNames.get().has(validatedData.title.toLowerCase())) {
            throw new Error('Task with this title already exists')
          }

          const newProjectTaskId = randomUUID()
          const timestamp = new Date().toISOString()

          const projectTaskData = {
            id: newProjectTaskId,
            ...validatedData,
            user_id: userId,
            createdAtLocal: timestamp,
            updatedAtLocal: timestamp
          }

          localProjectTasks$[newProjectTaskId].assign(projectTaskData)

          return projectTaskData
        } catch (error) {
          throw error
        }
      },
      updateProjectTask: (projectTaskId: string, changes: ProjectUpdates) => {
        try {
          if (!projectTaskId) throw new Error('Project task ID is required')
          const projectTaskObj = localProjectTasks$[projectTaskId]
          if (!projectTaskObj) throw new Error('Project task not found')
          if (projectTaskObj.get().user_id !== userId) throw new Error('Unauthorized: Cannot modify project task')

          projectTaskObj.set(prev => {
            const diff = typeof changes === 'function'
              ? changes(prev)
              : changes

            return { ...prev, ...diff }
          })

          return projectTaskObj.get()
        } catch (error) {
          throw error
        }
      },
      deleteProjectTask: (projectTaskId: string) => {
        try {
          if (!projectTaskId) throw new Error('Project task ID is required')
          const projectTask = filtered[projectTaskId]

          if (!projectTask) throw new Error('Project task not found')
          if (projectTask.user_id !== userId) throw new Error('Unauthorized: Cannot delete project task')

          localProjectTasks$[projectTaskId].delete()
        } catch (error) {
          throw error
        }
      }
    }
  }
)

function validateTaskData(data: InsertProjectTaskForForm): InsertProjectTaskForForm {
  if (!data.title?.trim()) throw new Error('Task title is required')
  if (data.title.length > 100) throw new Error('Task title must be 100 characters or less')
  if(!data.priority) throw new Error('Task priority is required')

  return {
    ...data,
    title: data.title.trim(),
    description: data.description?.trim() || undefined
  }
}
