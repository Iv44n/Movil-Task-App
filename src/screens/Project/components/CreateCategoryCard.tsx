import React, { useState, useCallback } from 'react'
import { Pressable, StyleSheet, View, StyleProp, ViewStyle } from 'react-native'
import ActionButton from '@/components/ActionButton'
import FormField from '@/components/FormField'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import Typo from '@/components/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'

interface CategoryCardProps {
  onClose: () => void
  createCategory: (name: string) => Promise<void>
  title?: string
  style?: StyleProp<ViewStyle>
}

function CreateCategoryCard({ onClose, title, style, createCategory }: CategoryCardProps) {
  const [categoryName, setCategoryName] = useState<string>('')

  const handleCreate = useCallback(async () => {
    if (!categoryName.trim()) return

    try {
      await createCategory(categoryName)
    } catch (error) {
      console.error('Failed to create category:', error)
    }
    onClose()
  }, [categoryName, onClose, createCategory])

  const renderButton = useCallback(
    (label: string, onPress: () => void, bgColor?: string) => (
      <ActionButton
        label={label}
        onPress={onPress}
        backgroundColor={bgColor}
        style={styles.modalSubmitButton}
        typoProps={{ size: 15 }}
      />
    ),
    []
  )

  return (
    <View style={styles.modal}>
      <View style={[styles.card, style]}>
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <ArrowLeftIcon size={23} color={Colors.textPrimary} />
          </Pressable>
          {title ? (
            <Typo size={19} fontWeight='semiBold'>
              {title}
            </Typo>
          ) : null}
        </View>

        <FormField
          label='Name'
          placeholder='Enter a name for the category'
          value={categoryName}
          onChangeText={setCategoryName}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {renderButton('Cancel', onClose, '#FF8080')}
          {renderButton('Create', handleCreate)}
        </View>
      </View>
    </View>
  )
}

export default React.memo(CreateCategoryCard)

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizes.spacing.s15
  },
  card: {
    width: '100%',
    backgroundColor: Colors.background,
    padding: Sizes.spacing.s17,
    borderRadius: Shapes.rounded.small
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.spacing.s15,
    gap: Sizes.spacing.s11
  },
  modalSubmitButton: {
    width: '48%',
    paddingVertical: Sizes.spacing.s7
  }
})
