import Svg, { Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function CloseIcon({
  size = 25,
  color = Colors.primary
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox='0 0 1024 1024'
    >
      <Path
        fill={color}
        d='M764.288 214.592L512 466.88 259.712 214.592a31.936 31.936 0 00-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1045.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0045.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 10-45.12-45.184z'
      />
    </Svg>
  )
}
