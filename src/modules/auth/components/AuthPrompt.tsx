// components/AuthPrompt.tsx
import { View, StyleSheet } from 'react-native'
import Typo from '@/components/Typo'
import { Colors, Sizes } from '@/constants/theme'

interface AuthPromptProps {
  promptText: string
  actionText: string
  onAction: () => void
}

export default function AuthPrompt({ promptText, actionText, onAction }: AuthPromptProps) {
  return (
    <View style={styles.container}>
      <Typo size={15} fontWeight='medium' color={Colors.textSecondary}>
        {promptText}
        <Typo
          size={15}
          color={Colors.yellow}
          fontWeight='bold'
          textProps={{ onPress: onAction }}
        >
          {'  '}{actionText}
        </Typo>
      </Typo>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: Sizes.spacing.s11,
    alignItems: 'center'
  }
})
