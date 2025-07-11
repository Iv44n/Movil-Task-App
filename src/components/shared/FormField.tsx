import React, { forwardRef, memo } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  Pressable,
  TextInput as RNTextInput
} from 'react-native'
import { Colors, Shapes, Sizes, Typography } from '@/constants/theme'
import Typo from './Typo'
import { moderateScale } from '@/utils/styling'

interface FormFieldProps extends TextInputProps {
  label?: string
  error?: string | null
  containerStyle?: StyleProp<ViewStyle>
  icon?: React.ReactNode
  onIconPress?: () => void
}

const FormField = forwardRef<RNTextInput, FormFieldProps>(({
  label,
  error,
  containerStyle,
  style,
  icon,
  onIconPress,
  ...inputProps
}, ref) => {
  const borderColor = error ? Colors.error : Colors.border

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typo
          size={15}
          weight='500'
          style={styles.label}
          accessibilityLabel={label}
        >
          {label}
        </Typo>
      )}

      <View style={[styles.wrapper, { borderColor }]}>
        <TextInput
          ref={ref}
          placeholderTextColor={Colors.secondary}
          style={[styles.input, style]}
          {...inputProps}
        />
        {icon && (
          <Pressable
            onPress={onIconPress}
            style={styles.iconWrapper}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole='button'
          >
            {icon}
          </Pressable>
        )}
      </View>

      {error && (
        <Typo
          size={13}
          color='error'
          weight='500'
          style={styles.errorText}
          accessibilityRole='alert'
        >
          {error}
        </Typo>
      )}
    </View>
  )
})

FormField.displayName = 'FormField'

export default memo(FormField)

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.spacing.s15
  },
  label: {
    marginBottom: Sizes.spacing.s5
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.base,
    borderWidth: 1,
    overflow: 'hidden'
  },
  input: {
    flex: 1,
    color: Colors.primary,
    fontSize: moderateScale(14),
    fontFamily: Typography.fontFamily.regular,
    paddingVertical: Sizes.spacing.s13,
    paddingHorizontal: Sizes.spacing.s13
  },
  iconWrapper: {
    paddingRight: Sizes.spacing.s13,
    paddingLeft: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    marginLeft: Sizes.spacing.s5,
    marginTop: Sizes.spacing.s3
  }
})
