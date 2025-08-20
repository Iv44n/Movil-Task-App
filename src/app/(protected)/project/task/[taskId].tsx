import { useLocalSearchParams, useRouter } from 'expo-router'
import Typo from '@/components/shared/Typo'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useEffect, useState, useMemo } from 'react'
import { Task } from '@/models'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TABLE_NAMES } from '@/lib/schema'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Sizes, Shapes } from '@/constants/theme'
import Icon from '@/components/icons/Icon'
import { CapitalizeWords } from '@/utils/utils'
import SubtaskList from '@/components/projectDetails/SubtaskList'
import i18n from '@/i18n'
import { Priority } from '@/constants/constants'

const getPriorityConfig = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return { color: Colors.error, icon: 'alert-circle', opacity: 0.1 }

    case 'medium':
      return { color: Colors.yellow, icon: 'time', opacity: 0.1 }

    case 'low':
      return { color: Colors.green, icon: 'checkmark-circle', opacity: 0.1 }

    default:
      return { color: Colors.secondary, icon: 'help-circle', opacity: 0.1 }
  }
}

const formatDate = (date?: Date | null) =>
  date
    ? date.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    : i18n.t('projectDetails.subTaskPage.info.notSetDate')

const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <View style={styles.loadingSpinner}>
      <Ionicons name='hourglass' size={24} color={Colors.secondary} />
    </View>
    <Typo size={16} color='secondary' style={{ marginTop: Sizes.spacing.s9 }}>
      Loading task...
    </Typo>
  </View>
)

const DateItem = ({ icon, label, date, color }: { icon: string; label: string; date?: Date | null; color: string }) => (
  <View style={styles.dateItem}>
    <View style={styles.dateIconContainer}>
      <Ionicons name={icon as any} color={color} size={19} />
    </View>
    <View>
      <Typo size={13} color='secondary' weight='500' style={styles.dateLabel}>
        {label}
      </Typo>
      <Typo size={13} weight='500' color='primary'>
        {formatDate(date)}
      </Typo>
    </View>
  </View>
)

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const { color, icon, opacity } = useMemo(() => getPriorityConfig(priority), [priority])
  const bgColor = `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`

  return (
    <View style={styles.priorityBadge}>
      <View style={[styles.priorityIconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={icon as any} color={color} size={17} />
      </View>
      <Typo size={15} weight='600' color='primary' style={styles.priorityText}>
        {CapitalizeWords(i18n.t(`priorityOptions.${priority}`))}
      </Typo>
    </View>
  )
}

export default function TaskScreen() {
  const { taskId } = useLocalSearchParams() as { taskId?: string }
  if (!taskId) throw new Error('Task ID is required')

  const db = useDatabase()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    const subscription = db.collections.get<Task>(TABLE_NAMES.TASKS).findAndObserve(taskId).subscribe(setTask)
    return () => subscription.unsubscribe()
  }, [taskId, db])

  if (!task) {
    return (
      <ScreenWrapper style={styles.container}>
        <LoadingView />
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} style={styles.headerButton} onPress={router.back}>
          <Icon.ArrowLeft size={23} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.headerButton}>
          <Ionicons name='create-outline' color={Colors.primary} size={23} />
        </TouchableOpacity>
      </View>

      <View>
        <View style={styles.titleContainer}>
          <Typo size={25} weight='700' color='primary'>
            {task.title}
          </Typo>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.datesContainer}>
            <DateItem
              icon='calendar-outline'
              label={i18n.t('projectDetails.subTaskPage.info.startDateLabel').toUpperCase()}
              date={task.startDate}
              color={Colors.primary}
            />
            <View style={styles.dateDivider} />
            <DateItem
              icon='flag-outline'
              label={i18n.t('projectDetails.subTaskPage.info.dueDateLabel').toUpperCase()}
              date={task.dueDate}
              color={Colors.error}
            />
          </View>

          <View style={styles.sectionDivider} />

          <View style={styles.priorityContainer}>
            <Typo size={13} color='secondary' weight='500' style={styles.priorityLabel}>
              {i18n.t('projectDetails.subTaskPage.info.priorityLabel').toUpperCase()}
            </Typo>
            <PriorityBadge priority={task.priority} />
          </View>
        </View>
      </View>

      <SubtaskList subtasksQuery={task.subtasks} taskId={taskId} />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingSpinner: {
    borderRadius: Shapes.rounded.circle,
    backgroundColor: Colors.card
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizes.spacing.s9
  },
  headerButton: {
    padding: Sizes.spacing.s9,
    borderRadius: Shapes.rounded.lg,
    backgroundColor: Colors.card
  },
  titleContainer: {
    marginBottom: Sizes.spacing.s21
  },
  infoCard: {
    padding: Sizes.spacing.s5
  },
  datesContainer: {
    flexDirection: 'row', alignItems: 'center'
  },
  dateItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.s11
  },
  dateIconContainer: {
    width: Sizes.width.w43,
    height: Sizes.height.h43,
    borderRadius: Shapes.rounded.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateLabel: {
    marginBottom: Sizes.spacing.s3,
    letterSpacing: 0.5
  },
  dateDivider: {
    width: StyleSheet.hairlineWidth,
    height: Sizes.height.h43,
    backgroundColor: Colors.border,
    marginHorizontal: Sizes.spacing.s11
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: Sizes.spacing.s11,
    marginHorizontal: -Sizes.spacing.s5
  },
  priorityContainer: {
    gap: Sizes.spacing.s9
  },
  priorityLabel: {
    letterSpacing: 0.5
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.s11
  },
  priorityIconContainer: {
    width: Sizes.width.w33,
    height: Sizes.height.h33,
    borderRadius: Shapes.rounded.circle,
    justifyContent: 'center',
    alignItems: 'center'
  },
  priorityText: { flex: 1 }
})
