import { useMemo } from 'react'
import { StyleSheet, View, FlatList, ListRenderItem, Pressable } from 'react-native'
import ProgressIcon from '@/components/icons/ProgressIcon'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon'
import CircleIcon from '@/components/icons/CircleIcon'
import Svg, { Circle } from 'react-native-svg'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { observer } from '@legendapp/state/react'
import useProjectTasks from '@/hooks/data/useProjectTasks'

const PriorityItem = ({ label, isCompleted, onCompleted }: { label: string, isCompleted: boolean, onCompleted: () => void }) => {
  return(
    <View style={styles.priorityItem}>
      <Pressable
        onPress={onCompleted}
        style={{
          flexDirection: 'row'
        }}
      >
        <View>
          {
            isCompleted
              ? <CheckCircleIcon size={19} color={Colors.secondary} />
              : <CircleIcon size={19} color={Colors.primary}/>
          }
        </View>
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
      </Pressable>
    </View>
  )
}

interface ProgressSummaryProps {
  label: string
  percent?: number
  count: number
  total?: number
  useIcon?: boolean
}

const ProgressSummary = ({ label, percent = 0, count, total = 0, useIcon = false }: ProgressSummaryProps) => {
  const radius = 25
  const strokeWidth = 3
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <View style={styles.progressSummary}>
      <View style={styles.circleProgressPlaceholder}>
        {useIcon ? (
          <ProgressIcon color={Colors.primary} />
        ) : (
          <>
            <Svg height={radius * 2} width={radius * 2}>
              <Circle
                stroke={Colors.background}
                fill='transparent'
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <Circle
                stroke={Colors.green}
                fill='transparent'
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap='round'
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                transform='rotate(-90, 25, 25)'
              />
            </Svg>
            <View style={styles.circleTextWrapper}>
              <Typo size={11} weight='700'>{`${percent}%`}</Typo>
            </View>
          </>
        )}
      </View>
      <View>
        <Typo size={13} weight='500' color='secondary'>{label}</Typo>
        <Typo size={15} weight='800'>
          {
            useIcon ? (
              <>{count} <Typo size={11} weight='500'>Task</Typo></>
            ) : (
              <>{count}/{total} <Typo size={11} weight='500'>Tasks</Typo></>
            )
          }
        </Typo>
      </View>
    </View>
  )
}

export default observer(function ProgressInfo () {
  const { tasks, updateTask, totalTasks } = useProjectTasks()

  const todayStart = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
  }, [])

  const todayEnd = useMemo(() => {
    const now = new Date()
    now.setHours(23, 59, 59, 999)
    return now
  }, [])

  const completedTodayLength = useMemo(() => {
    return tasks.filter(task => {
      const { status, updated_at } = task
      if (status !== 'completed') return false

      const completionDate = new Date(updated_at)
      return completionDate >= todayStart && completionDate <= todayEnd
    }).length
  }, [tasks, todayStart, todayEnd])

  const completedTasksLength = useMemo(() => {
    return tasks.filter(task => task.status === 'completed').length
  }, [tasks])

  const importantTasks = useMemo(() => {
    const result: { title: string, id: string, status: string }[] = []

    for (const task of tasks) {
      const { title, id, priority, due_date, status } = task
      const isHighPriority = priority?.toLowerCase() === 'high'

      let isDueToday = false
      if (due_date) {
        const due = new Date(due_date)
        due.setHours(0, 0, 0, 0)
        isDueToday = due.getTime() === todayStart.getTime()
      }

      if (isHighPriority || isDueToday) {
        result.push({ title, id, status })
        if (result.length === 4) break
      }
    }

    return result
  }, [tasks, todayStart])

  const renderPriority: ListRenderItem<{ title: string, id: string, status: string }> = ({ item }) => (
    <PriorityItem
      label={item.title}
      isCompleted={item.status === 'completed'}
      onCompleted={() => updateTask(item.id, { status: item.status === 'completed' ? 'pending' : 'completed' })}
    />
  )

  return (
    <View style={styles.container}>
      <Typo size={19} weight='500'>Your Progress</Typo>
      <View style={styles.content}>
        {/* Priority tasks */}
        <View style={styles.card}>
          <Typo
            size={15}
            weight='600'
            style={{ marginBottom: Sizes.spacing.s9 }}
          >
            Priority Tasks
          </Typo>
          <FlatList
            data={importantTasks}
            keyExtractor={(item) => item.id}
            renderItem={renderPriority}
            scrollEnabled={false}
            contentContainerStyle={{
              gap: Sizes.spacing.s11,
              flex: 1,
              justifyContent: 'space-between'
            }}
          />
        </View>

        {/* Progress indicators */}
        <View style={styles.indicatorContainer}>
          <ProgressSummary
            label='Completed'
            percent={totalTasks > 0 ? Math.round((completedTasksLength / totalTasks) * 100) : 0}
            count={completedTasksLength}
            total={totalTasks}
          />

          <ProgressSummary
            label='Done Today'
            useIcon
            count={completedTodayLength}
          />
        </View>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    marginTop: Sizes.spacing.s21
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizes.spacing.s13
  },
  card: {
    width: '49%',
    backgroundColor: Colors.card,
    padding: Sizes.spacing.s15,
    borderRadius: Shapes.rounded.md,
    borderWidth: 1,
    borderColor: Colors.border
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -1
  },
  indicatorContainer: {
    width: '49%',
    gap: Sizes.spacing.s9,
    justifyContent: 'space-between'
  },
  progressSummary: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: '9%',
    borderRadius: Shapes.rounded.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center'
  },
  circleProgressPlaceholder: {
    width: 53,
    height: 53,
    borderRadius: Shapes.rounded.circle,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.spacing.s9
  },
  circleTextWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 53,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
