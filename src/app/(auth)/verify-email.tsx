import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import ScreenWrapper from '@/components/ScreenWrapper'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import VerifyEmailForm from '@/modules/auth/components/VerifyEmailForm'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

export default function VerifyEmail() {
  const router = useRouter()
  const { emailAddress } = useLocalSearchParams<{ emailAddress: string }>()

  const handleGoBack = () => router.replace('/login')

  return (
    <ScreenWrapper style={{ justifyContent: 'space-between', paddingHorizontal: Sizes.spacing.s15 }}>
      <View style={styles.topContainer}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeftIcon />
        </Pressable>
      </View>
      <View style={styles.centerContainer}>
        <VerifyEmailForm emailAddress={emailAddress} />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: Sizes.spacing.s15
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    padding: Sizes.spacing.s11,
    borderRadius: Shapes.rounded.full,
    borderWidth: 1,
    borderColor: Colors.border
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
