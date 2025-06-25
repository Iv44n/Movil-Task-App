import AddIcon from '@/components/icons/AddIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import Picker from '@/components/Picker'
import Typo from '@/components/Typo'
import { Colors, Sizes } from '@/constants/theme'
import { useCallback, useMemo } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import CreateCategoryCard from './CreateCategoryCard'
import useBoundStore from '@/store/useBoundStore'
import { AppError } from '@/errors/AppError'

interface CategorySelectorProps {
  onSelect: (category: { id: number, name: string } | null) => void
  selected: { id: number; name: string } | null
}

const NEW_VALUE = '__NEW__'

export default function CategorySelector({ onSelect, selected }: CategorySelectorProps) {
  const showOverlay = useBoundStore((state) => state.showOverlay)
  const hideOverlay = useBoundStore((state) => state.hideOverlay)
  const createCategory = useBoundStore((state) => state.createCategory)
  const deleteCategory = useBoundStore((state) => state.deleteCategoryById)
  const categories = useBoundStore((state) => state.categories)

  const handleAddCategory = useCallback(async (name: string) => {
    if (!name.trim()) return

    try {
      const newCategory = await createCategory(name)
      if(newCategory) onSelect({ id: newCategory.id, name: newCategory.name })
      hideOverlay()
    } catch (error) {
      console.error(error)
    }
  }, [createCategory, hideOverlay, onSelect])

  const handleDeleteCategory = useCallback(async (categoryId: number) => {
    try {
      await deleteCategory(categoryId)
    } catch (error) {
      if (error instanceof AppError && error.message.includes('Cannot delete category with associated projects')) {
        Alert.alert(
          'Error',
          error.message
        )
      }
    }
    if (selected?.id === categoryId) {
      onSelect(null)
    }
  }, [deleteCategory, selected, onSelect])

  const showAddCategoryModal = useCallback(() => {
    showOverlay(
      <CreateCategoryCard
        onClose={hideOverlay}
        createCategory={handleAddCategory}
        title='Add a category'
      />
    )
  }, [showOverlay, hideOverlay, handleAddCategory])

  const onCategoryChange = useCallback((value: string) => {
    if (value === NEW_VALUE) return showAddCategoryModal()

    const cat = categories.find((c) => c.name === value)
    if (cat) onSelect(cat)
  }, [categories, onSelect, showAddCategoryModal])

  const addNewCategoryListStyle = useMemo(() => {
    return {
      borderBottomWidth: 1,
      marginBottom: Sizes.spacing.s5,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }
  }, [])

  return (
    <View style={styles.pickerContainer}>
      <Typo size={15} fontWeight='medium'>
        Category
      </Typo>
      <Picker
        selectedValue={selected?.name}
        onValueChange={onCategoryChange}
        placeholder='Select a category'
      >
        <Picker.Item
          label='New category'
          handleIconPress={showAddCategoryModal}
          value={NEW_VALUE}
          typoProps={{ size: 15, color: Colors.textSecondary }}
          icon={<AddIcon color={Colors.textSecondary} size={23} />}
          style={[styles.newCategoryItem, categories.length > 0 && addNewCategoryListStyle]}
        />
        {
          categories.map((c: { id: number; name: string }) => (
            <Picker.Item
              icon={<TrashIcon color='red' size={19} />}
              iconPosition='right'
              handleIconPress={() => handleDeleteCategory(c.id)}
              key={c.id}
              label={c.name}
              value={c.name}
              isSelected={selected?.name === c.name}
            />
          ))
        }
      </Picker>
    </View>
  )
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: Sizes.spacing.s21,
    gap: Sizes.spacing.s7
  },
  newCategoryItem: {
    borderBottomColor: Colors.border,
    paddingVertical: Sizes.spacing.s9
  }
})
