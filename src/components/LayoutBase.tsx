import { Colors, Sizes } from '@/constants/theme'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LayoutBase({ children }: React.PropsWithChildren) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: Sizes.spacing.s9
      }}
    >
      <StatusBar style='light'/>
      {children}
    </SafeAreaView>
  )
}
