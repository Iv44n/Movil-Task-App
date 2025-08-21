import Svg, { Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function ClockCircleIcon({
  size = 25,
  color = Colors.primary,
  ...props }: IconProps) {
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
        d='M12 2.75a9.25 9.25 0 100 18.5 9.25 9.25 0 000-18.5zM1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12zM12 7.25a.75.75 0 01.75.75v3.69l2.28 2.28a.75.75 0 11-1.06 1.06l-2.5-2.5a.75.75 0 01-.22-.53V8a.75.75 0 01.75-.75z'
        clipRule='evenodd'
      />
    </Svg>
  )
}
