import { Colors } from '@/constants/theme'
import useBoundStore from '@/store/useBoundStore'
import { Button, ScrollView, Text } from 'react-native'

export default function Profile() {
  const logout = useBoundStore((state) => state.logout)

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>Profile Screen</Text>
      <Text style={{ color: '#fff', marginTop: 8 }}>This is the profile screen content.</Text>

      <Button title='Logout' onPress={logout} />
    </ScrollView>
  )
}
