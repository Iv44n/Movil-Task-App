import { randomUUID } from 'expo-crypto'
import { observable, computed } from '@legendapp/state'
import { globalSync } from '@/lib/syncConfig'
import { supabase } from '@/lib/supabase'
import useProjectTasks from './useProjectTasks'
import { InsertProjectForForm, Project, UpdateProjectForForm } from '@/types/Project'
import { StatusTask } from '@/constants/constants'

const projects$ = observable(
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

export default function useProjects() {
  const { tasks: projectTasks, deleteTasksByProjectId } = useProjectTasks()

  // Computed que actualiza task_count y completed_tasks automáticamente
  const projectsWithCounts$ = computed(() => {
    const counts = projectTasks.reduce((acc, t) => {
      const pid = t.project_id
      if (!acc[pid]) acc[pid] = { task_count: 0, completed_tasks: 0 }
      acc[pid].task_count++
      if (t.status === StatusTask.COMPLETED) acc[pid].completed_tasks++
      return acc
    }, {} as Record<string, { task_count: number; completed_tasks: number }>)

    const data = projects$.get() || {}
    for (const [id, proj] of Object.entries(data)) {
      const c = counts[id] || { task_count: 0, completed_tasks: 0 }
      proj.task_count = c.task_count
      proj.completed_tasks = c.completed_tasks
    }
    return data
  })

  const projectsList = computed(() =>
    Object.values(projectsWithCounts$.get()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  )

  const projects = projectsList.get()

  const getProjectById = (projectId: string): Project | null => projects$[projectId]?.get() || null

  function createProject(payload: InsertProjectForForm) {
    const { name, category_id } = payload
    if (!name.trim()) throw new Error('Project name is required')
    if (!category_id) throw new Error('Category is required')

    const id = randomUUID()
    const newProj = projects$[id].assign({
      id,
      ...payload,
      task_count: 0,
      completed_tasks: 0
    })

    projects$.set(prev => ({ [id]: newProj.get(), ...prev }))
    return newProj.get()
  }

  function updateProject(projectId: string, changes: Partial<UpdateProjectForForm>) {
    if (!projectId) throw new Error('Project ID is required')
    const node = projects$[projectId]
    const existing = node?.get()
    if (!existing) throw new Error(`Project not found: ${projectId}`)
    const updated = node.assign({ ...existing, ...changes, updated_at: new Date().toISOString() })
    return updated.get()
  }

  function deleteProjectById(projectId: string) {
    if (!projectId) throw new Error('Project ID is required')
    projects$[projectId]?.delete()
    deleteTasksByProjectId(projectId)
  }

  return {
    projects,
    totalProjects: projects.length,
    getProjectById,
    createProject,
    updateProject,
    deleteProjectById
  }
}
