import { StyleProp, StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import Typo, { TypoProps } from './Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { memo } from 'react'

type ActionButtonProps = TouchableOpacityProps & {
  label: string
  backgroundColor?: string
  style?: StyleProp<ViewStyle>
  typoProps?: Omit<TypoProps, 'children'>
  onPress: () => void
}

const DEFAULTS = {
  background: Colors.yellow,
  typography: {
    size: 17,
    color: 'black',
    weight: '700'
  } as const satisfies Omit<TypoProps, 'children'>
} as const

const ActionButton = memo(function ActionButton({
  backgroundColor = DEFAULTS.background,
  label,
  style,
  onPress,
  typoProps,
  ...touchableOpacityProps
}: ActionButtonProps) {
  const mergedTypoProps = {
    ...DEFAULTS.typography,
    ...typoProps
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
      activeOpacity={0.7}
      {...touchableOpacityProps}
    >
      <Typo {...mergedTypoProps}>{label}</Typo>
    </TouchableOpacity>
  )
})

export default ActionButton

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: Sizes.spacing.s11,
    paddingHorizontal: Sizes.spacing.s15,
    borderRadius: Shapes.rounded.base,
    alignItems: 'center'
  }
})
