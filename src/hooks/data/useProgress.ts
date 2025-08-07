import { projectTasksStore$ } from '@/store/projectTasks.store'
import { use$ } from '@legendapp/state/react'
import { StatusTask } from '@/constants/constants'
import { todayEnd, todayStart } from '@/utils/date'
import { useAuth } from '../auth/useAuth'
import { useMemo } from 'react'

export type ProgressSummaryType = {
  percent: number
  count: number
  total: number
}

export default function useProgress() {
  const { user } = useAuth()
  const { projectTasks } = use$(() => projectTasksStore$(user?.id ?? ''))

  const totalTasks = useMemo(() => Object.keys(projectTasks || {}).length, [projectTasks])
  const completedTasks = useMemo(() => Object.values(projectTasks || {})
    .filter(task => task.status === StatusTask.COMPLETED)
    .length, [projectTasks])

  const completedToday = useMemo(() => Object.values(projectTasks || {})
    .filter(task => {
      const { status, updated_at } = task
      if (status !== StatusTask.COMPLETED) return false

      const completionDate = new Date(updated_at)
      return completionDate >= todayStart() && completionDate <= todayEnd()
    }).length, [projectTasks])

  const completed: ProgressSummaryType = useMemo(() => {
    const percent = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0
    return {
      percent,
      count: completedTasks,
      total: totalTasks
    }
  }, [totalTasks, completedTasks])

  return {
    completed,
    completedToday
  }
}
