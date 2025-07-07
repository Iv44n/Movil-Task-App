import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function CircleIcon({
  color = Colors.primary,
  size = 25
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      fill='none'
      viewBox='0 0 23 23'
    >
      <Path
        fill={color}
        fillRule='evenodd'
        d='M12 2.75a9.25 9.25 0 100 18.5 9.25 9.25 0 000-18.5zM1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12z'
        clipRule='evenodd'
      />
    </Svg>
  )
}
