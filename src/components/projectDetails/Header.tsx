import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Typo from '../shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import Icon from '../icons/Icon'

interface Props {
  title: string
  onBack(): void
  onOptions(): void
}

export default function Header({ title, onBack, onOptions }: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onBack}
        style={styles.iconBtn}
      >
        <Icon.ArrowLeft size={23} />
      </TouchableOpacity>
      <Typo size={19} weight='600'>
        {title}
      </Typo>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onOptions}
        style={styles.iconBtn}
      >
        <Icon.HorizontalDotMenu size={23} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Sizes.spacing.s9
  },
  iconBtn: {
    padding: Sizes.spacing.s11,
    borderRadius: Shapes.rounded.circle,
    borderWidth: 1,
    borderColor: Colors.border
  }
})
