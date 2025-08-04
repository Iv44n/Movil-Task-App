import Svg, { Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function AltArrowRightIcon({
  color = Colors.primary,
  size = 25,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      fill='none'
      viewBox='0 0 23 23'
      {...props}
    >
      <Path
        fill={color}
        fillRule='evenodd'
        d='M8.512 4.43a.75.75 0 011.057.082l6 7a.75.75 0 010 .976l-6 7a.75.75 0 01-1.138-.976L14.012 12 8.431 5.488a.75.75 0 01.08-1.057z'
        clipRule='evenodd'
      />
    </Svg>
  )
}
