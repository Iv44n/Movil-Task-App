import { randomUUID } from 'expo-crypto'
import { Database } from '@/lib/database.types'
import { use$ } from '@legendapp/state/react'
import { observable } from '@legendapp/state'
import { globalSync } from '@/lib/syncConfig'
import { supabase } from '@/lib/supabase'
import useProjectTasks from './useProjectTasks'

type ProjectInsertType = Omit<Database['public']['Tables']['projects']['Insert'], 'id' | 'created_at' | 'updated_at' | 'task_count' | 'deleted'>
type Project = Database['public']['Tables']['projects']['Row']

const projects$ = observable(
  globalSync({
    supabase,
    collection: 'projects',
    actions: ['read', 'create', 'update', 'delete'],
    select: q => q.select('*'),
    realtime: true,
    persist: { name: 'projects', retrySync: true },
    retry: { infinite: true },
    onError: (error) => console.log(error)
  })
)

export default function useProjects() {
  const { deleteTaskByProjectId } = useProjectTasks()
  const data = use$(projects$)
  const projects = Object.values(data || {}).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  function getProjectsById(id: string): Project | undefined {
    return projects$[id].get()
  }

  function createProject(project: ProjectInsertType) {
    const id = randomUUID()

    const newP = projects$[id].assign({
      id,
      ...project,
      task_count: 0
    })

    projects$.set((prev) => ({
      [id]: newP.get(),
      ...prev
    }))

    return newP.get()
  }

  function deleteProjectById(id: string) {
    projects$[id].delete()
    deleteTaskByProjectId(id)
  }

  return {
    projects,
    projectsLength: projects.length,
    getProjectsById,
    createProject,
    deleteProjectById
  }
}
