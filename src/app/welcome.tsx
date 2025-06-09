import ArrowRightIcon from '@/components/icons/ArrowRight'
import { Colors } from '@/constants/colors'
import { fontFamily } from '@/constants/fontFamily'
import { useRouter } from 'expo-router'
import { Storage } from 'expo-sqlite/kv-store'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

export default function Welcome() {
  const router = useRouter()

  const finishWelcome = async () => {
    await Storage.setItem('welcomeDone', 'true')
    router.replace('(protected)', { withAnchor: true })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/*Need Welcome Image/SVG */}

      <Text style={styles.appTitle}>
        <Text style={styles.titleHighlight}>Organize</Text>{'\n'}
        your projects and tasks
      </Text>

      <Text style={styles.appDescription}>
        Manage projects and standalone tasks—from daily routines and habits to complex workflows. Define start and due dates, break down work into subtasks, and track progress at a glance.
      </Text>

      <Pressable style={styles.button} onPress={finishWelcome}>
        <Text style={styles.buttonText}>Get Started</Text>
        <View style={styles.iconWrapper}>
          <ArrowRightIcon color={Colors.textPrimary} />
        </View>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 24
  },
  appTitle: {
    fontSize: 30,
    color: Colors.textPrimary,
    fontFamily: fontFamily.semiBold,
    marginBottom: 14
  },
  titleHighlight: {
    color: Colors.green,
    fontFamily: fontFamily.extraBold
  },
  appDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: fontFamily.regular,
    marginBottom: 24,
    lineHeight: 25
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: Colors.yellow,
    paddingVertical: 4,
    paddingRight: 5,
    paddingLeft: 24,
    borderRadius: 50,
    alignSelf: 'flex-start'
  },
  buttonText: {
    fontSize: 16,
    color: Colors.textBlack,
    fontWeight: '600',
    fontFamily: fontFamily.medium
  },
  iconWrapper: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 999
  }
})
