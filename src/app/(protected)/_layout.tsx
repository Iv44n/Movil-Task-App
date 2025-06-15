import ScreenWrapper from '@/components/ScreenWrapper'
import useBoundStore from '@/store/useBoundStore'
import { Redirect, Stack } from 'expo-router'

export default function ProtectedLayout() {
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Redirect href='/login' />
  }

  return (
    <ScreenWrapper>
      <Stack>
        <Stack.Screen
          name='(tabs)'
          options={{ headerShown: false }}
        />
      </Stack>
    </ScreenWrapper>
  )
}
