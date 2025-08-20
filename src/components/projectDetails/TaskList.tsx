import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Q, Query } from '@nozbe/watermelondb'
import Typo from '@/components/shared/Typo'
import TaskItem from '@/components/projectDetails/TaskItem'
import { Sizes } from '@/constants/theme'
import { StatusTask } from '@/constants/constants'
import { Task } from '@/models'
import i18n from '@/i18n'
import { LegendList, LegendListRef } from '@legendapp/list'

type Status = StatusTask | 'all'

const EmptyStateComponent = memo<{ tab: Status }>(function EmptyStateComponent({ tab }) {
  const { mainText, subtextKey } = useMemo(() => {
    const statusMap: Record<StatusTask, string> = {
      [StatusTask.PENDING]: i18n.t('projectDetails.status.plural.pending').toLowerCase(),
      [StatusTask.COMPLETED]: i18n.t('projectDetails.status.plural.completed').toLowerCase(),
      [StatusTask.IN_PROGRESS]: i18n.t('projectDetails.status.plural.in_progress').toLowerCase()
    }

    const isAll = tab === 'all'
    const statusTranslation = !isAll && statusMap[tab as StatusTask]
      ? statusMap[tab as StatusTask]
      : ''

    const mainText = isAll
      ? i18n.t('projectDetails.emptyAll')
      : i18n.t('projectDetails.emptyStatus', { status: statusTranslation })

    return {
      mainText,
      subtextKey: 'projectDetails.emptySubtext'
    }
  }, [tab])

  return (
    <View style={styles.emptyContainer}>
      <Typo size={15} color='secondary' style={styles.empty}>
        {mainText}
      </Typo>
      <Typo size={13} color='secondary' style={styles.emptySubtext}>
        {i18n.t(subtextKey)}
      </Typo>
    </View>
  )
})

const TaskList = memo(function TaskList({ tab, projectTasks, colorTheme }: { tab: Status, projectTasks: Query<Task>, colorTheme: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const listRef = useRef<LegendListRef>(null)

  useEffect(() => {
    const whereConditions = []

    if (tab !== 'all') {
      whereConditions.push(Q.where('status', tab))
    }

    const subscription = projectTasks
      .extend(
        ...whereConditions,
        Q.sortBy('created_at', Q.desc)
      )
      .observeWithColumns(['status', 'title', 'priority', 'start_date', 'due_date', 'progress_percentage'])
      .subscribe(setTasks)

    return () => subscription.unsubscribe()
  }, [tab, projectTasks])

  const renderTaskItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskItem
        id={item.id}
        title={item.title}
        priority={item.priority}
        startDate={item.startDate}
        dueDate={item.dueDate}
        colorTheme={colorTheme}
        progressPercentage={item.progressPercentage}
      />
    ),
    [colorTheme]
  )

  const emptyComponent = useMemo(() => <EmptyStateComponent tab={tab} />, [tab] )

  useEffect(() => {
    if (tasks.length > 0) {
      listRef.current?.scrollToIndex({
        index: 0,
        animated: true
      })
    }
  }, [tab, tasks.length])

  return (
    <View style={styles.container}>
      <LegendList
        ref={listRef}
        data={tasks}
        extraData={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={emptyComponent}
        showsVerticalScrollIndicator={false}
        recycleItems
      />
    </View>
  )
})

export default TaskList

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    paddingVertical: Sizes.spacing.s11
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: Sizes.spacing.s21,
    paddingHorizontal: Sizes.spacing.s15
  },
  empty: {
    textAlign: 'center'
  },
  emptySubtext: {
    textAlign: 'center',
    marginTop: Sizes.spacing.s5
  }
})
