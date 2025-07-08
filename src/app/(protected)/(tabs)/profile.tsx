import { Colors } from '@/constants/theme'
import { supabase } from '@/lib/supabase'
import { Button, ScrollView, Text } from 'react-native'

export default function Profile() {

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>Profile Screen</Text>
      <Text style={{ color: '#fff', marginTop: 8 }}>This is the profile screen content.</Text>

      <Button title='Logout' onPress={handleSignOut} />
    </ScrollView>
  )
}
