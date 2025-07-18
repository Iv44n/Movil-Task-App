import { Colors } from '@/constants/theme'
import Svg, { Circle } from 'react-native-svg'
import { IconProps } from '.'

export default function HorizontalDotMenuIcon({
  size = 25,
  color = Colors.primary,
  ...props
}: IconProps) {
  const radius = 2
  const centerY = 12.25

  return (
    <Svg width={size} height={size} viewBox='0 0 23 23' fill='none' {...props}>
      <Circle cx={4} cy={centerY} r={radius} fill={color} />
      <Circle cx={12} cy={centerY} r={radius} fill={color} />
      <Circle cx={20} cy={centerY} r={radius} fill={color} />
    </Svg>
  )
}
