import LayoutBase from '@/components/LayoutBase'
import { Stack } from 'expo-router'
import { AuthContextProvider } from '@/context/AuthContext'
import i18n from '@/i18n'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
import { useEffect } from 'react'
import { LANG_STORAGE_KEY } from '@/constants/constants'
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { database } from '@/lib/watermelon'

export default function Layout() {
  useEffect(() => {
    const initLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem(LANG_STORAGE_KEY)
        i18n.locale = storedLang ?? getLocales()[0]?.languageCode ?? 'en'
      } catch (error) {
        console.error('Error loading language', error)
        i18n.locale = getLocales()[0]?.languageCode ?? 'en'
      }
    }
    initLanguage()
  }, [])

  return (
    <LayoutBase>
      <DatabaseProvider database={database}>
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
      </DatabaseProvider>
    </LayoutBase>
  )
}
