import { memo, useCallback, useState } from 'react'
import {
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Alert
} from 'react-native'
import Picker from '@/components/shared/Picker'
import Typo from '@/components/shared/Typo'
import FormField from '@/components/shared/FormField'
import ActionButton from '@/components/shared/ActionButton'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Icon from '@/components/icons/Icon'
import { categoriesStore$ } from '@/store/categories.store'
import { use$ } from '@legendapp/state/react'
import { useAuth } from '@/hooks/auth/useAuth'
import i18n from '@/i18n'

interface CategorySelectorProps {
  onSelect: (category: string | null) => void
  selectedCategoryId: string | null
}

const NEW_VALUE = '__NEW__'

const AddCategoryModal = memo(function AddCategoryModal({
  visible,
  onCancel,
  onSubmit
}: {
  visible: boolean
  onCancel: () => void
  onSubmit: (name: string) => void
}) {
  const [name, setName] = useState<string>('')

  const handleCreate = useCallback(() => {
    if (!name.trim()) return
    onSubmit(name.trim())
    setName('')
  }, [name, onSubmit])

  const handleCancel = useCallback(() => {
    setName('')
    onCancel()
  }, [onCancel])

  return (
    <Modal
      visible={visible}
      animationType='fade'
      transparent
      hardwareAccelerated
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Typo size={18} weight='600'>
                  {i18n.t('home.addProjectModal.form.newCategoryTitle')}
                </Typo>
              </View>

              <View style={styles.modalBody}>
                <FormField
                  placeholder={i18n.t('home.addProjectModal.form.newCategoryPlaceholder')}
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />

                <View style={styles.modalButtons}>
                  <ActionButton
                    style={[styles.modalButton, { backgroundColor: Colors.card }]}
                    onPress={handleCancel}
                    typoProps={{ color: 'primary', weight: '500' }}
                  >
                    {i18n.t('home.addProjectModal.actions.cancel')}
                  </ActionButton>

                  <ActionButton
                    style={styles.modalButton}
                    onPress={handleCreate}
                  >
                    {i18n.t('home.addProjectModal.actions.create', {
                      name: i18n.t('home.addProjectModal.form.category')
                    })}
                  </ActionButton>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
})

export default memo(function CategorySelector({ onSelect, selectedCategoryId }: CategorySelectorProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const { user } = useAuth()

  const categoriesStore = use$(() => categoriesStore$(user?.id || ''))

  const handleAdd = useCallback((name: string) => {
    const { createCategory } = categoriesStore
    if (!createCategory || !user?.id) return

    try {
      const newCategory = createCategory(name)
      onSelect(newCategory.id)
      setShowAddModal(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create category'
      Alert.alert('Failed to create category', message)
      console.error('Failed to create category on component CategorySelector', error)
    }
  }, [onSelect, categoriesStore, user?.id])

  const handleDelete = useCallback((id: string) => {
    const { deleteCategory } = categoriesStore
    if (!deleteCategory || !user?.id) return

    try {
      deleteCategory(id)
      if (selectedCategoryId === id) onSelect(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete category'
      Alert.alert('Failed to delete category', message)
      console.error('Failed to delete category on component CategorySelector', error)
    }
  }, [onSelect, selectedCategoryId, categoriesStore, user?.id])

  const handleValueChange = useCallback((value: string) => {
    if (value === NEW_VALUE) return setShowAddModal(true)
    onSelect(value)
  }, [onSelect])

  const { categories } = categoriesStore
  if (!categories || !user?.id) return null

  const selectedCategory = selectedCategoryId && categories[selectedCategoryId]
    ? categories[selectedCategoryId]
    : undefined

  const categoriesArray = Object.values(categories)

  return (
    <View style={styles.container}>
      <Typo size={14} weight='600' style={{ marginBottom: Sizes.spacing.s5 }}>
        {i18n.t('home.addProjectModal.form.category')}
      </Typo>

      <Picker
        onValueChange={handleValueChange}
        selectedValue={selectedCategory?.name}
        placeholder={i18n.t('home.addProjectModal.form.categoryPlaceholder')}
      >
        <Picker.Item
          label={i18n.t('home.addProjectModal.form.newCategory')}
          value={NEW_VALUE}
          icon={<Icon.Add size={20} color={Colors.primary} />}
          iconPosition='left'
          handleIconPress={() => setShowAddModal(true)}
          isFirst
          isLast={categoriesArray.length === 0}
          style={[
            styles.categoryItem,
            categoriesArray.length > 0 && { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.border }
          ]}
        />
        {categoriesArray.map((category) => (
          <Picker.Item
            key={category.id}
            label={category.name}
            value={category.id}
            style={styles.categoryItem}
            isSelected={category.id === selectedCategoryId}
            icon={<Icon.Trash size={19} color={Colors.error} />}
            iconPosition='right'
            handleIconPress={() => handleDelete(category.id)}
            isLast={categoriesArray.length === categoriesArray.indexOf(category) + 1}
          />
        ))}
      </Picker>
      <AddCategoryModal
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onSubmit={handleAdd}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.spacing.s13
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.s15,
    paddingVertical: Sizes.spacing.s9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border
  },
  // Modal styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.s15
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.background,
    borderRadius: Shapes.rounded.md,
    overflow: 'hidden'
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: Sizes.spacing.s15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border
  },
  modalBody: {
    padding: Sizes.spacing.s15
  },
  modalButtons: {
    marginTop: Sizes.spacing.s11,
    flexDirection: 'row',
    gap: Sizes.spacing.s9
  },
  modalButton: {
    width: '49%'
  }
})
