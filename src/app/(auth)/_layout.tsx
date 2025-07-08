import { useAuth } from '@/hooks/auth/useAuth'
import { Redirect, Stack } from 'expo-router'
import * as Linking from 'expo-linking'

export default function AuthLayout () {
  const url = Linking.useLinkingURL()
  const { session, createdSessionFromUrl } = useAuth()

  if (session) {
    return <Redirect href='(protected)' />
  }

  if (url) createdSessionFromUrl(url)

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
    </Stack>
  )
}
