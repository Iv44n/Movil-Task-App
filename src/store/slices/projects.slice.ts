import { StateCreator } from 'zustand'
import { ProjectSlice, RootState } from '../types'
import { ProjectService } from '@/lib/services/project.service'
import { Project } from '@/types/project'

type StateCreatorType = StateCreator<RootState, [], [], ProjectSlice>

export const projectsSlice: StateCreatorType = (set, get) => ({
  projects: [],
  getProjects: async () => {
    const userId = get().user?.user_id
    if (!userId) return

    const projects = await ProjectService.getProjects(userId)
    set({ projects })
  },
  getProjectWithTasksById: async (projectId) => {
    const userId = get().user?.user_id
    if (!userId) return

    const project = await ProjectService.getProjectWithTasksById(projectId, userId)
    return project
  },
  deleteProjectById: async (projectId) => {
    const userId = get().user?.user_id
    if (!userId) return

    await ProjectService.deleteProjectById(projectId, userId)
    set({
      projects: get().projects.filter((project: Project) => project.projectId !== projectId)
    })
  }
})
