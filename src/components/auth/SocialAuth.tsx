import React, { useCallback, useEffect } from 'react'
import {
  View,
  Pressable,
  StyleSheet
} from 'react-native'
import Typo from '@/components/shared/Typo'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import GoogleIcon from '@/components/icons/GoogleIcon'
import * as WebBrowser from 'expo-web-browser'

type SocialStrategy = 'google'

interface SocialProvider {
  key: SocialStrategy
  Icon: React.FC<{ size?: number }>
}

const providers: SocialProvider[] = [
  {
    key: 'google',
    Icon: GoogleIcon
  }
]

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function SocialAuth() {
  useWarmUpBrowser()

  const onPress = useCallback(async(strategy: SocialStrategy) => {
    console.log('onPress', strategy)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Typo style={styles.dividerText}>Or continue with</Typo>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.providersRow}>
        {providers.map(({ key, Icon }) => (
          <Pressable
            key={key}
            style={styles.providerButton}
            onPress={() => onPress(key)}
          >
            <Icon size={21} />
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: Sizes.spacing.s55
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizes.spacing.s11
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginTop: Sizes.spacing.s5
  },
  dividerText: {
    flexShrink: 0,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.secondary,
    textAlign: 'center'
  },
  providersRow: {
    marginTop: Sizes.spacing.s21,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Sizes.spacing.s11
  },
  providerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.base,
    paddingVertical: Sizes.spacing.s11,
    borderWidth: 1,
    borderColor: Colors.border
  }
})
