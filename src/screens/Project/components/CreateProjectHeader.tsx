import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import Typo from '@/components/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { Router } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

export default function CreateProjectHeader({ router }: { router: Router }) {
  return (
    <View style={styles.header}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeftIcon />
      </Pressable>
      <Typo size={25} fontWeight='bold'>
        Create a new project
      </Typo>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    gap: Sizes.spacing.s5,
    marginBottom: Sizes.spacing.s15
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: Sizes.spacing.s11,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Shapes.rounded.full
  }
})
