import { Colors } from '@/constants/colors'
import HomeScreen from '@/screens/Home'
import { ScrollView } from 'react-native'

export default function Index() {
  return (
    <ScrollView style={{ padding: 16, backgroundColor: Colors.background }}>
      <HomeScreen />
    </ScrollView>
  )
}
