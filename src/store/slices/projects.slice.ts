import { StateCreator } from 'zustand'
import { ProjectSlice, RootState } from '../types'
import { ProjectService } from '@/lib/services/project.service'

type StateCreatorType = StateCreator<RootState, [], [], ProjectSlice>

export const projectsSlice: StateCreatorType = (set, get) => ({
  projects: [],
  createProject: async ({ name, description, bgColor, categoryId }) => {
    const userId = get().user?.user_id
    if (!userId) return

    const newProject = await ProjectService.createProject({
      name,
      description,
      bgColor,
      userId,
      categoryId
    })

    set(state => ({
      projects: [newProject, ...state.projects]
    }))
    return newProject
  },
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
    set(state => ({
      projects: state.projects.filter(project => project.projectId !== projectId)
    }))
  }
})
