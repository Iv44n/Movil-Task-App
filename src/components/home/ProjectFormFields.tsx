import { Controller, useFormContext } from 'react-hook-form'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Typo from '../shared/Typo'
import FormField from '../shared/FormField'
import { Colors, Sizes, Shapes } from '@/constants/theme'
import i18n from '@/i18n'
import Icon from '../icons/Icon'
import CategorySelector from '../home/CategorySelector'

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

const ProjectFormFields = () => {
  const { control, formState: { errors }, clearErrors } = useFormContext<FormData>()

  return (
    <>
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
    </>
  )
}

const styles = StyleSheet.create({
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
  }
})

export default ProjectFormFields
