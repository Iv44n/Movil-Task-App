import { Colors } from '@/constants/colors'
import { initDatabase } from '@/lib/database/init'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { fontFamily } from '@/constants/fontFamily'
import Storage from 'expo-sqlite/kv-store'
import useBoundStore from '@/store/useBoundStore'

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

  const initialRouteRef = useRef<string | null>(null)
  const checkAuth = useBoundStore((state) => state.checkAuth)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let mounted = true
    const initializeApp = async () => {

      const [welcomeDone] = await Promise.all([
        Storage.getItem('welcomeDone'),
        initDatabase(),
        checkAuth()
      ])

      initialRouteRef.current = welcomeDone === 'true'
        ? '(protected)'
        : 'welcome'

      if (mounted) setIsReady(true)
    }

    initializeApp()

    return () => {
      mounted = false
    }
  }, [checkAuth])

  useEffect(() => {
    if ((fontsLoaded || fontError) && initialRouteRef.current && isReady) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError, isReady])

  if ((!fontsLoaded && !fontError) || !initialRouteRef.current || !isReady) return null

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style='inverted' />
      <Stack initialRouteName={initialRouteRef.current}>
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
            animation: 'simple_push'
          }}
        />
        <Stack.Screen
          name='(auth)'
          options={{
            headerShown: false,
            animation: 'fade_from_bottom'
          }}
        />
      </Stack>
    </SafeAreaView>
  )
}
