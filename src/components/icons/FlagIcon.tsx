import Svg, { Path } from 'react-native-svg'
import { IconProps } from '.'
import { Colors } from '@/constants/theme'

export default function FlagIcon({
  size = 25,
  color = Colors.primary,
  ...props }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      fill={color}
      viewBox='0 0 23 23'
      {...props}
    >
      <Path
        fill={color}
        fillRule='evenodd'
        d='M5 1.25a.75.75 0 01.75.75v1.085l1.574-.315a9.427 9.427 0 015.35.492l.203.081a7.249 7.249 0 004.45.302 1.95 1.95 0 012.423 1.892v7.367c0 .988-.673 1.85-1.632 2.09l-.214.053a9.427 9.427 0 01-5.788-.393 7.927 7.927 0 00-4.498-.413l-1.868.374V22a.75.75 0 01-1.5 0V2A.75.75 0 015 1.25zm.75 11.835l1.574-.315a9.428 9.428 0 015.35.492 7.927 7.927 0 004.866.33l.215-.054a.654.654 0 00.495-.634V5.537a.45.45 0 00-.559-.437 8.749 8.749 0 01-5.371-.364l-.204-.082a7.927 7.927 0 00-4.498-.413l-1.868.374v8.47z'
        clipRule='evenodd'
      />
    </Svg>
  )
}
