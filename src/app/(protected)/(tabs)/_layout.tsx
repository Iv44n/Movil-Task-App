import { Tabs } from 'expo-router'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Colors } from '@/constants/colors'
import HomeIcon from '@/components/icons/HomeIcon'
import UserIcon from '@/components/icons/UserIcon'

export default function TabsLayout() {
  const SCREEN_WIDTH = Dimensions.get('window').width
  const TAB_BAR_WIDTH = 120
  const TAB_BAR_HEIGHT = 60
  const horizontalOffset = (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.textBlack,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          height: TAB_BAR_HEIGHT,
          backgroundColor: Colors.card,
          borderRadius: 50,
          position: 'absolute',
          bottom: 30,
          borderColor: Colors.border,
          borderWidth: 1,
          borderTopWidth: 1,
          paddingBottom: 0,
          alignContent: 'center',
          marginHorizontal: horizontalOffset
        },
        tabBarShowLabel: false,
        tabBarIconStyle: {
          alignSelf: 'center',
          width: '100%',
          height: '100%',
          fontWeight: 'bold'
        }
      }}
    >
      <Tabs.Screen
        name='index' options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <HomeIcon color={color} />
            </View>
          )
        }}
      />
      <Tabs.Screen
        name='profile' options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <UserIcon color={color} />
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
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconActive: {
    backgroundColor: Colors.yellow
  }
})
