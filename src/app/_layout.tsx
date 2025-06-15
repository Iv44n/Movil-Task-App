import { initDatabase } from '@/lib/database/init'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import Storage from 'expo-sqlite/kv-store'
import useBoundStore from '@/store/useBoundStore'
import { Typography } from '@/constants/theme'
import LayoutBase from '@/components/LayoutBase'

SplashScreen.preventAutoHideAsync()

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    [Typography.fontFamily.extraLight]: require('../../assets/fonts/Manrope-ExtraLight.ttf'),
    [Typography.fontFamily.light]: require('../../assets/fonts/Manrope-Light.ttf'),
    [Typography.fontFamily.regular]: require('../../assets/fonts/Manrope-Regular.ttf'),
    [Typography.fontFamily.medium]: require('../../assets/fonts/Manrope-Medium.ttf'),
    [Typography.fontFamily.semiBold]: require('../../assets/fonts/Manrope-SemiBold.ttf'),
    [Typography.fontFamily.bold]: require('../../assets/fonts/Manrope-Bold.ttf'),
    [Typography.fontFamily.extraBold]: require('../../assets/fonts/Manrope-ExtraBold.ttf')
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
    <LayoutBase>
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
            animation: 'fade'
          }}
        />
        <Stack.Screen
          name='(auth)'
          options={{
            headerShown: false,
            animation: 'fade'
          }}
        />
      </Stack>
    </LayoutBase>
  )
}
