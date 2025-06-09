import Svg, { Path } from 'react-native-svg'

export default function ArrowRightIcon ({ color }: { color: string }) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      stroke={color}
    >
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13.47 5.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06l4.72-4.72H4a.75.75 0 010-1.5h14.19l-4.72-4.72a.75.75 0 010-1.06z'
        fill={color}
      />
    </Svg>
  )
}
