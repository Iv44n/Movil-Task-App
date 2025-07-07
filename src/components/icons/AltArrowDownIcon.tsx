import Svg, { Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function AltArrowDownIcon({
  color = Colors.primary,
  size = 25
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      fill='none'
      viewBox='0 -2 23 23'
    >
      <Path
        fill={color}
        fillRule='evenodd'
        d='M4.43 8.512a.75.75 0 011.058-.081L12 14.012l6.512-5.581a.75.75 0 01.976 1.138l-7 6a.75.75 0 01-.976 0l-7-6a.75.75 0 01-.081-1.057z'
        clipRule='evenodd'
      />
    </Svg>
  )
}
