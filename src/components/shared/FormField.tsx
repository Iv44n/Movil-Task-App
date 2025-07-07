import { View, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle } from 'react-native'
import { Colors, Shapes, Sizes, Typography } from '@/constants/theme'
import Typo from './Typo'
import { moderateScale } from '@/utils/styling'

interface FormFieldProps extends TextInputProps {
  label?: string
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
    <View style={[containerStyle, { marginBottom: Sizes.spacing.s15 }]}>
      {
        label && (
          <Typo
            size={15}
            weight='500'
            style={{ marginLeft: 1, marginBottom: Sizes.spacing.s7 }}
          >
            {label}
          </Typo>
        )
      }
      <TextInput
        placeholderTextColor={Colors.secondary}
        style={[styles.input, style]}
        {...inputProps}
      />
      {
        error && (
          <Typo
            size={13}
            color='error'
            weight='500'
            style={{ marginLeft: Sizes.spacing.s5, marginTop: Sizes.spacing.s3 }}
          >
            {error}
          </Typo>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    color: Colors.primary,
    fontSize: moderateScale(14),
    fontFamily: Typography.fontFamily.regular,
    padding: Sizes.spacing.s13,
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.base,
    borderColor: Colors.border,
    borderWidth: 1
  }
})
