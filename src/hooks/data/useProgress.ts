// hooks/useProgress.ts
import { useMemo } from 'react'
import useProjectTasks from './useProjectTasks'

export type ProgressSummaryType = {
  percent: number
  count: number
  total: number
}

export default function useProgress() {
  const { tasks, totalTasks } = useProjectTasks()

  const completedTaskCount = useMemo(
    () => tasks.filter(t => t.status === 'completed').length,
    [tasks]
  )

  const completed: ProgressSummaryType = useMemo(() => {
    const percent = totalTasks > 0
      ? Math.round((completedTaskCount / totalTasks) * 100)
      : 0
    return {
      percent,
      count: completedTaskCount,
      total: totalTasks
    }
  }, [completedTaskCount, totalTasks])

  const inProgress: { count: number } = useMemo(() => {
    return {
      count: tasks.filter(t => t.status === 'in_progress').length
    }
  }, [tasks])

  return {
    completed,
    inProgress
  }
}
