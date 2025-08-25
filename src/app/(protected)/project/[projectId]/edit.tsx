import { useCallback, useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { FormProvider, useForm } from 'react-hook-form'
import { Project } from '@/models'
import { TABLE_NAMES } from '@/lib/schema'
import { Sizes } from '@/constants/theme'
import i18n from '@/i18n'
import ProjectFormFields from '@/components/home/ProjectFormFields'
import ActionButton from '@/components/shared/ActionButton'
import { useDatabase } from '@nozbe/watermelondb/react'
import Typo from '@/components/shared/Typo'
import ScreenWrapper from '@/components/ScreenWrapper'

interface FormData {
  name: string
  description: string
  selectedColor: string
  selectedCategoryId: string | null
}

export default function EditProject() {
  const db = useDatabase()
  const { projectId } = useLocalSearchParams<{ projectId: string }>()
  const [project, setProject] = useState<Project | null>(null)

  if (!projectId) {
    throw new Error('Project ID is required')
  }

  const methods = useForm<FormData>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  useEffect(() => {
    const subscription = db.collections
      .get<Project>(TABLE_NAMES.PROJECTS)
      .findAndObserve(projectId)
      .subscribe(setProject)

    return () => subscription.unsubscribe()
  }, [db, projectId])

  useEffect(() => {
    if (!project) return
    methods.reset({
      name: project.name,
      description: project.description,
      selectedColor: project.color,
      selectedCategoryId: project.categoryId
    })
  }, [project, methods])

  const onSubmit = useCallback(
    async ({ selectedCategoryId, selectedColor, name, description }: FormData) => {
      if (!project) return

      if (!selectedCategoryId) {
        return Alert.alert(i18n.t('errors.title'), i18n.t('errors.categoryRequired'))
      }

      try {
        await project.updateProject({
          name: name.trim(),
          description: description.trim(),
          color: selectedColor,
          categoryId: selectedCategoryId
        })

        router.back()
      } catch (error) {
        const message =
          error instanceof Error ? error.message : i18n.t('errors.updateProjectFailed')
        Alert.alert(i18n.t('errors.updateProjectFailed'), message)
        console.error('Failed to update project on EditProject', error)
      }
    },
    [project]
  )

  return (
    <ScreenWrapper>
      <FormProvider {...methods}>
        <View style={styles.header}>
          <Typo size={23} weight='700' color='primary'>
            {i18n.t('projectDetails.editProject.title')}
          </Typo>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.container}>
            <ProjectFormFields />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <ActionButton
            onPress={methods.handleSubmit(onSubmit)}
            style={[styles.footerButton, { backgroundColor: project?.color }]}
            typoProps={{ color: 'black' }}
          >
            {i18n.t('projectDetails.editProject.actions.update')}
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
