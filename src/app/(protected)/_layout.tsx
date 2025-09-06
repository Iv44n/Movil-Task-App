import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'

export default function ProtectedLayout() {
  const { isSignedIn } = useAuth()

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
        name='subscription'
        options={{ animation: 'fade_from_bottom', presentation: 'modal' }}
      />
      <Stack.Screen
        name='project/[projectId]'
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name='project/task/[id]'
        options={{ animation: 'fade_from_bottom', presentation: 'modal' }}
      />
      <Stack.Screen
        name='profile/language'
        options={{ animation: 'fade_from_bottom', presentation: 'modal' }}
      />
    </Stack>
  )
}
