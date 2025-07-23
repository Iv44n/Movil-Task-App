import { useCallback } from 'react'
import { StyleSheet, View, FlatList, ListRenderItem, Pressable } from 'react-native'
import Icon from '@/components/icons/Icon'
import Svg, { Circle } from 'react-native-svg'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { isToday } from '@/utils/date'
import { projects$ } from '@/store/projects.store'
import { Priority, StatusTask } from '@/constants/constants'
import { projectTasks$ } from '@/store/projectTasks.store'
import { use$ } from '@legendapp/state/react'
import useProgress from '@/hooks/data/useProgress'
import { batch } from '@legendapp/state'

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
              ? <Icon.CheckCircle size={19} color={Colors.secondary} />
              : <Icon.Circle size={19} color={Colors.primary}/>
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
          <Icon.Progress color={Colors.primary} />
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
              <>{count} <Typo size={11} weight='500'>{count === 1 ? 'Task' : 'Tasks'}</Typo></>
            ) : (
              <>{count}/{total} <Typo size={11} weight='500'>{total === 1 ? 'Task' : 'Tasks'}</Typo></>
            )
          }
        </Typo>
      </View>
    </View>
  )
}

type ListRenderItemProps = {
  title: string
  id: string
  status: string
  projectId: string
}

export default function ProgressInfo () {
  const projectTasks = use$(() => Object.values(projectTasks$.get() || {}))
  const { completed, completedToday } = useProgress()

  const importantTasks = use$(() => {
    const selected: {
      title: string
      id: string
      status: string
      projectId: string
    }[] = []
    let countToday = 0

    for (const t of projectTasks) {
      if (selected.length === 4) break

      if (countToday < 4 && t.due_date && t.priority?.toLowerCase() === Priority.HIGH && t.status === StatusTask.PENDING) {
        const due = new Date(t.due_date)
        if (isToday(due)) {
          selected.push({
            title: t.title,
            id: t.id,
            status: t.status,
            projectId: t.project_id
          })
          countToday++
          continue
        }
      }

      if (
        selected.length < 4 &&
        t.priority?.toLowerCase() === Priority.HIGH
      ) {
        selected.push({
          title: t.title,
          id: t.id,
          status: t.status,
          projectId: t.project_id
        })
      }
    }

    return selected
  })

  const handleCompleted = useCallback(({ id, prevStatus, projectId }: { id: string, prevStatus: string, projectId: string }) =>
    batch(() => {
      projectTasks$[id].status.set(
        prevStatus === StatusTask.COMPLETED
          ? StatusTask.PENDING
          : StatusTask.COMPLETED
      )

      projects$[projectId].completed_tasks
        .set(prevCompletedTasks =>
          prevCompletedTasks + (prevStatus === StatusTask.COMPLETED ? -1 : 1)
        )
    }), [])

  const renderPriority: ListRenderItem<ListRenderItemProps> = ({ item: { title, id, status, projectId } }) => (
    <PriorityItem
      label={title}
      isCompleted={status === StatusTask.COMPLETED}
      onCompleted={() => handleCompleted({ id, prevStatus: status, projectId })}
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
              justifyContent: 'flex-start'
            }}
          />
        </View>

        {/* Progress indicators */}
        <View style={styles.indicatorContainer}>
          <ProgressSummary
            label='Completed'
            percent={completed.percent}
            count={completed.count}
            total={completed.total}
          />

          <ProgressSummary
            label='Done Today'
            useIcon
            count={completedToday}
          />
        </View>
      </View>
    </View>
  )
}

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
