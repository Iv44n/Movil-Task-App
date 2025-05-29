import { ScrollView } from 'react-native'
import HomeHeader from './header'

export default function HomeScreen() {
  return (
    <ScrollView style={{ padding: 2 }}>
      <HomeHeader />
    </ScrollView>
  )
}
