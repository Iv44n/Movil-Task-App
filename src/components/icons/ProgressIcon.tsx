import Svg, { G, Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function ProgressIcon ({
  color = Colors.primary,
  size = 25
}: IconProps) {
  return(
    <Svg
      width={size}
      height={size}
      viewBox='1 0 23 23'
      fill='none'
    >
      <G
        stroke={color}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <Path d='M12 6V3M12 21v-2M19 12h2M3 12h3M17.657 6.343l.707-.707M5.636 18.364L7.05 16.95M16.95 16.95l1.414 1.414M5.636 5.636l2.121 2.121' />
      </G>
    </Svg>
  )
}
