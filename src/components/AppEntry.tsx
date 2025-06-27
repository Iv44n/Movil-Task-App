import { Typography } from '@/constants/theme'
import { initDatabase } from '@/lib/database/init'
import useBoundStore from '@/store/useBoundStore'
import { useFonts } from 'expo-font'
import { Storage } from 'expo-sqlite/kv-store'
import { useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'

function AppEntry({ children }: { children: (initialRoute: string) => React.ReactElement }) {
  const [fontsLoaded, fontError] = useFonts({
    [Typography.fontFamily.extraLight]: require('../../assets/fonts/Manrope-ExtraLight.ttf'),
    [Typography.fontFamily.light]: require('../../assets/fonts/Manrope-Light.ttf'),
    [Typography.fontFamily.regular]: require('../../assets/fonts/Manrope-Regular.ttf'),
    [Typography.fontFamily.medium]: require('../../assets/fonts/Manrope-Medium.ttf'),
    [Typography.fontFamily.semiBold]: require('../../assets/fonts/Manrope-SemiBold.ttf'),
    [Typography.fontFamily.bold]: require('../../assets/fonts/Manrope-Bold.ttf'),
    [Typography.fontFamily.extraBold]: require('../../assets/fonts/Manrope-ExtraBold.ttf')
  })
  const [isReadyApp, setIsReadyApp] = useState(false)
  const checkAuth = useBoundStore((state) => state.checkAuth)
  const initialRouteRef = useRef<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initializeApp = async () => {

      await initDatabase()

      const [welcomeDone] = await Promise.all([
        Storage.getItem('welcomeDone'),
        checkAuth()
      ])

      initialRouteRef.current = welcomeDone === 'true'
        ? '(protected)'
        : 'welcome'

      if (mounted) setIsReadyApp(true)
    }

    initializeApp()

    return () => {
      mounted = false
    }
  }, [checkAuth])

  if ((!fontsLoaded && !fontError) || !initialRouteRef.current || !isReadyApp) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'red'
        }}
      >
        <Text>Loading...</Text>
      </View>
    )
  }

  return children(initialRouteRef.current)
}

export default AppEntry
