import LayoutBase from '@/components/LayoutBase'
import { View } from 'react-native'
import OverlayHost from '@/components/OverlayHost'
import { Stack } from 'expo-router'
import AppEntry from '@/components/AppEntry'

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <OverlayHost />
      <AppEntry>
        {
          (initialRoute) => (
            <LayoutBase>
              <Stack
                initialRouteName={initialRoute}
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: 'transparent' }
                }}
              >
                <Stack.Screen name='welcome' options={{ animation: 'fade' }}/>
                <Stack.Screen name='(protected)' options={{ animation: 'fade' }} />
                <Stack.Screen name='(auth)' options={{ animation: 'fade' }}/>
              </Stack>
            </LayoutBase>
          )
        }
      </AppEntry>
    </View>
  )
}
