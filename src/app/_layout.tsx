import { GestureHandlerRootView } from 'react-native-gesture-handler'
import LayoutBase from '@/components/LayoutBase'
import { SQLiteProvider } from 'expo-sqlite'
import { DrizzleDbProvider } from '@/contexts/DrizzleDbContext'
import { Stack } from 'expo-router'
import SessionContextProvider from '@/contexts/SessionContext'

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <LayoutBase>
        <SQLiteProvider
          databaseName='task-test'
          options={{
            enableChangeListener: true,
            useNewConnection: true
          }}
        >
          <SessionContextProvider>
            <DrizzleDbProvider>
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
            </DrizzleDbProvider>
          </SessionContextProvider>
        </SQLiteProvider>
      </LayoutBase>
    </GestureHandlerRootView>
  )
}
