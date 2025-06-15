import ScreenWrapper from '@/components/ScreenWrapper'
import HomeScreen from '@/screens/Home'

export default function Index() {
  return (
    <ScreenWrapper paddingHorizontal={0} isScrollable={true}>
      <HomeScreen />
    </ScreenWrapper>
  )
}
