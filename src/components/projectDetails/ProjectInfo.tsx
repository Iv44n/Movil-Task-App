import Typo from '@/components/shared/Typo'
import { Sizes } from '@/constants/theme'
import { View, StyleSheet } from 'react-native'

export default function ProjectInfo({ firstPart, remaining, description }: {
  firstPart: string
  remaining?: string
  description?: string
}) {
  return (
    <View style={styles.titleSection}>
      <Typo size={23} weight='400' color={remaining ? 'secondary' : 'primary'}>
        {firstPart}
      </Typo>
      {remaining && (
        <Typo size={27} weight='600' color='primary'>
          {remaining}
        </Typo>
      )}
      {description && (
        <Typo
          style={styles.description}
          size={15}
          weight='500'
          color='secondary'
          numberOfLines={3}
        >
          {description}
        </Typo>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  titleSection: {
    marginTop: Sizes.spacing.s15
  },
  description: {
    marginTop: Sizes.spacing.s11
  }
})
