import { ReactNode } from 'react'
import { View, Pressable, StyleSheet, TextInput, TextInputProps, StyleProp, ViewStyle } from 'react-native'
import { Colors, Shapes, Sizes, Typography } from '@/constants/theme'
import Typo from './Typo'
import { moderateScale } from '@/utils/styling'

interface IconTextFieldProps extends TextInputProps {
  label?: string
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
    <View style={[containerStyle, { marginBottom: Sizes.spacing.s15 }]}>
      {
        label && (
          <Typo
            size={15}
            weight='500'
            style={{
              marginLeft: Sizes.spacing.s7,
              marginBottom: Sizes.spacing.s5
            }}
          >
            {label}
          </Typo>
        )
      }

      <View style={styles.wrapper}>
        <TextInput
          placeholderTextColor={Colors.secondary}
          style={[styles.input, style]}
          {...inputProps}
        />
        <Pressable onPress={onIconPress} style={styles.iconWrapper}>
          {icon}
        </Pressable>
      </View>

      {
        error && (
          <Typo
            size={13}
            color='error'
            weight='500'
            style={{
              marginLeft: Sizes.spacing.s5,
              marginTop: Sizes.spacing.s3
            }}
          >
            {error}
          </Typo>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.base,
    borderColor: Colors.border,
    borderWidth: 1
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.base,
    fontFamily: Typography.fontFamily.regular,
    fontSize: moderateScale(14),
    color: Colors.primary,
    padding: Sizes.spacing.s13
  },
  iconWrapper: {
    paddingHorizontal: Sizes.spacing.s11
  }
})
