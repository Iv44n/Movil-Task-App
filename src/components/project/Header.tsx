import { Pressable, StyleSheet, View } from 'react-native'
import ArrowLeftIcon from '../icons/ArrowLeftIcon'
import Typo from '../shared/Typo'
import HorizontalDotMenuIcon from '../icons/HorizontalDotMenuIcon'
import { Colors, Shapes, Sizes } from '@/constants/theme'

interface Props {
  title: string
  onBack(): void
  onOptions(): void
}

export default function Header({ title, onBack, onOptions }: Props) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.iconBtn}>
        <ArrowLeftIcon size={23} />
      </Pressable>
      <Typo size={19} weight='600'>
        {title}
      </Typo>
      <Pressable onPress={onOptions} style={styles.iconBtn}>
        <HorizontalDotMenuIcon size={23} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  iconBtn: {
    padding: Sizes.spacing.s11,
    borderRadius: Shapes.rounded.circle,
    borderWidth: 1,
    borderColor: Colors.border
  }
})
