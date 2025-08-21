import { memo, useCallback, useMemo, useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Q } from '@nozbe/watermelondb'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { Priority, StatusTask } from '@/constants/constants'
import { Task } from '@/models'
import i18n from '@/i18n'
import Icon from '../icons/Icon'
import { useAuth } from '@/hooks/auth/useAuth'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TABLE_NAMES } from '@/lib/schema'
import { todayEnd, todayStart } from '@/utils/date'
import { useRouter } from 'expo-router'

function usePriorityTasks({ userId }: { userId?: string }) {
  const db = useDatabase()
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (!userId) return

    const subscription = db.collections.get<Task>(TABLE_NAMES.TASKS)
      .query(
        Q.where('user_id', userId),
        Q.or(
          Q.where('priority', Priority.HIGH),
          Q.where('due_date', Q.between(todayStart().getTime(), todayEnd().getTime()))
        ),
        Q.sortBy('priority', Q.desc),
        Q.sortBy('due_date', Q.asc),
        Q.take(4)
      )
      .observeWithColumns(['title', 'status', 'priority', 'due_date'])
      .subscribe(setTasks)

    return () => subscription.unsubscribe()
  }, [userId, db])

  return tasks
}

const PriorityItem = memo(({ label, isCompleted, taskInfo }: { label: string, isCompleted: boolean, taskInfo: { taskId: string, projectId: string } }) => {
  const router = useRouter()
  return(
    <View style={styles.priorityItem}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ flexDirection: 'row' }}
        onPress={() => router.push(`(protected)/project/task/${taskInfo.taskId}`)}
      >
        {isCompleted
          ? <Icon.CheckCircle size={19} color={Colors.secondary} />
          : <Icon.Circle size={19} color={Colors.primary}/>}
        <Typo
          size={13}
          color={isCompleted ? 'secondary' : 'primary'}
          style={{
            textDecorationLine: isCompleted ? 'line-through' : 'none',
            maxWidth: '85%',
            marginLeft: Sizes.spacing.s7
          }}
          ellipsizeMode='tail'
          numberOfLines={1}
        >
          {label}
        </Typo>
      </TouchableOpacity>
    </View>
  )
})
PriorityItem.displayName = 'PriorityItem'

const PriorityTasksSection = () => {
  const { user } = useAuth()
  const tasks = usePriorityTasks({ userId: user?.id })

  const renderTask = useCallback((task: Task) => (
    <PriorityItem
      key={task.id}
      label={task.title}
      isCompleted={task.status === StatusTask.COMPLETED}
      taskInfo={{ taskId: task.id, projectId: task.projectId }}
    />
  ), [])

  const emptyState = useMemo(() => (
    <Typo size={13} weight='500' color='secondary'>
      No tasks
    </Typo>
  ), [])

  return (
    <View style={styles.card}>
      <Typo
        size={15}
        weight='600'
        style={styles.title}
      >
        {i18n.t('home.progressInfo.priorityTasks')}
      </Typo>
      <View
        style={[
          styles.taskList,
          tasks.length === 0 && styles.emptyContainer,
          tasks.length < 4 && {
            justifyContent: 'flex-start'
          }
        ]}
      >
        {tasks.length === 0 ? emptyState : tasks.map(renderTask)}
      </View>
    </View>
  )
}
export default PriorityTasksSection

const styles = StyleSheet.create({
  card: {
    width: '49%',
    backgroundColor: Colors.card,
    padding: Sizes.spacing.s15,
    borderRadius: Shapes.rounded.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border
  },
  title: {
    marginBottom: Sizes.spacing.s9
  },
  taskList: {
    gap: Sizes.spacing.s11,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -1
  }
})
