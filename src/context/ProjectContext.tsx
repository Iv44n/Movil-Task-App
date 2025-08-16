import { createContext, useContext } from 'react'
import { StatusTask } from '@/constants/constants'
import { Query } from '@nozbe/watermelondb'
import { Task } from '@/models'

type Status = StatusTask | 'all'

export type ProjectContextType = {
  colorTheme: string
  projectTasks: Query<Task>
  tab: Status,
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const useProjectContext = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectContext.Provider')
  }
  return context
}
