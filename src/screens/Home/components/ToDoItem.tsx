import CheckCircleIcon from '@/components/icons/CheckCircleIcon'
import CircleIcon from '@/components/icons/CircleIcon'
import HorizontalDotMenuIcon from '@/components/icons/HorizontalDotMenuIcon'
import Typo from '@/components/Typo'
import { Colors, Sizes } from '@/constants/theme'
import { useState } from 'react'
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

interface TodoItemProps {
  title: string
  subtitle: string
  checked?: boolean
  onToggleChecked?: () => void
  onPressMenu?: () => void
  style?: StyleProp<ViewStyle>
}

export default function ToDoItem({ title, subtitle, checked, onToggleChecked, onPressMenu }: TodoItemProps) {
  const [isChecked, setIsChecked] = useState(checked || false)

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setIsChecked(!isChecked)}>
        {isChecked ? (
          <CheckCircleIcon size={29} color={Colors.textSecondary} />
        ) : (
          <CircleIcon size={29} />
        )}
      </Pressable>

      <View style={styles.textWrapper}>
        <Typo
          color={isChecked ? Colors.textSecondary : Colors.textPrimary}
          size={15}
          fontWeight='semiBold'
          textProps={{
            ellipsizeMode: 'tail',
            numberOfLines: 1
          }}
          style={{
            textDecorationLine: isChecked ? 'line-through' : 'none'
          }}
        >
          {title}
        </Typo>
        <Typo size={13} color={Colors.textSecondary}>
          {subtitle}
        </Typo>
      </View>

      <Pressable onPress={onPressMenu}>
        <HorizontalDotMenuIcon size={29} color={Colors.textSecondary} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Sizes.spacing.s11,
    alignItems: 'center',
    paddingVertical: Sizes.spacing.s15
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'column',
    gap: Sizes.spacing.s3
  }
})
