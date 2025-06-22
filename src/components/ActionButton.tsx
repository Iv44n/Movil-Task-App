import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Typo, { TypoProps } from './Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { memo } from 'react'

interface ActionButtonProps {
  label: string
  backgroundColor?: string
  style?: StyleProp<ViewStyle>
  typoProps?: TypoProps
  onPress: () => void
}

const DEFAULT_BG = Colors.yellow
const DEFAULT_TYPO: TypoProps = {
  size: 17,
  color: Colors.textBlack,
  fontWeight: 'bold'
}

function ActionButton({
  backgroundColor = DEFAULT_BG,
  label,
  style,
  onPress,
  typoProps
}: ActionButtonProps) {
  const finalTypoProps = { ...DEFAULT_TYPO, ...typoProps }

  return (
    <Pressable
      style={[styles.modalSubmitButton, { backgroundColor: backgroundColor }, style]}
      onPress={onPress}
    >
      <Typo {...finalTypoProps}>
        {label}
      </Typo>
    </Pressable>
  )
}

export default memo(ActionButton)

const styles = StyleSheet.create({
  modalSubmitButton: {
    width: '100%',
    paddingVertical: Sizes.spacing.s9,
    paddingHorizontal: Sizes.spacing.s15,
    borderRadius: Shapes.rounded.medium,
    alignItems: 'center'
  }
})
