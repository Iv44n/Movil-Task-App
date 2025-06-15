import React, { ReactNode } from 'react'
import { View, Pressable, StyleSheet, TextInput, TextInputProps, StyleProp, ViewStyle } from 'react-native'
import { Colors, Shapes, Sizes, Typography } from '@/constants/theme'
import Typo from '@/components/Typo'
import { moderateScale } from '@/utils/styling'

interface IconTextFieldProps extends TextInputProps {
  label: string
  icon: ReactNode
  onIconPress?: () => void
  error?: string | null
  containerStyle?: StyleProp<ViewStyle>
}

export default function IconTextField({
  label,
  icon,
  onIconPress,
  error,
  containerStyle,
  style,
  ...inputProps
}: IconTextFieldProps) {
  return (
    <View style={containerStyle}>
      <Typo
        size={15}
        fontWeight='medium'
        style={{
          marginLeft: Sizes.spacing.s7,
          marginBottom: Sizes.spacing.s5
        }}
      >
        {label}
      </Typo>

      <View style={styles.wrapper}>
        <TextInput
          placeholderTextColor={Colors.textSecondary}
          style={[styles.input, style]}
          {...inputProps}
        />
        <Pressable onPress={onIconPress} style={styles.iconWrapper}>
          {icon}
        </Pressable>
      </View>

      <Typo
        size={13}
        color='#FF8080'
        fontWeight='medium'
        style={{
          marginLeft: Sizes.spacing.s5,
          marginTop: Sizes.spacing.s3
        }}
      >
        {error}
      </Typo>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.small
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.small,
    fontFamily: Typography.fontFamily.regular,
    fontSize: moderateScale(15),
    color: Colors.textPrimary,
    paddingHorizontal: Sizes.spacing.s13,
    paddingVertical: Sizes.spacing.s11
  },
  iconWrapper: {
    padding: Sizes.spacing.s11
  }
})
