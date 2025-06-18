import useBoundStore from '@/store/useBoundStore'
import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'

export default function AuthLayout () {
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('(protected)', { withAnchor: true })
    }
  }, [isAuthenticated, router])

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
