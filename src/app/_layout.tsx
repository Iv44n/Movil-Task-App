import LayoutBase from '@/components/LayoutBase'
import { Stack } from 'expo-router'
import { DatabaseProvider } from '@nozbe/watermelondb/react'
import { database } from '@/lib/watermelon'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { resourceCache } from '@clerk/clerk-expo/resource-cache'
import { config } from '@/lib/config'
import { UserContextProvider } from '@/context/UserContext'
import { RevenueCatProvider } from '@/context/RevenueCatContext'

export default function Layout() {
  return (
    <LayoutBase>
      <ClerkProvider
        publishableKey={config.clerkPublishableKey}
        tokenCache={tokenCache}
        __experimental_resourceCache={resourceCache}
      >
        <DatabaseProvider database={database}>
          <UserContextProvider>
            <RevenueCatProvider>
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
            </RevenueCatProvider>
          </UserContextProvider>
        </DatabaseProvider>
      </ClerkProvider>
    </LayoutBase>
  )
}
