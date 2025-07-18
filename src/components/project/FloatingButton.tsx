import { Shapes, Sizes } from '@/constants/theme'
import { Pressable, StyleSheet } from 'react-native'
import Icon from '../icons/Icon'

interface Props {
  onPress(): void
  color?: string
}

export default function FloatingButton({ onPress, color }: Props) {
  return (
    <Pressable
      style={[
        styles.fab,
        { bottom: Sizes.spacing.s15, backgroundColor: color || 'white' }
      ]}
      onPress={onPress}
    >
      <Icon.Add color='black' size={31}/>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Sizes.spacing.s13,
    width: Sizes.spacing.s55,
    height: Sizes.spacing.s55,
    borderRadius: Shapes.rounded.circle,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
