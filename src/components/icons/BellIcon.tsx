import Svg, { Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function BellIcon({
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
        d='M12 1.25A7.75 7.75 0 004.25 9v.704a3.53 3.53 0 01-.593 1.958L2.51 13.385c-1.334 2-.316 4.718 2.003 5.35.755.206 1.517.38 2.284.523l.002.005C7.567 21.315 9.622 22.75 12 22.75s4.433-1.435 5.202-3.487l.002-.005a28.472 28.472 0 002.284-.523c2.319-.632 3.337-3.35 2.003-5.35l-1.148-1.723a3.53 3.53 0 01-.593-1.958V9A7.75 7.75 0 0012 1.25zm3.376 18.287a28.46 28.46 0 01-6.753 0c.711 1.021 1.948 1.713 3.377 1.713 1.429 0 2.665-.692 3.376-1.713zM5.75 9a6.25 6.25 0 1112.5 0v.704c0 .993.294 1.964.845 2.79l1.148 1.723a2.02 2.02 0 01-1.15 3.071 26.96 26.96 0 01-14.187 0 2.021 2.021 0 01-1.15-3.07l1.15-1.724a5.03 5.03 0 00.844-2.79V9z'
        clipRule='evenodd'
      />
    </Svg>
  )
}
