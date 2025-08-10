import { Controller, useForm } from 'react-hook-form'
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Typo from '../shared/Typo'
import ActionButton from '../shared/ActionButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCallback } from 'react'
import FormField from '../shared/FormField'
import { useRouter } from 'expo-router'
import CategorySelector from '@/components/home/CategorySelector'
import Icon from '@/components/icons/Icon'
import { Memo, use$ } from '@legendapp/state/react'
import { projectsStore$ } from '@/store/projects.store'
import { useAuth } from '@/hooks/auth/useAuth'
import i18n from '@/i18n'

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

export function AddProjectModal({ visible, onClose }: AddProjectModalProps) {
  const router = useRouter()
  const { user } = useAuth()

  const { createProject } = use$(() => projectsStore$(user?.id || ''))

  const { control, handleSubmit, reset, formState: { errors }, clearErrors } = useForm<FormData>({
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
    reset()
    onClose()
  }, [reset, onClose])

  const onSubmit = useCallback((data: FormData) => {
    if (!createProject || !user?.id) return
    const { selectedCategoryId, selectedColor, name, description } = data

    if (!selectedCategoryId) {
      return Alert.alert('Error', 'Category is required')
    }

    try {
      const newProject = createProject({
        name: name.trim(),
        description: description.trim() || undefined,
        category_id: selectedCategoryId,
        color: selectedColor
      })

      reset()
      onClose()
      router.replace(`project/${newProject.id}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create project'
      Alert.alert('Failed to create project', message)
      console.error('Failed to create project on component AddProjectModal', error)
    }
  }, [user?.id, createProject, reset, onClose, router])

  if (!user?.id) return null

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
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIndicator} />
            <View style={styles.headerTitleContainer}>
              <Typo size={18} weight='600' style={styles.headerTitle}>
                {i18n.t('home.addProjectModal.title')}
              </Typo>
              <TouchableOpacity
                onPress={handleClose}
                style={{ marginTop: 1 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon.Close size={21} color={Colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={styles.scrollContent}
        >
          {/* Project Name */}
          <View>
            <Controller
              name='name'
              control={control}
              rules={{
                required: i18n.t('home.addProjectModal.form.errors.projectNameRequired'),
                minLength: { value: 3, message: i18n.t('home.addProjectModal.form.errors.projectNameMinLength') },
                maxLength: { value: 100, message: i18n.t('home.addProjectModal.form.errors.projectNameMaxLength') }
              }}
              render={({ field: { onChange, value } }) => (
                <FormField
                  label={i18n.t('home.addProjectModal.form.projectName')}
                  placeholder={i18n.t('home.addProjectModal.form.projectNamePlaceholder')}
                  value={value}
                  error={errors.name?.message}
                  onChangeText={(value) => {
                    onChange(value)
                    clearErrors('name')
                  }}
                  maxLength={100}
                />
              )}
            />
          </View>

          {/* Description */}
          <View>
            <Controller
              name='description'
              control={control}
              rules={{
                maxLength: { value: 500, message: i18n.t('home.addProjectModal.form.errors.descriptionMaxLength') }
              }}
              render={({ field: { onChange, value } }) => (
                <FormField
                  label={i18n.t('home.addProjectModal.form.description')}
                  placeholder={i18n.t('home.addProjectModal.form.descriptionPlaceholder')}
                  value={value}
                  error={errors.description?.message}
                  onChangeText={(value) => {
                    onChange(value)
                    clearErrors('description')
                  }}
                  multiline
                  maxLength={500}
                  style={styles.textArea}
                />
              )}
            />
          </View>

          {/* Category */}
          <View>
            <Memo>
              <Controller
                name='selectedCategoryId'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CategorySelector
                    selectedCategoryId={value}
                    onSelect={onChange}
                  />
                )}
              />
            </Memo>
          </View>

          {/* Color Selection */}
          <View>
            <Controller
              name='selectedColor'
              control={control}
              rules={{ required: i18n.t('home.addProjectModal.form.errors.projectColorRequired') }}
              render={({ field: { onChange, value } }) => (
                <View>
                  <Typo size={14} weight='600' style={styles.sectionTitle}>
                    {i18n.t('home.addProjectModal.form.projectColor')}
                  </Typo>
                  <View style={styles.colorGrid}>
                    {PROJECT_COLORS.map((color) => {
                      const isSelected = value === color
                      return (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color }
                          ]}
                          onPress={() => onChange(color)}
                          activeOpacity={0.7}
                        >
                          {isSelected && (
                            <View style={styles.colorCheckContainer}>
                              <Icon.Check size={21} color={Colors.black} />
                            </View>
                          )}
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>
              )}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <ActionButton
            style={[styles.footerButton, { backgroundColor: Colors.card }]}
            onPress={handleClose}
            typoProps={{ color: 'primary', weight: '500' }}
          >
            {i18n.t('home.addProjectModal.actions.cancel')}
          </ActionButton>

          <ActionButton
            style={styles.footerButton}
            onPress={handleSubmit(onSubmit)}
            typoProps={{ color: 'black', weight: '700' }}
          >
            {i18n.t('home.addProjectModal.actions.create', {
              name: i18n.t('home.addProjectModal.form.project')
            })}
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
  scrollContent: {
    paddingHorizontal: Sizes.spacing.s21,
    paddingTop: Sizes.spacing.s21,
    paddingBottom: Sizes.spacing.s15
  },
  sectionTitle: {
    marginBottom: Sizes.spacing.s15,
    color: Colors.primary
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: Sizes.spacing.s13
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.spacing.s11,
    justifyContent: 'space-between'
  },
  colorOption: {
    width: Sizes.spacing.s33,
    height: Sizes.spacing.s33,
    borderRadius: Shapes.rounded.circle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  colorCheckContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: Shapes.rounded.circle,
    width: Sizes.spacing.s21,
    height: Sizes.spacing.s21,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Sizes.spacing.s17,
    paddingVertical: Sizes.spacing.s15,
    gap: Sizes.spacing.s9
  },
  footerButton: {
    width: '49%'
  }
})
