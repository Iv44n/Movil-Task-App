import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, StyleSheet, View, TextInput as RNTextInput } from 'react-native'
import { Colors, Shapes, Sizes, Typography } from '@/constants/theme'
import ActionButton from '../shared/ActionButton'
import Typo from '../shared/Typo'
import useSignUp from '@/hooks/auth/useSignUp'
import i18n from '@/i18n'

type Props = {
  emailAddress: string
}

const CODE_LENGTH = 6

export default React.memo(function VerifyEmailForm({ emailAddress }: Props) {
  const [code, setCode] = useState<string[]>(() => Array(CODE_LENGTH).fill(''))
  const inputsRef = useRef<(RNTextInput | null)[]>([])
  const { onVerify, signUpError, signUpLoading } = useSignUp()

  useEffect(() => {
    const first = inputsRef.current[0]
    first?.focus?.()
  }, [])

  useEffect(() => {
    if (signUpError) {
      Alert.alert(
        i18n.t('auth.verifyEmail.verificationFailed'),
        signUpError.message ?? i18n.t('auth.verifyEmail.anErrorOccurred'),
        [{ text: 'OK', style: 'cancel' }],
        { userInterfaceStyle: 'dark' }
      )
    }
  }, [signUpError])

  const isComplete = code.every((c) => c !== '')

  const handleChange = useCallback(
    (text: string, index: number) => {
      if (!text) {
        const copy = [...code]
        copy[index] = ''
        setCode(copy)
        return
      }

      const digits = text.replace(/\D/g, '').split('')
      if (digits.length === 0) return

      const newCode = [...code]
      let writeIndex = index
      for (let i = 0; i < digits.length && writeIndex < CODE_LENGTH; i += 1, writeIndex += 1) {
        newCode[writeIndex] = digits[i]
      }

      setCode(newCode)

      if (writeIndex < CODE_LENGTH) {
        inputsRef.current[writeIndex]?.focus()
      } else {
        inputsRef.current[CODE_LENGTH - 1]?.blur?.()
      }
    },
    [code]
  )

  const handleKeyPress = useCallback(
    ({ nativeEvent }: { nativeEvent: { key: string } }, index: number) => {
      const { key } = nativeEvent
      if (key === 'Backspace') {
        if (code[index] === '' && index > 0) {
          const prev = index - 1
          const copy = [...code]
          copy[prev] = ''
          setCode(copy)
          inputsRef.current[prev]?.focus()
        }
      }
    },
    [code]
  )

  const handleVerify = useCallback(async () => {
    if (!isComplete) {
      Alert.alert(
        i18n.t('auth.verifyEmail.incompleteCode'),
        i18n.t('auth.verifyEmail.pleaseEnterFullCode')
      )
      return
    }
    await onVerify(code.join(''))
  }, [code, isComplete, onVerify])

  return (
    <View style={styles.container}>
      <Typo size={20} weight='700' style={styles.title}>
        {i18n.t('auth.verifyEmail.title')}
      </Typo>

      <Typo size={15} weight='500' color='secondary' style={styles.subtitle}>
        {i18n.t('auth.verifyEmail.subtitle', { emailAddress })}
      </Typo>

      <View style={styles.row}>
        {code.map((digit, i) => (
          <View key={i} style={[styles.cell, digit ? styles.cellActive : undefined]}>
            <RNTextInput
              ref={(ref) => {
                inputsRef.current[i] = ref
              }}
              value={digit}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              maxLength={CODE_LENGTH}
              keyboardType='number-pad'
              returnKeyType='done'
              textContentType='oneTimeCode'
              placeholder='0'
              placeholderTextColor='#555'
              style={styles.input}
              importantForAutofill='yes'
            />
          </View>
        ))}
      </View>

      <ActionButton
        style={styles.button}
        disabled={signUpLoading || !isComplete}
        onPress={handleVerify}
      >
        {signUpLoading
          ? i18n.t('auth.verifyEmail.verifying')
          : i18n.t('auth.verifyEmail.verify')}
      </ActionButton>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    marginBottom: Sizes.spacing.s9
  },
  subtitle: {
    maxWidth: '90%',
    textAlign: 'center',
    marginBottom: Sizes.spacing.s9
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Sizes.spacing.s9,
    marginBottom: Sizes.spacing.s9,
    marginTop: Sizes.spacing.s9
  },
  cell: {
    width: Sizes.width.w47,
    height: Sizes.width.w57,
    backgroundColor: Colors.card,
    borderRadius: Shapes.rounded.base,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cellActive: {
    borderWidth: 1,
    borderColor: Colors.yellow
  },
  input: {
    textAlign: 'center',
    padding: Sizes.spacing.s9,
    fontFamily: Typography.fontFamily.bold,
    fontSize: 25,
    color: Colors.primary,
    width: '100%'
  },
  button: {
    width: '50%',
    marginTop: Sizes.spacing.s17
  }
})
