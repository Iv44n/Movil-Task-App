import Svg, { Path } from 'react-native-svg'

export default function ArrowRightUpIcon({ color }: { color: string }) {
  return (
    <Svg
      width={24}
      height={24}
      fill='none'
      viewBox='0 0 24 24'
    >
      <Path
        fill={color}
        fillRule='evenodd'
        d='M9 6.75a.75.75 0 010-1.5h9a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V7.81L6.53 18.53a.75.75 0 01-1.06-1.06L16.19 6.75H9z'
        clipRule='evenodd'
      />
    </Svg>
  )
}
