import { projectTasks$ } from '@/store/projectTasks.store'
import { use$ } from '@legendapp/state/react'
import { StatusTask } from '@/constants/constants'
import { todayEnd, todayStart } from '@/utils/date'

export type ProgressSummaryType = {
  percent: number
  count: number
  total: number
}

export default function useProgress() {
  const totalTasks = use$(() => Object.values(projectTasks$.get() || {}).length)
  const completedTasks = use$(() =>
    Object.values(projectTasks$.get() || {}).filter(task => task.status === StatusTask.COMPLETED).length
  )
  const completedToday = use$(() => {
    return Object.values(projectTasks$.get() || {}).filter(task => {
      const { status, updated_at } = task
      if (status !== StatusTask.COMPLETED) return false

      const completionDate = new Date(updated_at)
      return completionDate >= todayStart() && completionDate <= todayEnd()
    }).length
  })

  const completed: ProgressSummaryType = use$(() => {
    const percent = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0
    return {
      percent,
      count: completedTasks,
      total: totalTasks
    }
  })

  return {
    completed,
    completedToday
  }
}
