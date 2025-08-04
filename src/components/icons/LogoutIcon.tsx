import Svg, { G, Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function LogoutIcon({
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
        <Path d='M12 3.25a.75.75 0 010 1.5 7.25 7.25 0 000 14.5.75.75 0 010 1.5 8.75 8.75 0 110-17.5z' />
        <Path d='M16.47 9.53a.75.75 0 011.06-1.06l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H10a.75.75 0 010-1.5h8.19l-1.72-1.72z' />
      </G>
    </Svg>
  )
}
