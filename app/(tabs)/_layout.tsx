import { Tabs } from 'expo-router'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function TabsLayout() {
  const SCREEN_WIDTH = Dimensions.get('window').width
  const TAB_BAR_WIDTH = 120
  const TAB_BAR_HEIGHT = 60
  const horizontalOffset = (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarStyle: {
          height: TAB_BAR_HEIGHT,
          backgroundColor: '#242424',
          borderRadius: 50,
          position: 'absolute',
          bottom: 30,
          borderColor: '#2b2b2b',
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
        },
        tabBarIcon: ({ focused, color }) => (
          <View style={[styles.iconContainer, focused && styles.iconActive]}>
            <Ionicons
              name={
                route.name === 'index'
                  ? 'home-outline'
                  : route.name === 'profile'
                    ? 'person-outline'
                    : 'ellipse'

              }
              size={24}
              color={color}
            />
          </View>
        )
      })}
    >
      <Tabs.Screen name='index' options={{ title: 'Home' }} />
      <Tabs.Screen name='profile' options={{ title: 'Profile' }} />
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
    backgroundColor: '#f1e053'
  }
})
