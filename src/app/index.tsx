import { useEffect, useState } from 'react'
import { Redirect } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from 'expo-font'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
import { useWelcomeDone } from '@/hooks/useWelcomeDone'
import { Typography } from '@/constants/theme'
import { useAuth } from '@clerk/clerk-expo'
import { LANG_STORAGE_KEY } from '@/constants/constants'
import i18n from '@/i18n'

SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions({
  fade: true,
  duration: 500
})

const fontMap = {
  [Typography.fontFamily.extraLight]: require('../../assets/fonts/Manrope-ExtraLight.ttf'),
  [Typography.fontFamily.light]: require('../../assets/fonts/Manrope-Light.ttf'),
  [Typography.fontFamily.regular]: require('../../assets/fonts/Manrope-Regular.ttf'),
  [Typography.fontFamily.medium]: require('../../assets/fonts/Manrope-Medium.ttf'),
  [Typography.fontFamily.semiBold]: require('../../assets/fonts/Manrope-SemiBold.ttf'),
  [Typography.fontFamily.bold]: require('../../assets/fonts/Manrope-Bold.ttf'),
  [Typography.fontFamily.extraBold]: require('../../assets/fonts/Manrope-ExtraBold.ttf')
}

export default function IndexScreen() {
  const [fontsLoaded] = useFonts(fontMap)
  const { welcomeDone, isLoading } = useWelcomeDone()
  const { isLoaded, isSignedIn } = useAuth()
  const [langReady, setLangReady] = useState(false)

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        /*
        await database.write(async () => {
          await database.unsafeResetDatabase()
        })
        */
        const storedLang = await AsyncStorage.getItem(LANG_STORAGE_KEY)
        i18n.locale = storedLang ?? getLocales()[0]?.languageCode ?? 'en'
      } catch (error) {
        console.error('Error loading language', error)
        i18n.locale = getLocales()[0]?.languageCode ?? 'en'
      } finally {
        setLangReady(true)
      }
    }

    loadLanguage()
  }, [])

  const ready = fontsLoaded && !isLoading && isLoaded && langReady && isSignedIn !== undefined

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync()
    }
  }, [ready])

  if (!ready) return null

  const redirectPath = !welcomeDone
    ? 'welcome'
    : isSignedIn
      ? '(protected)'
      : '(auth)/login'

  return <Redirect href={redirectPath} />
}
