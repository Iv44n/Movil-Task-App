import { StateCreator } from 'zustand'
import { ProjectSlice, RootState } from '../types'
import { ProjectService } from '@/lib/services/project.service'
import { AppError } from '@/errors/AppError'
import { Project } from '@/types/project'

type StateCreatorType = StateCreator<RootState, [], [], ProjectSlice>

export const projectsSlice: StateCreatorType = (set, get) => ({
  projects: [],
  isLoadingProjects: false,
  errorProjects: null,
  getProjects: async () => {
    const userId = get().user?.user_id
    if (!userId) return

    set({ isLoadingProjects: true, errorProjects: null })
    try {
      const projects = await ProjectService.getProjects(userId)
      set({ projects, isLoadingProjects: false })
    } catch (error) {
      if(error instanceof AppError){
        set({ errorProjects: error, isLoadingProjects: false })
      }
      set({ isLoadingProjects: false })
    }
  },
  deleteProjectById: async (projectId: number) => {
    const userId = get().user?.user_id
    if (!userId) return

    set({ isLoadingProjects: true, errorProjects: null })
    try {
      await ProjectService.deleteProjectById(projectId, userId)
      set({
        projects: get().projects.filter((project: Project) => project.projectId !== projectId),
        isLoadingProjects: false
      })
    } catch (error) {
      if(error instanceof AppError){
        set({ errorProjects: error, isLoadingProjects: false })
      }
      set({ isLoadingProjects: false })
    }
  }
})
