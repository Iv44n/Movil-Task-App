import { StyleSheet, View } from 'react-native'
import useBoundStore from '@/store/useBoundStore'
import { Colors, Sizes } from '@/constants/theme'
import Typo from '@/components/Typo'

export default function HomeHeader() {
  const user = useBoundStore((state) => state.user)
  const projectsLength = useBoundStore((state) => state.projects.length)

  return (
    <View style={styles.header}>
      <View>
        <Typo
          size={15}
          color={Colors.textSecondary}
          style={{
            marginBottom: Sizes.spacing.s7
          }}
        >
          Hi, {user?.username}!
        </Typo>
        <Typo size={27}>You Have</Typo>
        <Typo
          size={29}
          fontWeight='semiBold'
          style={{ textDecorationLine: 'underline' }}
        >
          {projectsLength} Projects
        </Typo>
      </View>
      {/*       <View style={styles.iconContainer}>
        <Ionicons
          name='mail-outline'
          size={24}
          color={Colors.textPrimary}
        />
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.spacing.s21
  }
})
