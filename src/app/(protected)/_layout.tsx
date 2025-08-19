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
        name='project/[projectId]'
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name='project/task/[taskId]'
        options={{ animation: 'fade_from_bottom', presentation: 'modal' }}
      />
      <Stack.Screen
        name='profile/language'
        options={{ animation: 'fade_from_bottom', presentation: 'modal' }}
      />
    </Stack>
  )
}
