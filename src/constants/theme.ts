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

const spacingBase = [3, 5, 7, 9, 11, 13, 15, 17, 21] as const
const widthBase = [31, 225] as const
const heightBase = [5, 191] as const

// ==== Colors ====

const Colors = {
  background: '#1A1A1A',
  card: '#242424',
  textPrimary: '#fcfcfc',
  textSecondary: '#B3B3B3',
  textBlack: '#000',
  green: '#b3fedc',
  yellow: '#Fdf485',
  border: '#333333'
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
  spacing: generateSizes(spacingBase, scale, 's')
}

// ==== Shapes ====

const Shapes = {
  rounded: {
    full: 999,
    small: 9,
    medium: 21,
    large: 51
  }
}

export { Colors, Typography, Sizes, Shapes }
