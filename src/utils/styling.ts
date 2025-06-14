import { Dimensions, PixelRatio } from 'react-native'

const { width, height } = Dimensions.get('window')
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width]

const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

export const scale = (size: number) =>
  Math.round(
    PixelRatio.roundToNearestPixel(
      (shortDimension / guidelineBaseWidth) * size
    )
  )

export const verticalScale = (size: number) =>
  Math.round(
    PixelRatio.roundToNearestPixel(
      (longDimension / guidelineBaseHeight) * size
    )
  )

export const moderateScale = (size: number, factor = 0.5) =>
  Math.round(
    PixelRatio.roundToNearestPixel(
      size + (scale(size) - size) * factor
    )
  )

export const moderateVerticalScale = (size: number, factor = 0.5) =>
  Math.round(
    PixelRatio.roundToNearestPixel(
      size + (verticalScale(size) - size) * factor
    )
  )
