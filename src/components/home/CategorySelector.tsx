import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import Picker from '@/components/shared/Picker'
import Typo from '@/components/shared/Typo'
import Icon from '@/components/icons/Icon'
import AddCategoryModal from './AddCategoryModal'
import { Colors, Sizes } from '@/constants/theme'
import i18n from '@/i18n'
import { useDatabase } from '@nozbe/watermelondb/react'
import { Category } from '@/models'
import { TABLE_NAMES } from '@/lib/schema'
import { Q } from '@nozbe/watermelondb'
import useUser from '@/hooks/auth/useUser'

interface CategorySelectorProps {
  onSelect: (categoryId: string | null) => void
  selectedCategoryId: string | null
}

const NEW_CATEGORY_VALUE = '__NEW__'

const CategorySelector = memo<CategorySelectorProps>(({
  onSelect,
  selectedCategoryId
}) => {
  const db = useDatabase()
  const { user } = useUser()
  const [categories, setCategories] = useState<Category[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  const categoriesCollection = db.collections.get<Category>(TABLE_NAMES.CATEGORIES)

  useEffect(() => {
    if (!user) return

    const subscription = categoriesCollection
      .query(
        Q.where('user_id', user.id),
        Q.sortBy('created_at', Q.desc)
      )
      .observe()
      .subscribe(setCategories)

    return () => subscription.unsubscribe()
  }, [db, user, categoriesCollection])

  const selectedCategory = useMemo(
    () => categories.find(cat => cat.id === selectedCategoryId),
    [categories, selectedCategoryId]
  )

  const handleValueChange = useCallback((value: string) => {
    if (value === NEW_CATEGORY_VALUE) {
      setShowAddModal(true)
    } else {
      onSelect(value)
    }
  }, [onSelect])

  const handleAddCategory = useCallback(async (name: string) => {
    if (!user) return
    try {
      const existingCategory = await categoriesCollection
        .query(
          Q.where('name', name),
          Q.where('user_id', user.id),
          Q.take(1)
        )
        .fetch()

      if (existingCategory.length > 0) throw new Error('Category already exists')

      const newCategory = await db.write(async () => {
        return categoriesCollection.create((category) => {
          category.name = name
          category.userId = user.id
        })
      })
      onSelect(newCategory.id)
      setShowAddModal(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create category'
      Alert.alert('Error', message)
      console.error('CategorySelector - Create category failed:', error)
    }
  }, [db, onSelect, user, categoriesCollection])

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    try {
      const category = categories.find(cat => cat.id === categoryId)
      if (!category) return
      await category.deleteCategory()
      if (selectedCategoryId === categoryId) {
        onSelect(null)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete category'
      Alert.alert('Error', message)
      console.error('CategorySelector - Delete category failed:', error)
    }
  }, [categories, selectedCategoryId, onSelect])

  const closeModal = useCallback(() => setShowAddModal(false), [])
  const openModal = useCallback(() => setShowAddModal(true), [])

  const hasCategories = categories.length > 0

  return (
    <View style={styles.container}>
      <Typo size={14} weight='600' style={styles.label}>
        {i18n.t('home.addProjectModal.form.category')}
      </Typo>

      <Picker
        onValueChange={handleValueChange}
        selectedValue={selectedCategory?.name}
        placeholder={i18n.t('home.addProjectModal.form.categoryPlaceholder')}
      >
        <Picker.Item
          label={i18n.t('home.addProjectModal.form.newCategory')}
          value={NEW_CATEGORY_VALUE}
          icon={<Icon.Add size={20} color={Colors.primary} />}
          iconPosition='left'
          handleIconPress={openModal}
          isFirst
          isLast={!hasCategories}
          style={[
            styles.pickerItem,
            hasCategories && styles.pickerItemBorder
          ]}
        />

        {categories.map((category, index) => (
          <Picker.Item
            key={category.id}
            label={category.name}
            value={category.id}
            style={styles.pickerItem}
            isSelected={category.id === selectedCategoryId}
            icon={<Icon.Trash size={19} color={Colors.error} />}
            iconPosition='right'
            handleIconPress={() => handleDeleteCategory(category.id)}
            isLast={index === categories.length - 1}
          />
        ))}
      </Picker>

      <AddCategoryModal
        visible={showAddModal}
        onCancel={closeModal}
        onSubmit={handleAddCategory}
      />
    </View>
  )
})

CategorySelector.displayName = 'CategorySelector'
export default CategorySelector

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.spacing.s13
  },
  label: {
    marginBottom: Sizes.spacing.s5
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.spacing.s15,
    paddingVertical: Sizes.spacing.s9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border
  },
  pickerItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border
  }
})
