import Svg, { G, Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function CheckIcon({
  color = Colors.primary,
  size = 25,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      fill='none'
      viewBox='.5 .3 23 23'
      {...props}
    >
      <G fill={color}>
        <Path d='M16.03 10.03a.75.75 0 10-1.06-1.06l-4.47 4.47-1.47-1.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l5-5z' />

      </G>
    </Svg>
  )
}
