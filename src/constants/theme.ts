import { moderateScale, moderateVerticalScale, scale } from '@/utils/styling'

type PrefixedKeys<T extends readonly number[], Prefix extends string> = {
  [K in T[number] as `${Prefix}${K}`]: number;
}

function generateSizes<T extends readonly number[], P extends string>(
  baseValues: T,
  scaleFn: (size: number) => number,
  prefix: P
): PrefixedKeys<T, P> {
  return Object.fromEntries(
    baseValues.map((value) => [`${prefix}${value}`, scaleFn(value)])
  ) as PrefixedKeys<T, P>
}

// ==== Bases ====

const spacingBase = [3, 5, 7, 9, 11, 13, 15, 17, 21, 33, 41, 55, 71, 91] as const
const widthBase = [5, 25, 31, 33, 47, 57, 99, 131, 191, 225, 355] as const
const heightBase = [5, 25, 31, 33, 47, 57, 99, 131, 191, 255, 355] as const

// ==== Colors ====

const Colors = {
  primary: '#fcfcfc',
  secondary: '#B3B3B3',
  black: '#000',
  background: '#181818',
  card: '#202020',
  border: '#333333',

  green: '#b3fedc',
  yellow: '#Fdf485',

  error: '#FF8080'
}

// ==== Typography ====

const Typography = {
  fontFamily: {
    extraLight: 'Manrope-ExtraLight',
    light: 'Manrope-Light',
    regular: 'Manrope-Regular',
    medium: 'Manrope-Medium',
    semiBold: 'Manrope-SemiBold',
    bold: 'Manrope-Bold',
    extraBold: 'Manrope-ExtraBold'
  }
}

// ==== Sizes ====

const Sizes = {
  width: generateSizes(widthBase, moderateScale, 'w'),
  height: generateSizes(heightBase, moderateVerticalScale, 'h'),
  spacing: generateSizes(spacingBase, scale, 's'),
  text: generateSizes(spacingBase, scale, 't')
}

// ==== Shapes ====

const Shapes = {
  rounded: {
    none: 0,
    xs: 5,
    sm: 11,
    base: 15,
    md: 21,
    lg: 35,
    xl: 39,
    xxl: 55,
    circle: 999
  }
}

export { Colors, Sizes, Shapes, Typography }
