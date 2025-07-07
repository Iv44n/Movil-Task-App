import Svg, { Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function ArrowRightUpIcon({
  color = Colors.primary,
  size = 25
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      fill='none'
      viewBox='1 0 23 23'
    >
      <Path
        fill={color}
        fillRule='evenodd'
        d='M9 6.75a.75.75 0 010-1.5h9a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V7.81L6.53 18.53a.75.75 0 01-1.06-1.06L16.19 6.75H9z'
        clipRule='evenodd'
      />
    </Svg>
  )
}
