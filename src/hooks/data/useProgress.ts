import { useMemo, useEffect, useState } from 'react'
import { Q } from '@nozbe/watermelondb'
import { StatusTask } from '@/constants/constants'
import { todayEnd, todayStart } from '@/utils/date'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TABLE_NAMES } from '@/lib/schema'
import { Task } from '@/models'

export type ProgressSummaryType = {
  percent: number
  count: number
  total: number
}

export default function useProgress({ userId }: { userId: string }) {
  const db = useDatabase()
  const [totalTasks, setTotalTasks] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(0)
  const [completedToday, setCompletedToday] = useState(0)

  const tasksCollection = useMemo(() => db.collections.get<Task>(TABLE_NAMES.TASKS), [db])
  // Subscribe to total tasks count
  useEffect(() => {
    if (!userId) {
      setTotalTasks(0)
      return
    }

    const subscription = tasksCollection
      .query(Q.where('user_id', userId))
      .observeCount()
      .subscribe(setTotalTasks)

    return () => subscription.unsubscribe()
  }, [userId, tasksCollection])

  // Subscribe to completed tasks count
  useEffect(() => {
    if (!userId) {
      setCompletedTasks(0)
      return
    }

    const subscription = tasksCollection
      .query(
        Q.where('user_id', userId),
        Q.where('status', StatusTask.COMPLETED)
      )
      .observeCount()
      .subscribe(setCompletedTasks)

    return () => subscription.unsubscribe()
  }, [userId, tasksCollection])

  // Subscribe to tasks completed today count
  useEffect(() => {
    if (!userId) {
      setCompletedToday(0)
      return
    }

    const todayStartTime = todayStart().getTime()
    const todayEndTime = todayEnd().getTime()

    const subscription = tasksCollection
      .query(
        Q.where('user_id', userId),
        Q.where('status', StatusTask.COMPLETED),
        Q.where('updated_at', Q.between(todayStartTime, todayEndTime))
      )
      .observeCount()
      .subscribe(setCompletedToday)

    return () => subscription.unsubscribe()
  }, [userId, tasksCollection])

  // Calculate progress summary
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
    completedToday,
    completed
  }
}
