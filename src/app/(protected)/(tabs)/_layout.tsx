import { Tabs } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { Colors, Shapes } from '@/constants/theme'
import HomeIcon from '@/components/icons/HomeIcon'
import UserIcon from '@/components/icons/UserIcon'
import TabBar from '@/components/TabBar'

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' }
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <HomeIcon color={color} size={size}/>
            </View>
          )
        }}
      />
      <Tabs.Screen
        name='profile' options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused, size }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <UserIcon color={color} size={size}/>
            </View>
          )
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    width: '100%',
    height: '100%',
    borderRadius: Shapes.rounded.circle,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconActive: {
    borderRadius: Shapes.rounded.circle,
    backgroundColor: Colors.yellow
  }
})
