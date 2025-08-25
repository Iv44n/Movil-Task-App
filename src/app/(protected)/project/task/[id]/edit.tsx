import { useCallback, useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { FormProvider, useForm } from 'react-hook-form'
import { Project, Task } from '@/models'
import { TABLE_NAMES } from '@/lib/schema'
import { Sizes } from '@/constants/theme'
import i18n from '@/i18n'
import ActionButton from '@/components/shared/ActionButton'
import { useDatabase } from '@nozbe/watermelondb/react'
import Typo from '@/components/shared/Typo'
import ScreenWrapper from '@/components/ScreenWrapper'
import { Priority } from '@/constants/constants'
import TaskFormFields from '@/components/projectDetails/TaskFormFields'

interface FormData {
  title: string
  priority: Priority
  startDate: Date | null
  dueDate: Date | null
}

export default function EditTask() {
  const db = useDatabase()
  const { id: taskId } = useLocalSearchParams<{ id: string }>()
  const [task, setTask] = useState<Task | null>(null)
  const [project, setProject] = useState<Project | null>(null)

  if (!taskId) {
    throw new Error('Task ID is required')
  }

  const methods = useForm<FormData>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  useEffect(() => {
    const subscription = db.collections
      .get<Task>(TABLE_NAMES.TASKS)
      .findAndObserve(taskId)
      .subscribe(setTask)

    return () => subscription.unsubscribe()
  }, [db, taskId])

  useEffect(() => {
    if (!task) return
    const subscription = task.project.observe().subscribe(setProject)
    return () => subscription.unsubscribe()
  }, [task])

  useEffect(() => {
    if (!task) return
    methods.reset({
      title: task.title,
      priority: task.priority,
      startDate: task.startDate,
      dueDate: task.dueDate
    })
  }, [task, methods])

  const onSubmit = useCallback(
    async ({ title, priority, startDate, dueDate }: FormData) => {
      if (!task) return

      try {
        await db.write(async () => {
          await task.update(record => {
            record.title = title.trim()
            record.priority = priority
            record.startDate = startDate
            record.dueDate = dueDate
          })
        })

        router.back()
      } catch (error) {
        const message =
          error instanceof Error ? error.message : i18n.t('errors.updateTaskFailed')
        Alert.alert(i18n.t('errors.updateTaskFailed'), message)
        console.error('Failed to update task on EditTask', error)
      }
    },
    [task, db]
  )

  return (
    <ScreenWrapper>
      <FormProvider {...methods}>
        <View style={styles.header}>
          <Typo size={23} weight='700' color='primary'>
            {i18n.t('projectDetails.editTask.title')}
          </Typo>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.container}>
            <TaskFormFields />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <ActionButton
            onPress={methods.handleSubmit(onSubmit)}
            style={[styles.footerButton, { backgroundColor: project?.color }]}
            typoProps={{ color: 'black' }}
          >
            {i18n.t('projectDetails.editTask.actions.update')}
          </ActionButton>
        </View>
      </FormProvider>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: Sizes.spacing.s15,
    paddingHorizontal: Sizes.spacing.s7
  },
  scroll: {
    flex: 1,
    paddingHorizontal: Sizes.spacing.s7
  },
  container: {
    flex: 1,
    paddingBottom: Sizes.spacing.s55
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Sizes.spacing.s15,
    paddingVertical: Sizes.spacing.s15,
    paddingBottom: Sizes.spacing.s21,
    gap: Sizes.spacing.s15
  },
  footerButton: {
    flex: 1
  }
})
