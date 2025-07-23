import { useMemo } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import Typo from '../shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { CapitalizeWords } from '@/utils/utils'
import Icon from '../icons/Icon'
import Avatar from '../shared/Avatar'
import { format } from '@formkit/tempo'
import { isPast, isToday } from '@/utils/date'
import { ProjectTask } from '@/types/ProjectTask'
import { StatusTask } from '@/constants/constants'

interface Props {
  task: ProjectTask
  onPress?: () => void
  onChangeStatus?: (id: string) => void
  colorTheme?: string
}

const DATE_FORMAT = 'MMM D'
const LOCALE_DEFAULT = 'en-US'

export default function TaskItem({ task, onPress, colorTheme = Colors.primary, onChangeStatus }: Props) {
  const {
    title,
    description,
    priority,
    status,
    start_date,
    due_date
  } = task

  const formattedStart = useMemo(
    () => start_date && format(start_date, DATE_FORMAT, LOCALE_DEFAULT),
    [start_date]
  )
  const formattedDue = useMemo(
    () => due_date && format(due_date, DATE_FORMAT, LOCALE_DEFAULT),
    [due_date]
  )

  const startLabel = useMemo(() => {
    if (!start_date) return null
    if (isToday(start_date)) return 'Start Today'
    const verb = isPast(start_date) ? 'Started' : 'Start'
    return `${verb} ${formattedStart}`
  }, [start_date, formattedStart])

  const dueLabel = useMemo(() => {
    if (!due_date) return null
    if (isToday(due_date)) return 'Due Today'
    const verb = isPast(due_date) ? 'Overdue' : 'Due'
    return `${verb} ${formattedDue}`
  }, [due_date, formattedDue])

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.card}
    >
      <View style={styles.header}>
        <View>
          <Typo size={13} weight='500' color='secondary' style={styles.priority}>
            {CapitalizeWords(priority)}
          </Typo>
          <Typo size={20} weight='500' color='primary'>
            {title}
          </Typo>
        </View>

        <TouchableOpacity onPress={() => onChangeStatus?.(task.id)}>
          {status === StatusTask.COMPLETED ? (
            <Icon.CheckCircle size={31} color={colorTheme} />
          ) : (
            <Icon.Circle size={31} color={colorTheme} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.chipContainer}>
        {startLabel && (
          <View style={[styles.chip, { backgroundColor: colorTheme + '15' }]}>
            <Typo size={13} weight='500' forceColor={colorTheme}>
              {startLabel}
            </Typo>
          </View>
        )}
        {dueLabel && (
          <View style={styles.chipError}>
            <Typo size={13} weight='500' color='error'>
              {dueLabel}
            </Typo>
          </View>
        )}
      </View>

      {description && (
        <Typo
          size={14}
          color='secondary'
          numberOfLines={2}
          ellipsizeMode='tail'
          style={styles.description}
        >
          {description}
        </Typo>
      )}

      <View style={styles.footer}>
        {/* to-do: implementar avatar de usuario que participan en la tarea */}
        <View style={styles.avatarGroup}>
          {[1, 2, 3].map((user) => (
            <View key={user} style={styles.avatarWrapper}>
              <Avatar size={31} uri={`https://i.pravatar.cc/150?u=${user}`} />
            </View>
          ))}
        </View>

        <View style={styles.commentsContainer}>
          <Icon.ChatLine size={21} />
          <Typo size={13} weight='500' color='secondary' style={styles.commentsText}>
            <Typo size={15} weight='600'>
              2
            </Typo>
            {'  '}Comments
          </Typo>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.md,
    padding: Sizes.spacing.s15,
    marginBottom: Sizes.spacing.s11
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priority: {
    marginBottom: Sizes.spacing.s3
  },
  chipContainer: {
    flexDirection: 'row',
    marginVertical: Sizes.spacing.s5
  },
  chip: {
    borderRadius: Shapes.rounded.sm,
    paddingHorizontal: Sizes.spacing.s15,
    paddingVertical: Sizes.spacing.s5,
    marginRight: Sizes.spacing.s11
  },
  chipError: {
    backgroundColor: Colors.error + '15',
    borderRadius: Shapes.rounded.sm,
    paddingHorizontal: Sizes.spacing.s15,
    paddingVertical: Sizes.spacing.s5,
    marginRight: Sizes.spacing.s11
  },
  description: {
    marginVertical: Sizes.spacing.s5
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Sizes.spacing.s21
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarWrapper: {
    marginRight: -Sizes.spacing.s7
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.s5
  },
  commentsText: {
    marginBottom: Sizes.spacing.s3
  }
})
