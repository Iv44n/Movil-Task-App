import { Colors } from '@/constants/colors'
import useBoundStore from '@/store/useBoundStore'
import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'

export default function AuthLayout () {
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('(protected)', { withAnchor: true })
    }
  }, [isAuthenticated, router])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name='login'
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name='register'
          options={{ animation: 'fade_from_bottom' }}
        />
      </Stack>
    </View>
  )
}
