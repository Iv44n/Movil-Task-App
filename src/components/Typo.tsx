/* eslint-disable @stylistic/ts/padding-line-between-statements */

import { Colors, Typography } from '@/constants/theme'
import { moderateScale } from '@/utils/styling'
import { Text, TextProps, TextStyle } from 'react-native'

type fontWeightType = 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | undefined

interface TypoProps {
  size?: number
  fontWeight?: fontWeightType
  color?: string
  children?: any | null
  style?: TextStyle
  textProps?: TextProps,
}

function getFontFamilyFromWeight(fontWeight?: fontWeightType): string {
  switch (fontWeight) {
    case 'extraLight':
      return Typography.fontFamily.extraLight
    case 'light':
      return Typography.fontFamily.light
    case 'regular':
    case undefined:
      return Typography.fontFamily.regular
    case 'medium':
      return Typography.fontFamily.medium
    case 'semiBold':
      return Typography.fontFamily.semiBold
    case 'bold':
      return Typography.fontFamily.bold
    case 'extraBold':
      return Typography.fontFamily.extraBold
    default:
      return Typography.fontFamily.regular
  }
}

function Typo({
  size,
  color = Colors.textPrimary,
  fontWeight,
  children,
  style,
  textProps = {}
}: TypoProps) {
  const fontFamily = getFontFamilyFromWeight(fontWeight)

  const textStyle: TextStyle = {
    fontSize: moderateScale(size || 15),
    color,
    fontFamily,
    ...style
  }

  return (
    <Text style={textStyle} {...textProps}>
      {children}
    </Text>
  )
}

export default Typo
