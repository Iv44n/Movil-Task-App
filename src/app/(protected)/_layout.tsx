import { useAuth } from '@/hooks/useAuth'
import { Redirect, Stack } from 'expo-router'

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Redirect href='/login' />
  }

  return (
    <Stack>
      <Stack.Screen
        name='(tabs)'
        options={{ headerShown: false }}
      />
    </Stack>
  )
}
