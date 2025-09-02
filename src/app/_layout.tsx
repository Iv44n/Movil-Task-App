import LayoutBase from '@/components/LayoutBase'
import { Stack } from 'expo-router'
import { AuthContextProvider } from '@/context/AuthContext'
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { database } from '@/lib/watermelon'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { resourceCache } from '@clerk/clerk-expo/resource-cache'
import { config } from '@/lib/config'

export default function Layout() {
  return (
    <LayoutBase>
      <ClerkProvider
        publishableKey={config.clerkPublishableKey}
        tokenCache={tokenCache}
        __experimental_resourceCache={resourceCache}
      >
        <DatabaseProvider database={database}>
          <AuthContextProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' }
              }}
            >
              <Stack.Screen name='index' options={{ animation: 'fade' }} />
              <Stack.Screen name='welcome' options={{ animation: 'fade' }} />
              <Stack.Screen name='(auth)' options={{ animation: 'fade' }} />
              <Stack.Screen name='(protected)' options={{ animation: 'fade' }} />
            </Stack>
          </AuthContextProvider>
        </DatabaseProvider>
      </ClerkProvider>
    </LayoutBase>
  )
}
