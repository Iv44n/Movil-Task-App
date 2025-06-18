import useBoundStore from '@/store/useBoundStore'
import { Redirect, Stack } from 'expo-router'

export default function ProtectedLayout() {
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
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
