import Svg, { G, Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function CheckCircleIcon({
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
        <Path d='M16.03 10.03a.75.75 0 10-1.06-1.06l-4.47 4.47-1.47-1.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l5-5z' />
        <Path
          fillRule='evenodd'
          d='M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25zM2.75 12a9.25 9.25 0 1118.5 0 9.25 9.25 0 01-18.5 0z'
          clipRule='evenodd'
        />
      </G>
    </Svg>
  )
}
