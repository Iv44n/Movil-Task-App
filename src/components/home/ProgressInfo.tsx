import { useCallback } from 'react'
import { StyleSheet, View, FlatList, ListRenderItem, TouchableOpacity } from 'react-native'
import Icon from '@/components/icons/Icon'
import Svg, { Circle } from 'react-native-svg'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { isToday } from '@/utils/date'
import { projectsStore$ } from '@/store/projects.store'
import { Priority, StatusTask } from '@/constants/constants'
import { projectTasksStore$ } from '@/store/projectTasks.store'
import { use$ } from '@legendapp/state/react'
import useProgress from '@/hooks/data/useProgress'
import { batch } from '@legendapp/state'
import { useAuth } from '@/hooks/auth/useAuth'
import i18n from '@/i18n'

const PriorityItem = ({ label, isCompleted, onCompleted }: { label: string, isCompleted: boolean, onCompleted: () => void }) => {
  return(
    <View style={styles.priorityItem}>
      <TouchableOpacity
        activeOpacity={0.8}
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
      </TouchableOpacity>
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
              <>{count} <Typo size={11} weight='500'>{count === 1 ? i18n.t('home.progressInfo.task') : i18n.t('home.progressInfo.tasks')}</Typo></>
            ) : (
              <>{count}/{total} <Typo size={11} weight='500'>{total === 1 ? i18n.t('home.progressInfo.task') : i18n.t('home.progressInfo.tasks')}</Typo></>
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
  const { completed, completedToday } = useProgress()
  const { user } = useAuth()
  const { projectTasks, updateProjectTask } = use$(() => projectTasksStore$(user?.id ?? ''))
  const { updateProject } = use$(() => projectsStore$(user?.id ?? ''))

  const importantTasks = use$(() => {
    const selected: {
      title: string
      id: string
      status: string
      projectId: string
    }[] = []
    let countToday = 0

    for (const t of Object.values(projectTasks)) {
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
      if (!updateProjectTask || !updateProject) return

      updateProjectTask(id, {
        status: prevStatus === StatusTask.COMPLETED
          ? StatusTask.PENDING
          : StatusTask.COMPLETED
      })

      const isPrevCompleted = prevStatus === StatusTask.COMPLETED

      updateProject(projectId, (prev) => ({
        completed_tasks: prev.completed_tasks + (isPrevCompleted ? -1 : 1)
      }))
    }), [updateProject, updateProjectTask])

  const renderPriority: ListRenderItem<ListRenderItemProps> = ({ item: { title, id, status, projectId } }) => (
    <PriorityItem
      label={title}
      isCompleted={status === StatusTask.COMPLETED}
      onCompleted={() => handleCompleted({ id, prevStatus: status, projectId })}
    />
  )

  return (
    <View style={styles.container}>
      <Typo size={19} weight='500'>{i18n.t('home.progressInfo.title')}</Typo>
      <View style={styles.content}>
        {/* Priority tasks */}
        <View style={styles.card}>
          <Typo
            size={15}
            weight='600'
            style={{ marginBottom: Sizes.spacing.s9 }}
          >
            {i18n.t('home.progressInfo.priorityTasks')}
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
            label={i18n.t('home.progressInfo.completed')}
            percent={completed.percent}
            count={completed.count}
            total={completed.total}
          />

          <ProgressSummary
            label={i18n.t('home.progressInfo.doneToday')}
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -1
  },
  indicatorContainer: {
    width: '49%',
    marginRight: 1,
    gap: Sizes.spacing.s9,
    justifyContent: 'space-between'
  },
  progressSummary: {
    flexDirection: 'row',
    paddingHorizontal: '8%',
    paddingVertical: '9%',
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Sizes.spacing.s9
  },
  circleProgressPlaceholder: {
    width: 53,
    height: 53,
    borderRadius: Shapes.rounded.circle,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center'
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
