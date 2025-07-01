import LayoutBase from '@/components/LayoutBase'
import { SQLiteProvider } from 'expo-sqlite'
import { DrizzleDbProvider } from '@/contexts/DrizzleDbContext'
import { Stack } from 'expo-router'
import { View } from 'react-native'
import { Colors } from '@/constants/theme'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <SQLiteProvider
        databaseName='task-test'
        options={{
          enableChangeListener: true,
          useNewConnection: true
        }}
      >
        <ClerkProvider tokenCache={tokenCache}>
          <DrizzleDbProvider>
            <LayoutBase>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: 'transparent' }
                }}
              >
                <Stack.Screen name='index' options={{ animation: 'fade', animationDuration: 1000 }}/>
                <Stack.Screen name='welcome' options={{ animation: 'fade' }}/>
                <Stack.Screen name='(auth)' options={{ animation: 'fade' }}/>
                <Stack.Screen name='(protected)' options={{ animation: 'fade' }} />
              </Stack>
            </LayoutBase>
          </DrizzleDbProvider>
        </ClerkProvider>
      </SQLiteProvider>
    </View>
  )
}
