import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  Alert
} from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Typo from '@/components/Typo'
import FormField from '@/components/FormField'
import { useRouter } from 'expo-router'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import Picker from '@/components/Picker'
import useBoundStore from '@/store/useBoundStore'
import { useShallow } from 'zustand/shallow'
import AddIcon from '@/components/icons/AddIcon'
import CreateCategoryCard from './components/CreateCategoryCard'
import TrashIcon from '@/components/icons/TrashIcon'
import { AppError } from '@/errors/AppError'

const NEW_CATEGORY_VALUE = 'new-category'

export default function ProjectCreate() {
  const router = useRouter()

  // Local state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<{ id: number, name: string } | null>(null)

  // Zustand store
  const { createProject, categories, createCategory, deleteCategory, getAllCategories, showOverlay, hideOverlay } =
   useBoundStore(
     useShallow((state) => ({
       createProject: state.createProject,
       categories: state.categories,
       createCategory: state.createCategory,
       deleteCategory: state.deleteCategoryById,
       getAllCategories: state.getCategories,
       showOverlay: state.showOverlay,
       hideOverlay: state.hideOverlay
     }))
   )

  useEffect(() => {
    getAllCategories()
  }, [getAllCategories])

  const isValid = useMemo(() => name.trim().length > 3 && category !== null, [name, category])

  const handleSubmit = useCallback(async () => {
    if (!isValid) return

    try {
      const project = await createProject({
        name: name.trim(),
        description: description.trim() ?? null,
        categoryId: category!.id
      })
      router.replace(`project/${project.projectId}`)
    } catch (error) {
      console.error(error)
    }
  }, [isValid, category, createProject, name, description, router])

  const handleAddCategory = useCallback(async (name: string) => {
    if (!name.trim()) return

    try {
      const newCategory = await createCategory(name)
      setCategory({ id: newCategory.id, name: newCategory.name })
      hideOverlay()
    } catch (error) {
      console.error(error)
    }
  }, [createCategory, hideOverlay])

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
    if (value === NEW_CATEGORY_VALUE) {
      setCategory(null)
      showAddCategoryModal()
    } else {
      setCategory(categories.find(c => c.name === value) ?? null)
    }
  }, [categories, setCategory, showAddCategoryModal])

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
    if (category?.id === categoryId) {
      setCategory(null)
    }
  }, [deleteCategory, category])

  const addNewCategoryListStyle = useMemo(() => {
    return {
      borderBottomWidth: 1,
      marginBottom: Sizes.spacing.s5,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }
  }, [])

  return (
    <>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeftIcon />
        </Pressable>
        <Typo size={25} fontWeight='bold'>
          Create a new project
        </Typo>
      </View>

      <FormField
        label='Project name'
        placeholder='Enter a project name'
        value={name}
        onChangeText={setName}
      />

      <FormField
        label='Description'
        placeholder='Enter a description'
        value={description}
        onChangeText={setDescription}
        style={[styles.textArea]}
        multiline
      />

      <View style={styles.pickerContainer}>
        <Typo size={15} fontWeight='medium'>
          Category
        </Typo>
        <Picker
          selectedValue={category?.name}
          onValueChange={onCategoryChange}
          placeholder='Select a category'
        >
          <Picker.Item
            label='New category'
            value={NEW_CATEGORY_VALUE}
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
                isSelected={category?.name === c.name}
              />
            ))
          }
        </Picker>
      </View>

      <Pressable
        style={[styles.submitButton, !isValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Typo size={15} fontWeight='semiBold' color={isValid ? Colors.textBlack : Colors.textSecondary}>
          Created Project
        </Typo>
      </Pressable>
    </>
  )
}
const styles = StyleSheet.create({
  header: {
    gap: Sizes.spacing.s5,
    marginBottom: Sizes.spacing.s15
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: Sizes.spacing.s11,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Shapes.rounded.full
  },
  textArea: {
    height: Sizes.height.h99,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    marginBottom: Sizes.spacing.s21,
    gap: Sizes.spacing.s7
  },
  submitButton: {
    backgroundColor: Colors.yellow,
    paddingVertical: Sizes.spacing.s11,
    borderRadius: Shapes.rounded.medium,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: Colors.border
  },
  newCategoryItem: {
    borderBottomColor: Colors.border,
    paddingVertical: Sizes.spacing.s9
  }
})
