import { Controller, useForm } from 'react-hook-form'
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView
} from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Typo from '../shared/Typo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCallback } from 'react'
import FormField from '../shared/FormField'
import Icon from '../icons/Icon'
import { InsertProjectTaskForForm } from '@/types/ProjectTask'
import i18n from '@/i18n'
import ActionButton from '../shared/ActionButton'

interface AddTaskModalProps {
  readonly colorTheme: string;
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onAddTask: (task: Omit<InsertProjectTaskForForm, 'project_id'>) => void;
}

type FormData = {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  due_date: string
  start_date: string
}

const PRIORITY_CONFIG = {
  low: { color: '#10B981' },
  medium: { color: Colors.yellow },
  high: { color: '#EF4444' }
} as const

export default function AddTaskModal({ visible, onClose, onAddTask, colorTheme }: AddTaskModalProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      start_date: ''
    }
  })

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  const onSubmit = useCallback((data: FormData) => {
    const taskData = {
      title: data.title.trim(),
      description: data.description.trim() || undefined,
      priority: data.priority,
      start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
      due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined
    }
    onAddTask(taskData)
    reset()
    onClose()
  }, [onAddTask, onClose, reset])

  return (
    <Modal
      visible={visible}
      animationType='slide'
      hardwareAccelerated
      presentationStyle='pageSheet'
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIndicator} />
            <View style={styles.headerTitleContainer}>
              <Typo size={18} weight='600' style={styles.headerTitle}>
                {i18n.t('projectDetails.addTaskModal.title')}
              </Typo>
              <TouchableOpacity
                onPress={handleClose}
                style={{ marginTop: 1 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon.Close size={20} color={Colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
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
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => {
                    const isSelected = value === key
                    return (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.priorityCard,
                          isSelected && {
                            backgroundColor: config.color + '15',
                            borderColor: config.color
                          }
                        ]}
                        onPress={() => onChange(key)}
                        activeOpacity={0.7}
                      >
                        <Typo
                          size={14}
                          weight={isSelected ? '600' : '500'}
                          color={isSelected ? 'primary' : 'secondary'}
                          forceColor={isSelected ? config.color : undefined}
                          style={{ textAlign: 'center' }}
                        >
                          {i18n.t(`projectDetails.addTaskModal.priorityOptions.${key}`)}
                        </Typo>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}
            />
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Controller
              name='description'
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormField
                  label={i18n.t('projectDetails.addTaskModal.descriptionLabel')}
                  placeholder={i18n.t('projectDetails.addTaskModal.descriptionPlaceholder')}
                  value={value}
                  onChangeText={onChange}
                  multiline
                  style={styles.textArea}
                />
              )}
            />
          </View>

          {/* Date Fields */}
          <View style={styles.dateRow}>
            <Controller
              name='start_date'
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.dateField}>
                  <FormField
                    label={i18n.t('projectDetails.addTaskModal.startDateLabel')}
                    placeholder={i18n.t('projectDetails.addTaskModal.startDatePlaceholder')}
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />

            <Controller
              name='due_date'
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.dateField}>
                  <FormField
                    label={i18n.t('projectDetails.addTaskModal.dueDateLabel')}
                    placeholder={i18n.t('projectDetails.addTaskModal.dueDatePlaceholder')}
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <ActionButton
            onPress={handleClose}
            typoProps={{ color: 'secondary' }}
            style={[styles.footerButton, { backgroundColor: Colors.card }]}
          >
            {i18n.t('projectDetails.addTaskModal.cancel')}
          </ActionButton>
          <ActionButton
            onPress={handleSubmit(onSubmit)}
            style={[styles.footerButton, { backgroundColor: colorTheme }]}
          >
            {i18n.t('projectDetails.addTaskModal.create')}
          </ActionButton>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  header: {
    paddingTop: Sizes.spacing.s9,
    paddingBottom: Sizes.spacing.s13
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.s21
  },
  headerIndicator: {
    width: Sizes.spacing.s33,
    height: Sizes.spacing.s3,
    backgroundColor: Colors.border,
    borderRadius: Shapes.rounded.md,
    marginBottom: Sizes.spacing.s13
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginLeft: Sizes.spacing.s13
  },
  content: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: Sizes.spacing.s15,
    paddingTop: Sizes.spacing.s15,
    paddingBottom: Sizes.spacing.s15
  },
  label: {
    marginBottom: Sizes.spacing.s5
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: Sizes.spacing.s91
  },
  descriptionContainer: {
    marginTop: Sizes.spacing.s15
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: Sizes.spacing.s11
  },
  priorityCard: {
    flex: 1,
    padding: Sizes.spacing.s9,
    borderRadius: Shapes.rounded.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    alignItems: 'center'
  },
  dateRow: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: Sizes.spacing.s9
  },
  dateField: {
    width: '49%'
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Sizes.spacing.s15,
    paddingVertical: Sizes.spacing.s15,
    paddingBottom: Sizes.spacing.s21,
    gap: Sizes.spacing.s15
  },
  footerButton: {
    width: '49%'
  }
})
