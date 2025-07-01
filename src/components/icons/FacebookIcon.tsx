import Svg, { G, Path } from 'react-native-svg'
import { IconProps } from '.'

export default function FacebookIcon({ size = 25 }: IconProps) {
  return (
    <Svg
      width={size + 4}
      height={size + 4}
      viewBox='-0.5 0 100 100'
    >
      <G id='SVGRepo_iconCarrier'>
        <G id='Layer_2'>
          <Path
            fill='#1877f2'
            d='M50 2.5c-58.892 1.725-64.898 84.363-7.46 95h14.92c57.451-10.647 51.419-93.281-7.46-95z'
          />
          <Path
            fill='#f1f1f1'
            d='M57.46 64.104h11.125l2.117-13.814H57.46v-8.965c0-3.779 1.85-7.463 7.781-7.463h6.021V22.101c-12.894-2.323-28.385-1.616-28.722 17.66V50.29H30.417v13.814H42.54V97.5h14.92V64.104z'
          />
        </G>
      </G>
    </Svg>
  )
}
