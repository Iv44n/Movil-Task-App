import { View, StyleSheet } from 'react-native'
import Typo from '@/components/shared/Typo'
import { Sizes } from '@/constants/theme'

interface AuthPromptProps {
  promptText: string
  actionText: string
  onAction: () => void
}

export default function AuthPrompt({ promptText, actionText, onAction }: AuthPromptProps) {
  return (
    <View style={styles.container}>
      <Typo size={14} weight='500' color='secondary'>
        {promptText}
        <Typo
          size={14}
          color='yellow'
          weight='700'
          onPress={onAction}
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
