import { useCallback, useState } from 'react'
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  View
} from 'react-native'
import Picker from '@/components/shared/Picker'
import Typo from '@/components/shared/Typo'
import FormField from '@/components/shared/FormField'
import ActionButton from '@/components/shared/ActionButton'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Icon from '@/components/icons/Icon'
import { categories$ } from '@/store/categories.store'
import { use$ } from '@legendapp/state/react'
import { randomUUID } from 'expo-crypto'
import { batch } from '@legendapp/state'
import { projects$ } from '@/store/projects.store'

interface CategorySelectorProps {
  onSelect: (category: string | null) => void
  selectedCategoryId: string | null
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

export default function CategorySelector({ onSelect, selectedCategoryId }: CategorySelectorProps) {
  const [showAddModal, setShowAddModal] = useState(false)

  const selectedCatName: string | undefined = use$(() => categories$[selectedCategoryId ?? '']?.name)
  const countCategories = use$(() => Object.keys(categories$.get(true) || {}).length || 0)
  const categories = use$(() =>
    Object.values(categories$.get(true) || {})
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(({ id, name }) => ({ id, name }))
  )

  const handleAdd = useCallback((name: string) => {
    const nameTrimmed = name.trim()
    if (!nameTrimmed) return setShowAddModal(false)

    try {
      const id = randomUUID()
      const newC = categories$[id].assign({ id, name: nameTrimmed })

      batch(() => {
        categories$.set((prev) => ({
          [id]: newC.get(),
          ...prev
        }))
        onSelect(id)
      })
    } catch (error) {
      console.error('Create category error:', error)
    } finally {
      setShowAddModal(false)
    }
  }, [onSelect])

  const handleDelete = useCallback((id: string) => {
    try {
      const inUse = Object.values(projects$.get(true) || {}).some(p => p.category_id === id)
      if (inUse) {
        return Alert.alert(
          'Category in use',
          'This category is in use by some projects'
        )
      }

      categories$[id].delete()
      if (selectedCategoryId === id) onSelect(null)
    } catch (error) {
      console.error('Delete category error:', error)
    }
  }, [onSelect, selectedCategoryId])

  const handleValueChange = useCallback((value: string) => {
    if (value === NEW_VALUE) return setShowAddModal(true)
    onSelect(value)
  }, [onSelect])

  return (
    <View style={styles.container}>
      <Typo size={15} weight='500' style={styles.label}>
        Category
      </Typo>

      <Picker
        style={styles.picker}
        selectedValue={selectedCatName}
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

        {
          categories.map((c) => (
            <Picker.Item
              key={c.id}
              label={c.name}
              value={c.id}
              isSelected={selectedCategoryId === c.id}
              icon={<Icon.Trash color={Colors.error} size={19} />}
              iconPosition='right'
              handleIconPress={() => handleDelete(c.id)}
            />
          ))
        }
      </Picker>

      <AddCategoryModal
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onSubmit={handleAdd}
      />
    </View>
  )
}

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
