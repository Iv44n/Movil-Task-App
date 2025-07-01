import Typo from '@/components/Typo'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useDrizzleDbContext } from '@/contexts/DrizzleDbContext'
import { useFonts } from 'expo-font'
import { Colors, Typography } from '@/constants/theme'
import { useWelcomeDone } from '@/hooks/useWelcomeDone'

export default function Index() {
  const [fontsLoaded] = useFonts({
    [Typography.fontFamily.extraLight]: require('../../assets/fonts/Manrope-ExtraLight.ttf'),
    [Typography.fontFamily.light]: require('../../assets/fonts/Manrope-Light.ttf'),
    [Typography.fontFamily.regular]: require('../../assets/fonts/Manrope-Regular.ttf'),
    [Typography.fontFamily.medium]: require('../../assets/fonts/Manrope-Medium.ttf'),
    [Typography.fontFamily.semiBold]: require('../../assets/fonts/Manrope-SemiBold.ttf'),
    [Typography.fontFamily.bold]: require('../../assets/fonts/Manrope-Bold.ttf'),
    [Typography.fontFamily.extraBold]: require('../../assets/fonts/Manrope-ExtraBold.ttf')
  })

  const router = useRouter()
  const { success } = useDrizzleDbContext()
  const { welcomeDone, isLoading } = useWelcomeDone()

  useEffect(() => {
    if (success === undefined || !fontsLoaded || isLoading || welcomeDone === null) return

    console.log('✅ All migrations completed successfully.')

    const t = setTimeout(() => {
      const route = success && welcomeDone ? '(protected)' : 'welcome'
      router.replace(route, { withAnchor: true })
    }, 1200)

    return () => clearTimeout(t)
  }, [router, success, fontsLoaded, welcomeDone, isLoading])

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.duration(1200)}
      >
        <Typo size={25} fontWeight='bold'>
          Loading...
        </Typo>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
