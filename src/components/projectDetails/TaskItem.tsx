import { memo, useCallback, useMemo } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import Typo from '../shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { CapitalizeWords } from '@/utils/utils'
import Icon from '../icons/Icon'
import { format, isPast, isToday } from '@/utils/date'
import TaskChip from './TaskChip'
import ProgressBar from '../shared/ProgressBar'
import i18n from '@/i18n'

interface Props {
  id: string
  title: string
  priority: string
  startDate: Date | null
  dueDate: Date | null
  colorTheme: string
  progressPercentage: number
}

const DATE_FORMAT = 'MMM D'
const LOCALE_DEFAULT = i18n.locale

export default memo(function TaskItem({
  id,
  title,
  priority,
  startDate,
  dueDate,
  progressPercentage,
  colorTheme = Colors.primary
}: Props) {
  const router = useRouter()
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
      onPress={() => router.push(`/project/task/${id}`)}
      activeOpacity={0.7}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={{ maxWidth: '85%' }}>
          <Typo size={13} weight='400' color='secondary' style={styles.priority}>
            {CapitalizeWords(i18n.t(`priorityOptions.${priority}`))}
          </Typo>
          <Typo
            size={21}
            weight='500'
            color='primary'
            ellipsizeMode='tail'
            numberOfLines={2}
          >
            {title}
          </Typo>
        </View>

        <TouchableOpacity
          onPress={() => console.log('show options')}
          activeOpacity={0.7}
          style={styles.iconBtn}
        >
          <Icon.HorizontalDotMenu size={23} style={{ marginTop: 0.5, marginRight: 0.8 }}/>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: Sizes.spacing.s11, marginBottom: Sizes.spacing.s7 }}>
        <Typo size={12} weight='400' color='secondary'>
          {i18n.t('projectDetails.taskCard.progress')}
        </Typo>
        <ProgressBar
          progress={progressPercentage}
          progressBarBackground={Colors.border}
          progressBarFill={Colors.primary}
          progressTextColor={Colors.primary}
          maxWidth='40%'
        />
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
  iconBtn: {
    marginBottom: 'auto',
    padding: Sizes.spacing.s9,
    borderRadius: Shapes.rounded.circle,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.border + '40'
  }
})
