import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  StyleSheet,
  Pressable
} from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Typo from '@/components/Typo'
import FormField from '@/components/FormField'
import { useRouter } from 'expo-router'
import useBoundStore from '@/store/useBoundStore'
import { useShallow } from 'zustand/shallow'
import CreateProjectHeader from './components/CreateProjectHeader'
import CategorySelector from './components/CategorySelector'
import ColorSelector from './components/ColorSelector'

export default function ProjectCreate() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<{ id: number, name: string } | null>(null)
  const [bgColor, setBgColor] = useState('#FFFFF')

  const { createProject, getAllCategories, getAllColors } = useBoundStore(
    useShallow((state) => ({
      createProject: state.createProject,
      getAllCategories: state.getCategories,
      getAllColors: state.getAllColors
    }))
  )

  useEffect(() => {
    getAllCategories()
    getAllColors()
  }, [getAllCategories, getAllColors])

  const isValid = useMemo(() => name.trim().length > 3 && category !== null, [name, category])

  const handleSubmit = useCallback(async () => {
    if (!isValid) return

    try {
      const project = await createProject({
        name: name.trim(),
        description: description.trim() ?? null,
        categoryId: category!.id,
        bgColor
      })
      router.replace(`project/${project?.projectId}`)
    } catch (error) {
      console.error(error)
    }
  }, [isValid, category, createProject, name, description, router, bgColor])

  return (
    <>
      <CreateProjectHeader router={router}/>

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

      <CategorySelector
        onSelect={setCategory}
        selected={category}
      />

      <ColorSelector
        onSelect={setBgColor}
        selected={bgColor}
      />

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
  textArea: {
    height: Sizes.height.h99,
    textAlignVertical: 'top'
  },
  submitButton: {
    backgroundColor: Colors.yellow,
    paddingVertical: Sizes.spacing.s11,
    borderRadius: Shapes.rounded.medium,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: Colors.border
  }
})
