import React from 'react'
import { View, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle } from 'react-native'
import { Colors, Shapes, Sizes, Typography } from '@/constants/theme'
import Typo from '@/components/Typo'
import { moderateScale } from '@/utils/styling'

interface FormFieldProps extends TextInputProps {
  label: string
  error?: string | null
  containerStyle?: StyleProp<ViewStyle>
}

export default function FormField({
  label,
  error,
  containerStyle,
  style,
  ...inputProps
}: FormFieldProps) {
  return (
    <View style={containerStyle}>
      <Typo
        size={15}
        fontWeight='medium'
        style={{ marginLeft: 1, marginBottom: Sizes.spacing.s7 }}
      >
        {label}
      </Typo>
      <TextInput
        placeholderTextColor={Colors.textSecondary}
        style={[styles.input, style]}
        {...inputProps}
      />
      <Typo
        size={13}
        color='#FF8080'
        fontWeight='medium'
        style={{ marginLeft: Sizes.spacing.s5, marginTop: Sizes.spacing.s3 }}
      >
        {error}
      </Typo>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    color: Colors.textPrimary,
    fontSize: moderateScale(15),
    fontFamily: Typography.fontFamily.regular,
    paddingVertical: Sizes.spacing.s11,
    paddingHorizontal: Sizes.spacing.s13,
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.small
  }
})
