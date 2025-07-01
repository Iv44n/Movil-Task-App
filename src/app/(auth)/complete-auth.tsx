import { View, Pressable, StyleSheet } from 'react-native'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import CompleteAuthForm from '@/modules/auth/components/CompleteAuthForm'
import { Redirect, useRouter } from 'expo-router'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon'
import { useSignUp } from '@clerk/clerk-expo'

export default function CompleteAuth() {
  const router = useRouter()
  const { signUp, isLoaded } = useSignUp()

  const handleGoBack = () => router.replace('/login')

  if(!isLoaded) {
    return null
  }

  if(signUp.status !== 'missing_requirements') {
    return <Redirect href='(protected)' />
  }

  return(
    <ScreenWrapper
      style={{
        justifyContent: 'space-between',
        paddingHorizontal: Sizes.spacing.s15
      }}
    >
      <View style={styles.topContainer}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeftIcon />
        </Pressable>
      </View>
      <View style={styles.centerContainer}>
        <View style={styles.titleContainer}>
          <Typo size={25} fontWeight='bold' color={Colors.yellow}>Complete authentication</Typo>
          <Typo size={15} color={Colors.textSecondary}>
            Complete your authentication to start using the app.
          </Typo>
        </View>
        <CompleteAuthForm />
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
    justifyContent: 'center'
  },
  titleContainer: {
    marginBottom: Sizes.spacing.s21
  }
})
