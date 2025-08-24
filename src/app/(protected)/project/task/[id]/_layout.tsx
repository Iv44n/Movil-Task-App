import { Stack } from 'expo-router'

export default function TaskLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' }
      }}
    >
      <Stack.Screen name='index' options={{ animation: 'fade_from_bottom', presentation: 'modal' }}/>
      <Stack.Screen name='edit' options={{ animation: 'fade_from_bottom', presentation: 'modal' }}/>
    </Stack>
  )
}
