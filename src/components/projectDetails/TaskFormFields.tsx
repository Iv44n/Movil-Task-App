import { Controller, useFormContext } from 'react-hook-form'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Typo from '../shared/Typo'
import FormField from '../shared/FormField'
import { Priority } from '@/constants/constants'
import { Sizes, Colors, Shapes } from '@/constants/theme'
import { memo, useCallback, useMemo } from 'react'
import i18n from '@/i18n'

type FormDataForCreate = {
  title: string
  priority: Priority
  startDate: Date | null
  dueDate: Date | null
}

const PRIORITY_CONFIG: Record<Priority, { color: string }> = {
  [Priority.LOW]: { color: '#10B981' },
  [Priority.MEDIUM]: { color: Colors.yellow },
  [Priority.HIGH]: { color: '#EF4444' }
}

function formatDateOnly(date: Date | null) {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

type PriorityOptionProps = {
  value: Priority
  selected: boolean
  color: string
  label: string
  onPress: (value: Priority) => void
}

const PriorityOption = memo(function PriorityOption({
  value,
  selected,
  color,
  label,
  onPress
}: PriorityOptionProps) {
  const handlePress = useCallback(() => onPress(value), [onPress, value])
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.priorityCard,
        selected && {
          backgroundColor: color + '15',
          borderColor: color
        }
      ]}
    >
      <Typo
        size={14}
        weight={selected ? '600' : '500'}
        color={selected ? 'primary' : 'secondary'}
        forceColor={selected ? color : undefined}
        style={{ textAlign: 'center' }}
      >
        {label}
      </Typo>
    </TouchableOpacity>
  )
})

const TaskFormFields = memo(function TaskFormFields() {
  const { control, formState: { errors } } = useFormContext<FormDataForCreate>()

  const priorityEntries = useMemo(() => Object.entries(PRIORITY_CONFIG) as [Priority, { color: string }][], [])

  return (
    <>
      {/* Task Title */}
      <View>
        <Controller
          name='title'
          control={control}
          rules={{ required: i18n.t('projectDetails.addTaskModal.taskTitleRequired') }}
          render={({ field: { onChange, value } }) => (
            <FormField
              label={i18n.t('projectDetails.addTaskModal.taskTitleLabel')}
              placeholder={i18n.t('projectDetails.addTaskModal.taskTitlePlaceholder')}
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
            />
          )}
        />
      </View>

      {/* Priority Selection */}
      <View>
        <Typo size={14} weight='600' style={styles.label}>
          {i18n.t('projectDetails.addTaskModal.priorityLabel')}
        </Typo>
        <Controller
          name='priority'
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.priorityGrid}>
              {priorityEntries.map(([key, config]) => {
                const isSelected = value === key
                return (
                  <PriorityOption
                    key={key}
                    value={key}
                    selected={isSelected}
                    color={config.color}
                    label={i18n.t(`projectDetails.addTaskModal.priorityOptions.${key}`)}
                    onPress={(v) => onChange(v)}
                  />
                )
              })}
            </View>
          )}
        />
      </View>

      {/* Date Fields */}
      <View style={styles.dateRow}>
        <Controller
          name='startDate'
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.dateField}>
              <FormField
                label={i18n.t('projectDetails.addTaskModal.startDateLabel')}
                placeholder={i18n.t('projectDetails.addTaskModal.startDatePlaceholder')}
                value={formatDateOnly(value)}
                onChangeText={(text) => onChange(text ? new Date(text) : null)}
              />
            </View>
          )}
        />

        <Controller
          name='dueDate'
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.dateField}>
              <FormField
                label={i18n.t('projectDetails.addTaskModal.dueDateLabel')}
                placeholder={i18n.t('projectDetails.addTaskModal.dueDatePlaceholder')}
                value={formatDateOnly(value)}
                onChangeText={(text) => onChange(text ? new Date(text) : null)}
              />
            </View>
          )}
        />
      </View>
    </>
  )
})

const styles = StyleSheet.create({
  label: {
    marginBottom: Sizes.spacing.s5
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: Sizes.spacing.s11
  },
  priorityCard: {
    flex: 1,
    padding: Sizes.spacing.s9,
    borderRadius: Shapes.rounded.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignItems: 'center'
  },
  dateRow: {
    marginTop: Sizes.spacing.s15,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: Sizes.spacing.s9
  },
  dateField: {
    width: '49%'
  }
})

export default TaskFormFields
