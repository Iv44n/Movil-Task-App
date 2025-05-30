import { Colors } from '@/constants/colors'
import { ScrollView, Text } from 'react-native'

export default function Profile() {
  return (
    <ScrollView style={{ padding: 16, backgroundColor: Colors.background }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>Profile Screen</Text>
      <Text style={{ color: '#fff', marginTop: 8 }}>This is the profile screen content.</Text>
    </ScrollView>
  )
}
