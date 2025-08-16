import { memo, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { StyleSheet } from 'react-native'
import { Sizes } from '@/constants/theme'
import i18n from '@/i18n'
import { Priority } from '@/constants/constants'
import FormModal from '../shared/FormModal'
import TaskFormFields from './TaskFormFields'

type FormDataForCreate = {
  title: string
  priority: Priority
  startDate: Date | null
  dueDate: Date | null
}

interface AddTaskModalProps {
  colorTheme: string
  visible: boolean
  onClose: () => void
  onAddTask: (task: FormDataForCreate) => void
}

const DEFAULT_VALUES: FormDataForCreate = {
  title: '',
  priority: Priority.MEDIUM,
  startDate: null,
  dueDate: null
}

export default memo(function AddTaskModal({ visible, onClose, onAddTask, colorTheme }: AddTaskModalProps) {
  const methods = useForm<FormDataForCreate>({
    defaultValues: DEFAULT_VALUES
  })

  const onCloseWithReset = useCallback(() => {
    methods.reset(DEFAULT_VALUES)
    onClose()
  }, [methods, onClose])

  const onSubmit = useCallback((data: FormDataForCreate) => {
    const taskData: FormDataForCreate = {
      title: data.title.trim(),
      priority: data.priority,
      startDate: data.startDate,
      dueDate: data.dueDate
    }

    onAddTask(taskData)
    methods.reset(DEFAULT_VALUES)
    onClose()
  }, [onAddTask, onClose, methods])

  return (
    <FormProvider {...methods}>
      <FormModal
        visible={visible}
        onClose={onCloseWithReset}
        title={i18n.t('projectDetails.addTaskModal.title')}
        primaryActionText={i18n.t('projectDetails.addTaskModal.create')}
        onPrimaryAction={methods.handleSubmit(onSubmit)}
        secondaryActionText={i18n.t('projectDetails.addTaskModal.cancel')}
        onSecondaryAction={onCloseWithReset}
        primaryActionColor={colorTheme}
        primaryActionTypoColor='black'
        secondaryActionTypoColor='secondary'
        contentContainerStyle={styles.scrollContent}
      >
        <TaskFormFields />
      </FormModal>
    </FormProvider>
  )
})

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Sizes.spacing.s15,
    paddingTop: Sizes.spacing.s15,
    paddingBottom: Sizes.spacing.s15
  }
})
