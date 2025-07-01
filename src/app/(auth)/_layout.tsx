import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'

export default function AuthLayout () {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href='(protected)' />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: 'transparent' }
      }}
    >
      <Stack.Screen name='login'/>
      <Stack.Screen name='register'/>
      <Stack.Screen name='verify-email' options={{ animation: 'fade' }}/>
      <Stack.Screen name='complete-auth' options={{ animation: 'fade' }}/>
    </Stack>
  )
}
