import { Colors } from '@/constants/colors'
import { useAuth } from '@/hooks/useAuth'
import { Button, ScrollView, Text } from 'react-native'

export default function Profile() {
  const { logout } = useAuth()
  return (
    <ScrollView style={{ padding: 16, backgroundColor: Colors.background }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>Profile Screen</Text>
      <Text style={{ color: '#fff', marginTop: 8 }}>This is the profile screen content.</Text>

      <Button title='Logout' onPress={logout} />
    </ScrollView>
  )
}
