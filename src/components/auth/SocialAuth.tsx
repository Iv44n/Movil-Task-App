import React, { useCallback, useEffect } from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import Typo from '@/components/shared/Typo'
import { Colors, Sizes } from '@/constants/theme'
import Icon from '@/components/icons/Icon'
import * as WebBrowser from 'expo-web-browser'
import i18n from '@/i18n'
import ActionButton from '../shared/ActionButton'

type SocialStrategy = 'google'

interface SocialProvider {
  key: SocialStrategy
  Icon: React.FC<{ size?: number }>
}

const providers: SocialProvider[] = [
  {
    key: 'google',
    Icon: Icon.Google
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
        <Typo
          size={15}
          weight='500'
          color='secondary'
          style={styles.dividerText}
        >
          {i18n.t('auth.dividerText')}
        </Typo>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.providersRow}>
        {providers.map(({ key, Icon }) => (
          <ActionButton
            key={key}
            style={styles.providerButton}
            onPress={() => onPress(key)}
          >
            <Icon size={21} />
          </ActionButton>
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
    backgroundColor: Colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border
  }
})
