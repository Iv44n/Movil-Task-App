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

  return (
    <Modal
      visible={visible}
      animationType='fade'
      transparent
      hardwareAccelerated
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Typo size={19} weight='600'>
              Create New Category
            </Typo>

            <FormField
              placeholder='Category name'
              value={name}
              onChangeText={setName}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <ActionButton
                label='Cancel'
                onPress={onCancel}
                style={[styles.modalButton, styles.cancelButton]}
                typoProps={{ color: 'primary', size: 15 }}
              />
              <ActionButton
                label='Create'
                onPress={handleCreate}
                style={styles.modalButton}
                typoProps={{ size: 15 }}
              />
            </View>
          </View>
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

  const selectedCatName = selectedCategoryId && categories[selectedCategoryId]
    ? categories[selectedCategoryId].name
    : undefined

  const categoriesArray = Object.values(categories)
  const countCategories = categoriesArray.length

  return (
    <View style={styles.container}>
      <Typo size={15} weight='500' style={styles.label}>
        Category
      </Typo>

      <Picker
        style={styles.picker}
        selectedValue={selectedCatName || ''}
        onValueChange={handleValueChange}
        placeholder='Select a category'
      >
        <Picker.Item
          label='New category'
          value={NEW_VALUE}
          typoProps={{ size: 15, color: 'secondary' }}
          icon={<Icon.Add color={Colors.secondary} size={23} />}
          handleIconPress={() => setShowAddModal(true)}
          style={[styles.newItem, countCategories > 0 && styles.addedItemStyle]}
        />

        {categoriesArray.map((category) => (
          <Picker.Item
            key={category.id}
            label={category.name}
            value={category.id}
            isSelected={selectedCategoryId === category.id}
            icon={<Icon.Trash color={Colors.error} size={19} />}
            iconPosition='right'
            handleIconPress={() => handleDelete(category.id)}
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
    marginBottom: Sizes.spacing.s15,
    gap: Sizes.spacing.s7
  },
  label: {
    borderRadius: Shapes.rounded.base
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Shapes.rounded.base,
    marginBottom: Sizes.spacing.s5
  },
  newItem: {
    borderBottomColor: Colors.border,
    paddingVertical: Sizes.spacing.s9
  },
  addedItemStyle: {
    borderBottomWidth: 1,
    marginBottom: Sizes.spacing.s5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.background,
    padding: Sizes.spacing.s15,
    borderRadius: Shapes.rounded.base,
    gap: Sizes.spacing.s15
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Sizes.spacing.s9,
    justifyContent: 'center'
  },
  modalButton: {
    width: '49%',
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: Colors.card
  }
})
