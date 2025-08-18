import { Colors, Sizes } from '@/constants/theme'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'

export default function LayoutBase({ children, ...props }: SafeAreaViewProps) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: Sizes.spacing.s9
      }}
      {...props}
    >
      <StatusBar style='light'/>
      {children}
    </SafeAreaView>
  )
}
