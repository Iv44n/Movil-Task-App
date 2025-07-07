import Typo from '@/components/Typo'
import { View, TextInput, TextInput as RNTextInput, Alert } from 'react-native'
import { Colors, Shapes, Sizes, Typography } from '@/constants/theme'
import { useState, useRef, useCallback, useEffect } from 'react'
import ActionButton from '@/components/ActionButton'
import useVerifyEmail from '../hooks/useVerifyEmail'

export default function VerifyEmailForm({ emailAddress }: { emailAddress: string }) {
  const [code, setCode] = useState<string[]>(Array(6).fill(''))
  const inputsRef = useRef<(RNTextInput | null)[]>([])
  const { verifySignUp, verifyEmailLoading, verifyEmailError, clearError } = useVerifyEmail()

  const handleInputChange = useCallback(
    (text: string, index: number) => {
      if (text.length <= 1 && index < 6) {
        const newCode = [...code]
        newCode[index] = text
        setCode(newCode)

        if (text.length === 1 && index < inputsRef.current.length - 1) {
          inputsRef.current[index + 1]?.focus()
        }
      }
    },
    [code]
  )

  const handleKeyPress = useCallback(
    (e: { nativeEvent: { key: string } }, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && index > 0) {
        inputsRef.current[index - 1]?.focus()
        handleInputChange('', index - 1)
      }

      if (/^\d$/.test(e.nativeEvent.key)) {
        handleInputChange(e.nativeEvent.key, index + 1)
        inputsRef.current[index + 1]?.focus()
      }
    },
    [handleInputChange]
  )

  useEffect(() => {
    if (verifyEmailError) {
      // TODO: Improve error alert UI/UX
      Alert.alert(
        'Register Failed',
        verifyEmailError,
        [
          { text: 'ok', style: 'cancel' }
        ],
        { userInterfaceStyle: 'dark' }
      )
    }
  }, [verifyEmailError])

  const handleVerify = useCallback(async () => {
    clearError()
    await verifySignUp(code.join(''))
  }, [code, verifySignUp, clearError])

  return (
    <>
      <Typo
        size={20}
        fontWeight='bold'
        style={{
          textAlign: 'center',
          marginBottom: Sizes.spacing.s9
        }}
      >
        Verify Email
      </Typo>
      <Typo
        size={15}
        fontWeight='medium'
        color={Colors.textSecondary}
        style={{
          textAlign: 'center',
          marginBottom: Sizes.spacing.s9
        }}
      >
        Please enter the verification code sent to {emailAddress}
      </Typo>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: Sizes.width.w99,
          gap: Sizes.spacing.s9,
          marginBottom: Sizes.spacing.s9,
          marginTop: Sizes.spacing.s9
        }}
      >
        {code.map((digit, i) => (
          <View
            key={i}
            style={{
              width: Sizes.width.w47,
              height: Sizes.width.w57,
              borderWidth: digit.length === 1 ? 1 : 0,
              borderColor: digit.length === 1 ? Colors.yellow : undefined,
              backgroundColor: Colors.card,
              borderRadius: Shapes.rounded.small,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <TextInput
              cursorColor={Colors.textSecondary}
              ref={(ref: RNTextInput | null) => {
                inputsRef.current[i] = ref
              }}
              style={{
                textAlign: 'center',
                padding: Sizes.spacing.s9,
                fontFamily: Typography.fontFamily.bold,
                fontSize: 25,
                color: Colors.textPrimary
              }}
              placeholder='0'
              placeholderTextColor='#555'
              value={digit}
              onChangeText={(text) =>{
                handleInputChange(text, i)
                clearError()
              }}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType='numeric'
              maxLength={1}
            />
          </View>
        ))}
      </View>

      <ActionButton
        label={verifyEmailLoading ? 'Verifying...' : 'Verify'}
        style={{
          maxWidth: '40%',
          borderRadius: Shapes.rounded.medium,
          marginTop: Sizes.spacing.s17
        }}
        disabled={verifyEmailLoading}
        onPress={handleVerify}
      />
    </>
  )
}
