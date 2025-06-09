import { Colors } from '@/constants/colors'
import { initDatabase } from '@/lib/database/init'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fontFamily } from '@/constants/fontFamily'
import Storage from 'expo-sqlite/kv-store'
import { useAuth } from '@/hooks/useAuth'

SplashScreen.preventAutoHideAsync()

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    [fontFamily.extraLight]: require('../../assets/fonts/Manrope-ExtraLight.ttf'),
    [fontFamily.light]: require('../../assets/fonts/Manrope-Light.ttf'),
    [fontFamily.regular]: require('../../assets/fonts/Manrope-Regular.ttf'),
    [fontFamily.medium]: require('../../assets/fonts/Manrope-Medium.ttf'),
    [fontFamily.semiBold]: require('../../assets/fonts/Manrope-SemiBold.ttf'),
    [fontFamily.bold]: require('../../assets/fonts/Manrope-Bold.ttf'),
    [fontFamily.extraBold]: require('../../assets/fonts/Manrope-ExtraBold.ttf')
  })
  const [initialRoute, setInitialRoute] = useState<string | null>(null)
  const { isReady } = useAuth()

  useEffect(() => {
    const initializeApp = async () => {
      await initDatabase()

      const welcomeDone = await Storage.getItem('welcomeDone')
      setInitialRoute(welcomeDone === 'true' ? '(protected)' : 'welcome')
    }

    initializeApp()
  }, [])

  useEffect(() => {
    if ((fontsLoaded || fontError) && initialRoute !== null && isReady) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError, initialRoute, isReady])

  if ((!fontsLoaded && !fontError) || initialRoute === null || !isReady) {
    return null
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: Colors.background
    }}
    >
      <StatusBar style='inverted' />
      <Stack initialRouteName={initialRoute}>
        <Stack.Screen
          name='welcome'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='(protected)'
          options={{
            headerShown: false,
            animation: 'none'
          }}
        />
        <Stack.Screen
          name='login'
          options={{
            headerShown: false,
            animation: 'none'
          }}
        />
        <Stack.Screen
          name='register'
          options={{
            headerShown: false,
            animation: 'none'
          }}
        />
      </Stack>
    </SafeAreaView>
  )
}
