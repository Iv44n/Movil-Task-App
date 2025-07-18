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
import ActionButton from '../shared/ActionButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCallback, useState } from 'react'
import FormField from '../shared/FormField'
import useProjects from '@/hooks/data/useProjects'
import { useRouter } from 'expo-router'
import CategorySelector from '@/components/home/CategorySelector'
import { Database } from '@/lib/database.types'
import Icon from '@/components/icons/Icon'

interface AddProjectModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

interface FormData {
  name: string;
  description: string;
  selectedColor: string;
}

type Category = Database['public']['Tables']['categories']['Row']

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
  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      selectedColor: PROJECT_COLORS[0]
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const { createProject } = useProjects()

  const onSubmit = useCallback(
    (data: FormData) => {
      if (!selectedCategory) return

      const project = createProject({
        name: data.name.trim(),
        description: data.description.trim() ?? null,
        category_id: selectedCategory.id,
        color: data.selectedColor
      })

      router.navigate(`project/${project?.id}`)
      onClose()
    },
    [onClose, createProject, router, selectedCategory]
  )

  return (
    <Modal
      visible={visible}
      animationType='slide'
      hardwareAccelerated
      presentationStyle='pageSheet'
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Typo size={19} weight='600'>Create New Project</Typo>
          <TouchableOpacity onPress={onClose}>
            <Icon.Close />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Controller
            name='name'
            control={control}
            rules={{
              required: 'Name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters long' }
            }}
            render={({ field: { onChange, value } }) => (
              <FormField
                label='Project Name'
                placeholder='Enter project name'
                value={value}
                error={errors.name?.message}
                onChangeText={(value) => {
                  onChange(value)
                  clearErrors('name')
                }}
              />
            )}
          />

          <Controller
            name='description'
            control={control}
            rules={{
              maxLength: { value: 200, message: 'Description must be at most 200 characters long' }
            }}
            render={({ field: { onChange, value } }) => (
              <FormField
                label='Description'
                placeholder='Add project description (optional)'
                value={value}
                error={errors.description?.message}
                onChangeText={(value) => {
                  onChange(value)
                  clearErrors('description')
                }}
                multiline
                style={{
                  height: Sizes.height.h99,
                  textAlignVertical: 'top'
                }}
              />
            )}
          />

          <CategorySelector
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <Controller
            name='selectedColor'
            control={control}
            rules={{ required: 'Color is required' }}
            render={({ field: { onChange, value } }) => (
              <View>
                <Typo size={15} weight='600'>Project Color</Typo>
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
                      >
                        {isSelected && <Icon.Check size={37} color={Colors.black} />}
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            )}
          />
        </ScrollView>

        <View style={styles.footer}>
          <ActionButton
            style={styles.cancelButton}
            label='Cancel'
            typoProps={{ color: 'primary', size: 15 }}
            onPress={onClose}
          />
          <ActionButton
            style={styles.submitButton}
            label='Create Project'
            typoProps={{ size: 15 }}
            onPress={handleSubmit(onSubmit)}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizes.spacing.s17,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  content: {
    flex: 1,
    padding: Sizes.spacing.s15
  },
  colorGrid: {
    marginTop: Sizes.spacing.s9,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.spacing.s9
  },
  colorOption: {
    width: Sizes.width.w33,
    height: Sizes.height.h33,
    borderRadius: Shapes.rounded.circle,
    marginBottom: '40%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    flexDirection: 'row',
    padding: Sizes.spacing.s15,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Sizes.spacing.s9,
    justifyContent: 'center'
  },
  cancelButton: {
    width: '49%',
    alignItems: 'center',
    backgroundColor: Colors.card
  },
  submitButton: {
    width: '49%',
    alignItems: 'center'
  }
})
