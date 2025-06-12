import Svg, { Path } from 'react-native-svg'

export default function ArrowLeftIcon({ color }: { color: string }) {
  return (
    <Svg
      width={22}
      height={22}
      fill='none'
      viewBox='0 -2 24 24'
    >
      <Path
        fill={color}
        fillRule='evenodd'
        d='M10.53 5.47a.75.75 0 010 1.06l-4.72 4.72H20a.75.75 0 010 1.5H5.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z'
        clipRule='evenodd'
      />
    </Svg>
  )
}
