import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import Icon from '@/components/icons/Icon'

export default function Welcome() {
  const router = useRouter()

  const finishWelcome = async () => {
    await AsyncStorage.setItem('welcomeDone', 'true')
    router.replace('(protected)', { withAnchor: true })
  }

  return (
    <ScreenWrapper style={{ justifyContent: 'center' }}>
      {/*Need Welcome Image/SVG */}

      <Typo size={30} weight='600'>
        <Typo size={30} weight='800' color='green'>Organize</Typo>{'\n'}
        your projects and tasks
      </Typo>

      <Typo
        size={16}
        color='secondary'
        style={{
          marginTop: Sizes.spacing.s7,
          marginBottom: Sizes.spacing.s21
        }}
      >
        Manage projects and standalone tasks—from daily routines and habits to complex workflows. Define start and due dates, break down work into subtasks, and track progress at a glance.
      </Typo>

      <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={finishWelcome}>
        <Typo size={16} color='black' weight='500'>Get Started</Typo>
        <View style={styles.iconWrapper}>
          <Icon.ArrowRight color={Colors.primary} />
        </View>
      </TouchableOpacity>
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
    borderRadius: Shapes.rounded.xl,
    alignSelf: 'flex-start'
  },
  iconWrapper: {
    marginLeft: Sizes.spacing.s15,
    backgroundColor: Colors.background,
    padding: Sizes.spacing.s11,
    borderRadius: Shapes.rounded.circle
  }
})
