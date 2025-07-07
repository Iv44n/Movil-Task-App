import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Typo, { TypoProps } from './Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { memo } from 'react'

type ActionButtonProps = PressableProps & {
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
  ...pressableProps
}: ActionButtonProps) {
  const mergedTypoProps = {
    ...DEFAULTS.typography,
    ...typoProps
  }

  return (
    <Pressable
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
      {...pressableProps}
    >
      <Typo {...mergedTypoProps}>{label}</Typo>
    </Pressable>
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
