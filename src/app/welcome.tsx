import ArrowRightIcon from '@/components/icons/ArrowRightIcon'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { Storage } from 'expo-sqlite/kv-store'
import { Pressable, StyleSheet, View } from 'react-native'

export default function Welcome() {
  const router = useRouter()

  const finishWelcome = async () => {
    await Storage.setItem('welcomeDone', 'true')
    router.replace('(protected)', { withAnchor: true })
  }

  return (
    <ScreenWrapper style={{ justifyContent: 'center' }}>
      {/*Need Welcome Image/SVG */}

      <Typo size={30} fontWeight='semiBold'>
        <Typo size={30} fontWeight='extraBold' color={Colors.green}>Organize</Typo>{'\n'}
        your projects and tasks
      </Typo>

      <Typo
        size={16}
        color={Colors.textSecondary}
        style={{
          marginTop: Sizes.spacing.s7,
          marginBottom: Sizes.spacing.s21
        }}
      >
        Manage projects and standalone tasks—from daily routines and habits to complex workflows. Define start and due dates, break down work into subtasks, and track progress at a glance.
      </Typo>

      <Pressable style={styles.button} onPress={finishWelcome}>
        <Typo size={16} color={Colors.textBlack} fontWeight='medium'>Get Started</Typo>
        <View style={styles.iconWrapper}>
          <ArrowRightIcon color={Colors.textPrimary} />
        </View>
      </Pressable>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.yellow,
    paddingVertical: Sizes.spacing.s5,
    paddingRight: Sizes.spacing.s5,
    paddingLeft: Sizes.spacing.s21,
    borderRadius: Shapes.rounded.large,
    alignSelf: 'flex-start'
  },
  iconWrapper: {
    marginLeft: Sizes.spacing.s15,
    backgroundColor: Colors.background,
    padding: Sizes.spacing.s11,
    borderRadius: Shapes.rounded.full
  }
})
