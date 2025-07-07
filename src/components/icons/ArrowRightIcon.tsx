import Svg, { Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function ArrowRightIcon ({
  size = 25,
  color = Colors.primary
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox='1 0 23 23'
      fill='none'
      stroke={color}
    >
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13.47 5.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06l4.72-4.72H4a.75.75 0 010-1.5h14.19l-4.72-4.72a.75.75 0 010-1.06z'
        fill={color}
      />
    </Svg>
  )
}
