import { useAuth } from '@/hooks/auth/useAuth'
import { Redirect, Stack } from 'expo-router'

export default function ProtectedLayout() {
  const { session } = useAuth()

  if (!session) {
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
    </Stack>
  )
}
