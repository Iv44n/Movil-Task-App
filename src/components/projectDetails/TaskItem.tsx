import { memo, useCallback, useMemo } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import Typo from '../shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { CapitalizeWords } from '@/utils/utils'
import Icon from '../icons/Icon'
import { format, isPast, isToday } from '@/utils/date'
import { StatusTask } from '@/constants/constants'
import TaskChip from './TaskChip'

interface Props {
  id: string
  title: string
  priority: string
  startDate: Date | null
  dueDate: Date | null
  status: StatusTask
  onPressCard?: () => void
  handleStatusChange: (taskId: string) => void
  colorTheme: string
  commentCount?: number
}

const DATE_FORMAT = 'MMM D'
const LOCALE_DEFAULT = 'en-US'

export default memo(function TaskItem({
  id,
  title,
  priority,
  startDate,
  dueDate,
  onPressCard,
  colorTheme = Colors.primary,
  status,
  handleStatusChange,
  commentCount = 0
}: Props) {
  const formatDate = useCallback((date: Date | null) => {
    return date ? format(date, { format: DATE_FORMAT, locale: LOCALE_DEFAULT }) : null
  }, [])

  const getDateLabel = useCallback((date: Date | null, type: 'start' | 'due') => {
    if (!date) return null

    const isDateToday = isToday(date)
    const isDatePast = isPast(date)

    if (isDateToday) {
      return type === 'start' ? 'Start Today' : 'Due Today'
    }

    const formatted = formatDate(date)
    if (type === 'start') {
      return `${isDatePast ? 'Started' : 'Start'} ${formatted}`
    }
    return `${isDatePast ? 'Overdue' : 'Due'} ${formatted}`
  }, [formatDate])

  const startLabel = useMemo(() => getDateLabel(startDate, 'start'), [startDate, getDateLabel])
  const dueLabel = useMemo(() => getDateLabel(dueDate, 'due'), [dueDate, getDateLabel])

  return (
    <TouchableOpacity
      onPress={onPressCard}
      activeOpacity={0.7}
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

        <TouchableOpacity onPress={() => handleStatusChange(id)}>
          {status === StatusTask.COMPLETED ? (
            <Icon.CheckCircle size={31} color={colorTheme} />
          ) : (
            <Icon.Circle size={31} color={colorTheme} />
          )}
        </TouchableOpacity>
      </View>

      {(startLabel || dueLabel) && (
        <View style={styles.chipContainer}>
          {startLabel && (
            <TaskChip
              text={startLabel}
              backgroundColor={colorTheme + '15'}
              color={colorTheme}
            />
          )}
          {dueLabel && (
            <TaskChip
              text={dueLabel}
              backgroundColor={Colors.error + '15'}
              color={Colors.error}
            />
          )}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.commentsContainer}>
          <Icon.ChatLine size={21} />
          <Typo size={13} weight='500' color='secondary' style={styles.commentsText}>
            <Typo size={15} weight='600'>{commentCount}</Typo>
            {' Comments'}
          </Typo>
        </View>
      </View>
    </TouchableOpacity>
  )
})

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
  },
  incompleteIcon: {
    opacity: 0.3
  }
})
