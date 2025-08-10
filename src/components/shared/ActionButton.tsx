import { StyleProp, StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import Typo, { TypoProps } from './Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { memo, ReactNode } from 'react'

type ActionButtonProps = TouchableOpacityProps & {
  children: ReactNode | string
  backgroundColor?: string
  style?: StyleProp<ViewStyle>
  typoProps?: Omit<TypoProps, 'children'>
  onPress: () => void
}

const DEFAULTS = {
  background: Colors.yellow,
  typography: {
    size: 15,
    color: 'black',
    weight: '700'
  } as const satisfies Omit<TypoProps, 'children'>
} as const

const ActionButton = memo(function ActionButton({
  backgroundColor = DEFAULTS.background,
  children,
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
      {typeof children === 'string' ? <Typo {...mergedTypoProps}>{children}</Typo> : children}
    </TouchableOpacity>
  )
})

export default ActionButton

const styles = StyleSheet.create({
  button: {
    paddingVertical: Sizes.spacing.s11,
    paddingHorizontal: Sizes.spacing.s15,
    borderRadius: Shapes.rounded.lg,
    alignItems: 'center'
  }
})
