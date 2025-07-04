import { useSessionContext } from '@/contexts/SessionContext'
import { Redirect, Stack } from 'expo-router'

export default function AuthLayout () {
  const { session } = useSessionContext()

  if (session) {
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
    </Stack>
  )
}
