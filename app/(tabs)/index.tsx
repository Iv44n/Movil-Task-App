import HomeScreen from '@/screens/Home'
import { ScrollView } from 'react-native'

export default function Index() {
  return (
    <ScrollView style={{ padding: 16, backgroundColor: '#1a1a1a' }}>
      <HomeScreen />
    </ScrollView>
  )
}
