import { useForm, FormProvider } from 'react-hook-form'
import {
  Alert
} from 'react-native'
import { Colors } from '@/constants/theme'
import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '@/hooks/auth/useAuth'
import i18n from '@/i18n'
import { useDatabase } from '@nozbe/watermelondb/react'
import { Project } from '@/models'
import { TABLE_NAMES } from '@/lib/schema'
import FormModal from '../shared/FormModal'
import ProjectFormFields from './ProjectFormFields'

interface AddProjectModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

interface FormData {
  name: string
  description: string
  selectedColor: string
  selectedCategoryId: string | null
}

const PROJECT_COLORS = [
  Colors.green,
  Colors.yellow,
  '#F0E4CC',
  '#FFC9E3',
  '#C1E1C1',
  '#AEDFF7',
  '#FFE5B4',
  '#E8F1D4'
]

const AddProjectModal = ({ visible, onClose }: AddProjectModalProps) => {
  const router = useRouter()
  const db = useDatabase()
  const { user } = useAuth()

  const methods = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      selectedColor: PROJECT_COLORS[0],
      selectedCategoryId: null
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const handleClose = useCallback(() => {
    methods.reset()
    onClose()
  }, [methods, onClose])

  const onSubmit = useCallback(async (data: FormData) => {
    if (!user?.id) return
    const { selectedCategoryId, selectedColor, name, description } = data

    if (!selectedCategoryId) {
      return Alert.alert('Error', 'Category is required')
    }

    const projectsCollection = db.collections.get<Project>(TABLE_NAMES.PROJECTS)

    try {
      const newProject = await db.write(async () => {
        return await projectsCollection.create((project) => {
          project.userId = user.id
          project.name = name.trim()
          project.description = description.trim()
          project.color = selectedColor
          project.categoryId = selectedCategoryId
          project.progressPercentage = 0
        })
      })

      methods.reset()
      router.push(`project/${newProject.id}`)
      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create project'
      Alert.alert('Failed to create project', message)
      console.error('Failed to create project on component AddProjectModal', error)
    }
  }, [user?.id, db, methods, onClose, router])

  if (!user?.id) return null

  return (
    <FormProvider {...methods}>
      <FormModal
        visible={visible}
        onClose={handleClose}
        title={i18n.t('home.addProjectModal.title')}
        primaryActionText={i18n.t('home.addProjectModal.actions.create', {
          name: i18n.t('home.addProjectModal.form.project')
        })}
        onPrimaryAction={methods.handleSubmit(onSubmit)}
        secondaryActionText={i18n.t('home.addProjectModal.actions.cancel')}
        onSecondaryAction={handleClose}
        primaryActionColor={Colors.yellow}
        primaryActionTypoColor='black'
        secondaryActionTypoColor='primary'
      >
        <ProjectFormFields />
      </FormModal>
    </FormProvider>
  )
}

AddProjectModal.displayName = 'AddProjectModal'

export default AddProjectModal
