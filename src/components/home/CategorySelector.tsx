import { useCallback, useMemo, useState } from 'react'
import {
  Modal,
  Pressable,
  StyleSheet,
  View
} from 'react-native'
import AddIcon from '@/components/icons/AddIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import Picker from '@/components/shared/Picker'
import Typo from '@/components/shared/Typo'
import FormField from '@/components/shared/FormField'
import ActionButton from '@/components/shared/ActionButton'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import useCategories from '@/hooks/data/useCategories'
import { Database } from '@/lib/database.types'
import { observer } from '@legendapp/state/react'

type Category = Database['public']['Tables']['categories']['Row']

interface CategorySelectorProps {
  onSelect: (category: Category | null) => void
  selected: Category | null
}

const NEW_VALUE = '__NEW__'

function AddCategoryModal({
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
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
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
      </Pressable>
    </Modal>
  )
}

export default observer(function CategorySelector({
  onSelect,
  selected
}: CategorySelectorProps) {
  const { categories, createCategory, deleteCategoryById } = useCategories()
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAdd = useCallback(
    async (name: string) => {
      try {
        const newCat = createCategory(name)
        onSelect(newCat)
      } catch (error) {
        console.error('Add category error:', error)
      } finally {
        setShowAddModal(false)
      }
    },
    [createCategory, onSelect]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        deleteCategoryById(id)
        if (selected?.id === id) {
          onSelect(null)
        }
      } catch (error) {
        console.error('Delete category error:', error)
      }
    },
    [deleteCategoryById, selected, onSelect]
  )

  const handleValueChange = useCallback(
    (value: string) => {
      if (value === NEW_VALUE) {
        setShowAddModal(true)
        return
      }
      const found = categories.find((c) => c.name === value) || null
      onSelect(found)
    },
    [categories, onSelect]
  )

  const addNewCategoryListStyle = useMemo(() => {
    return {
      borderBottomWidth: 1,
      marginBottom: Sizes.spacing.s5,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }
  }, [])

  return (
    <View style={styles.container}>
      <Typo size={15} weight='500' style={styles.label}>
        Category
      </Typo>

      <Picker
        style={styles.picker}
        selectedValue={selected?.name}
        onValueChange={handleValueChange}
        placeholder='Select a category'
      >
        <Picker.Item
          label='New category'
          value={NEW_VALUE}
          typoProps={{ size: 15, color: 'secondary' }}
          icon={<AddIcon color={Colors.secondary} size={23} />}
          handleIconPress={() => setShowAddModal(true)}
          style={[styles.newItem, categories.length > 0 && addNewCategoryListStyle]}
        />

        {categories.length > 0 && categories.map((c) => (
          <Picker.Item
            key={c.id}
            label={c.name}
            value={c.name}
            isSelected={selected?.id === c.id}
            icon={<TrashIcon color={Colors.error} size={19} />}
            iconPosition='right'
            handleIconPress={() => handleDelete(c.id)}
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
