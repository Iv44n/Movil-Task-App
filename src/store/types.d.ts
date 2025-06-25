import type { AppError } from '@/errors/AppError'
import { Category } from '@/types/category'
import { NewProject, Project } from '@/types/project'
import type { LoginCredentials, RegisterData, UserProfile } from '@/types/user'

export interface UserSlice {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  updateUsername: (newUsername: string) => Promise<void>
}

export interface AuthSlice {
  isAuthenticated: boolean
  isLoadingAuth: boolean
  errorAuth: AppError | null
  register: (data: RegisterData) => Promise<void>
  login: (data: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>,
  setErrorAuth: (error: AppError | null) => void
}

export interface ProjectSlice {
  projects: Project[] | []
  createProject: (project: Omit<NewProject, 'userId'>) => Promise<Project | undefined>,
  getProjects: () => Promise<void>,
  getProjectWithTasksById: (projectId: number) => Promise<Project | undefined>,
  deleteProjectById: (projectId: number) => Promise<void>
}

export interface CategorySlice {
  categories: Category[] | []
  createCategory: (name: string) => Promise<Category | undefined>
  getCategories: () => Promise<void>
  deleteCategoryById: (categoryId: number) => Promise<void>
}

export interface ColorsSlice {
  colors: { id: number, color: string }[] | []
  createColor: (color: string) => Promise<{ id: number, color: string } | undefined>
  getAllColors: () => Promise<void>
}

export interface OverlaySlice {
  overlayContent: React.ReactNode | null
  showOverlay: (content: React.ReactNode) => void
  hideOverlay: () => void
}

export type RootState = UserSlice & AuthSlice & ProjectSlice & CategorySlice & OverlaySlice & ColorsSlice
