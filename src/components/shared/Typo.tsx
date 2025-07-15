import { Colors, Typography } from '@/constants/theme'
import { moderateScale } from '@/utils/styling'
import { Text, TextProps, TextStyle } from 'react-native'

type FontWeight = '200' | '300' | '400' | '500' | '600' | '700' | '800'

export interface TypoProps extends TextProps {
  size?: number
  weight?: FontWeight
  children: React.ReactNode
  color?: keyof typeof Colors
  forceColor?: string
  style?: TextStyle
}

const DEFAULT_WEIGHT = '400' as const
const DEFAULT_SIZE = 15 as const
const DEFAULT_COLOR_TOKEN = 'primary' as const
//const DEFAULT_FONT_FAMILY = 'Manrope' as const

function getFontFamilyFromWeight(fontWeight?: FontWeight): string {
  switch (fontWeight) {
    case '200':
      return Typography.fontFamily.extraLight

    case '300':
      return Typography.fontFamily.light

    case '400':

    case undefined:
      return Typography.fontFamily.regular

    case '500':
      return Typography.fontFamily.medium

    case '600':
      return Typography.fontFamily.semiBold

    case '700':
      return Typography.fontFamily.bold

    case '800':
      return Typography.fontFamily.extraBold

    default:
      return Typography.fontFamily.regular
  }
}

export default function Typo({ size, color, weight, children, style, forceColor, ...rest }: TypoProps) {
  const textStyle: TextStyle = {
    fontSize: moderateScale(size || DEFAULT_SIZE),
    color: forceColor ? forceColor : Colors[color || DEFAULT_COLOR_TOKEN],
    fontFamily: getFontFamilyFromWeight(weight || DEFAULT_WEIGHT),
    //fontWeight: weight || DEFAULT_WEIGHT,
    ...style
  }

  const textProps: TextProps = {
    style: textStyle,
    children,
    ...rest
  }

  return (
    <Text {...textProps} />
  )
}
