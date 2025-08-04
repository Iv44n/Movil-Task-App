import Svg, { G, Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function DangerCircleIcon({
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
      <G fill={color}>
        <Path d='M12 6.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V7a.75.75 0 01.75-.75zM12 17a1 1 0 100-2 1 1 0 000 2z' />
        <Path
          fillRule='evenodd'
          d='M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12zM12 2.75a9.25 9.25 0 100 18.5 9.25 9.25 0 000-18.5z'
          clipRule='evenodd'
        />
      </G>
    </Svg>
  )
}
