import { useAuth, useSignUp } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import { Storage } from 'expo-sqlite/kv-store'

export default function ProtectedLayout() {
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp()
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth()
  const signUpParam = Storage.getItemSync('signUp')

  if (!isAuthLoaded || !isSignUpLoaded) return null

  const needsToCompleteSignUp = signUpParam === 'true' && signUp.status === 'missing_requirements' && signUp.missingFields.length > 0

  if (needsToCompleteSignUp) {
    return <Redirect href='/complete-auth' />
  }

  if (!isSignedIn) {
    return <Redirect href='/login' />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' }
      }}
    >
      <Stack.Screen
        name='(tabs)'
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name='project/[id]'
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name='project/create'
        options={{
          animation: 'fade_from_bottom',
          presentation: 'modal'
        }}
      />
    </Stack>
  )
}
