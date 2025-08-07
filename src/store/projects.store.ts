import { globalSync } from '@/lib/syncConfig'
import { supabase } from '@/lib/supabase'
import { computed, observable } from '@legendapp/state'
import { InsertProjectForForm, Project, UpdateProjectForForm } from '@/types/Project'
import { randomUUID } from 'expo-crypto'

export const localProjects$ = observable(
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

type ProjectUpdates =
  | Partial<UpdateProjectForForm>
  | ((prev: Project) => Partial<UpdateProjectForForm>)

const returnDefault = {
  projects: {} as Record<string, Project>,
  createProject: undefined,
  updateProject: undefined,
  deleteProject: undefined
}

export const projectsStore$ = observable(
  (userId: string) => {
    if (!userId || userId.length < 1) return returnDefault

    const raw = localProjects$.get()
    if (!raw || typeof raw !== 'object') return returnDefault

    const filtered = Object.fromEntries(
      Object.entries(raw)
        .filter(([_, project]) => project.user_id === userId)
        .sort(([, a], [, b]) => Date.parse(b.createdAtLocal) - Date.parse(a.createdAtLocal))
    )

    const projectNames = computed(() => new Set(Object.values(filtered).map(project => project.name?.toLowerCase())))

    return {
      projects: filtered,
      createProject: (data: InsertProjectForForm) => {
        try {
          const validatedData = validateProjectData(data)

          if (projectNames.get().has(validatedData.name.toLowerCase())) {
            throw new Error('Project with this name already exists')
          }

          const newProjectId = randomUUID()
          const timestamp = new Date().toISOString()

          const projectData = {
            id: newProjectId,
            ...validatedData,
            user_id: userId,
            task_count: 0,
            completed_tasks: 0,
            createdAtLocal: timestamp,
            updatedAtLocal: timestamp
          }

          localProjects$[newProjectId].assign(projectData)

          return projectData
        } catch (error) {
          throw error
        }
      },
      updateProject: (projectId: string, changes: ProjectUpdates) => {
        try {
          if (!projectId) throw new Error('Project ID is required')
          const projectObj = localProjects$[projectId]
          if (!projectObj.get()) throw new Error('Project not found')
          if (projectObj.get().user_id !== userId) throw new Error('Unauthorized: Cannot modify project')

          projectObj.set(prev => {
            const diff = typeof changes === 'function'
              ? changes(prev)
              : changes

            return { ...prev, ...diff }
          })

          return projectObj.get()
        } catch (error) {
          throw error
        }
      },
      deleteProject: (projectId: string) => {
        try {
          if (!projectId) throw new Error('Project ID is required')
          const project = filtered[projectId]

          if (!project) throw new Error('Project not found')
          if (project.user_id !== userId) throw new Error('Unauthorized: Cannot delete project')

          localProjects$[projectId].delete()
        } catch (error) {
          throw error
        }
      }
    }
  }
)

function validateProjectData(data: InsertProjectForForm): InsertProjectForForm {
  if (!data.name?.trim()) throw new Error('Project name is required')
  if (data.name.length > 100) throw new Error('Project name must be 100 characters or less')
  if (!data.category_id) throw new Error('Category is required')

  return {
    ...data,
    color: data.color || '#fffff',
    name: data.name.trim(),
    description: data.description?.trim() || undefined
  }
}
