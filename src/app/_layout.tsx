import LayoutBase from '@/components/LayoutBase'
import { Stack } from 'expo-router'
import { AuthContextProvider } from '@/context/AuthContext'
import i18n from '@/i18n'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
import { useEffect, useRef, useState, useCallback } from 'react'
import { LANG_STORAGE_KEY } from '@/constants/constants'
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { database } from '@/lib/watermelon'
import { Typography } from '@/constants/theme'
import { useFonts } from 'expo-font'
import { useWelcomeDone } from '@/hooks/useWelcomeDone'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.setOptions({
  fade: true,
  duration: 500
})
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

  const [isReady, setIsReady] = useState(false)
  const initialRouteRef = useRef<string | null>(null)
  const { welcomeDone, isLoading } = useWelcomeDone()

  useEffect(() => {
    async function initLanguage() {
      try {
        const storedLang = await AsyncStorage.getItem(LANG_STORAGE_KEY)
        i18n.locale = storedLang ?? getLocales()[0]?.languageCode ?? 'en'
      } catch (error) {
        console.error('Error loading language', error)
        i18n.locale = getLocales()[0]?.languageCode ?? 'en'
      }
    }
    initialRouteRef.current = welcomeDone ? '(protected)' : 'welcome'
    initLanguage()
    setIsReady(true)
  }, [welcomeDone])

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) return null
  if (!initialRouteRef.current || !isReady || isLoading) return null

  return (
    <LayoutBase onLayout={onLayoutRootView}>
      <DatabaseProvider database={database}>
        <AuthContextProvider>
          <Stack
            initialRouteName={initialRouteRef.current}
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' }
            }}
          >
            <Stack.Screen name='welcome' options={{ animation: 'fade' }} />
            <Stack.Screen name='(auth)' options={{ animation: 'fade' }} />
            <Stack.Screen name='(protected)' options={{ animation: 'fade' }} />
          </Stack>
        </AuthContextProvider>
      </DatabaseProvider>
    </LayoutBase>
  )
}
