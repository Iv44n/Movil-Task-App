import LayoutBase from '@/components/LayoutBase'
import { Stack } from 'expo-router'
import { AuthContextProvider } from '@/context/AuthContext'

export default function Layout() {
  return (
    <LayoutBase>
      <AuthContextProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' }
          }}
        >
          <Stack.Screen name='index' options={{ animation: 'fade', animationDuration: 1000 }}/>
          <Stack.Screen name='welcome' options={{ animation: 'fade' }}/>
          <Stack.Screen name='(auth)' options={{ animation: 'fade' }}/>
          <Stack.Screen name='(protected)' options={{ animation: 'fade' }} />
        </Stack>
      </AuthContextProvider>
    </LayoutBase>
  )
}
