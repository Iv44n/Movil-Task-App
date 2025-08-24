import { memo, useCallback, useMemo } from 'react'
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'
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
  isOptionsOpen: boolean
  onOpenOptions: (id: string) => void
  onCloseOptions: () => void
  deleteTask: (id: string) => void
  style?: StyleProp<ViewStyle>
}

const DATE_FORMAT = 'MMM D'

enum TYPE_DATE {
  START = 'start',
  DUE = 'due'
}

enum TASK_OPTIONS {
  EDIT = 'edit',
  DELETE = 'delete'
}

export default memo(function TaskItem({
  id,
  title,
  priority,
  startDate,
  dueDate,
  progressPercentage,
  colorTheme = Colors.primary,
  isOptionsOpen,
  onOpenOptions,
  onCloseOptions,
  deleteTask,
  style
}: Props) {
  const LOCALE_DEFAULT = i18n.locale

  const router = useRouter()
  const formatDate = useCallback((date: Date) => {
    return format(date, { format: DATE_FORMAT, locale: LOCALE_DEFAULT })
  }, [LOCALE_DEFAULT])

  const getDateLabel = useCallback((date: Date | null, type: TYPE_DATE) => {
    if (!date) return null

    const isDateToday = isToday(date)
    const isDatePast = isPast(date)

    if (isDateToday) {
      return type === TYPE_DATE.START
        ? i18n.t('projectDetails.dateLabels.startToday')
        : i18n.t('projectDetails.dateLabels.dueToday')
    }

    const formatted = CapitalizeWords(formatDate(date))

    if (type === TYPE_DATE.START) {
      return isDatePast
        ? i18n.t('projectDetails.dateLabels.started', { date: formatted })
        : i18n.t('projectDetails.dateLabels.start', { date: formatted })
    }

    return isDatePast
      ? i18n.t('projectDetails.dateLabels.overdue', { date: formatted })
      : i18n.t('projectDetails.dateLabels.due', { date: formatted })
  }, [formatDate])

  const startLabel = useMemo(() => getDateLabel(startDate, TYPE_DATE.START), [startDate, getDateLabel])
  const dueLabel = useMemo(() => getDateLabel(dueDate, TYPE_DATE.DUE), [dueDate, getDateLabel])

  const handleToggleOptions = useCallback(() => {
    if (isOptionsOpen) {
      onCloseOptions()
    } else {
      onOpenOptions(id)
    }
  }, [isOptionsOpen, onCloseOptions, onOpenOptions, id])

  const handleNavigate = useCallback(() => {
    onCloseOptions()
    router.push(`/project/task/${id}`)
  }, [router, id, onCloseOptions])

  const taskOptions = useMemo(() => [
    {
      type: TASK_OPTIONS.EDIT,
      label: i18n.t('projectDetails.taskOptions.edit'),
      icon: <Icon.PenNewSquare size={16} color={Colors.primary} />
    },
    {
      type: TASK_OPTIONS.DELETE,
      label: i18n.t('projectDetails.taskOptions.delete'),
      icon: <Icon.Trash size={16} color={Colors.error}/>
    }
  ], [])

  const handleOptionPress = useCallback((option: TASK_OPTIONS) => {
    onCloseOptions()

    if (option === TASK_OPTIONS.EDIT) {
      router.push(`/project/task/${id}/edit`)
    }

    if (option === TASK_OPTIONS.DELETE) {
      deleteTask(id)
    }

  }, [router, id, onCloseOptions, deleteTask])

  return (
    <TouchableOpacity
      onPress={handleNavigate}
      activeOpacity={0.7}
      style={[styles.card, style]}
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
          onPress={handleToggleOptions}
          activeOpacity={0.7}
          style={styles.iconBtn}
        >
          <Icon.HorizontalDotMenu size={23} style={{ marginTop: 0.5, marginRight: 0.8 }}/>
        </TouchableOpacity>

        {isOptionsOpen && (
          <View style={styles.taskItemOption}>
            {taskOptions.map((option, index) =>(
              <TouchableOpacity
                key={option.type}
                activeOpacity={0.6}
                style={[
                  styles.optionItem,
                  index !== taskOptions.length - 1 && styles.optionDivider
                ]}
                onPress={() => handleOptionPress(option.type)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {option.icon}
                  <Typo
                    size={13}
                    weight='500'
                    color='primary'
                    style={{ marginLeft: Sizes.spacing.s9 }}
                  >
                    {option.label}
                  </Typo>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
  },
  taskItemOption: {
    zIndex: 10,
    position: 'absolute',
    right: 0,
    top: 50,
    backgroundColor: Colors.background,
    borderRadius: Shapes.rounded.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    minWidth: '55%'
  },
  optionItem: {
    borderRadius: Shapes.rounded.md,
    paddingVertical: Sizes.spacing.s11,
    paddingHorizontal: Sizes.spacing.s11,
    backgroundColor: Colors.background
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  }

})
