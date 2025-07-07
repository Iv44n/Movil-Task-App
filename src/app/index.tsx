import Typo from '@/components/shared/Typo'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useFonts } from 'expo-font'
import { Colors, Typography } from '@/constants/theme'
import { useWelcomeDone } from '@/hooks/useWelcomeDone'
import { useAuth } from '@/hooks/auth/useAuth'

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
  const { welcomeDone, isLoading } = useWelcomeDone()
  const { isLoaded } = useAuth()

  useEffect(() => {
    if (!fontsLoaded || isLoading || welcomeDone === null || isLoaded === false) return

    const route = welcomeDone ? '(protected)' : 'welcome'
    router.replace(route, { withAnchor: true })

  }, [router, fontsLoaded, welcomeDone, isLoading, isLoaded])

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.duration(450)}
      >
        <Typo size={25} weight='700'>
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
