import { useCallback, useState } from 'react'
import { useRouter } from 'expo-router'
import {
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import { Colors, Sizes } from '@/constants/theme'
import FormField from '@/components/shared/FormField'
import { Controller, useForm } from 'react-hook-form'
import ActionButton from '@/components/shared/ActionButton'
import AuthPrompt from './AuthPrompt'
import i18n from '@/i18n'
import { useSignIn } from '@clerk/clerk-expo'
import Icon from '../icons/Icon'

interface ForgotPasswordFormData {
  email: string
}

interface ResetPasswordFormData {
  password: string
  code: string
}

export default function ForgotPasswordFields() {
  const router = useRouter()
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const { isLoaded, signIn, setActive } = useSignIn()
  const [showPassword, setShowPassword] = useState(false)

  const {
    control: forgotPasswordControl,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors },
    clearErrors: clearForgotPasswordErrors
  } = useForm<ForgotPasswordFormData>({
    defaultValues: { email: '' },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const {
    control: resetPasswordControl,
    handleSubmit: handleResetPasswordSubmit,
    formState: { errors: resetPasswordErrors },
    clearErrors: clearResetPasswordErrors
  } = useForm<ResetPasswordFormData>({
    defaultValues: { password: '', code: '' },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const onSendCode = useCallback(async ({ email }: ForgotPasswordFormData) => {
    if (!isLoaded) return
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email
      })
      setSuccessfulCreation(true)
    } catch (err: any) {
      Alert.alert(i18n.t('auth.login.loginFailed'), err.errors[0].longMessage)
    }
  }, [isLoaded, signIn])

  const onReset = useCallback(async ({ password, code }: ResetPasswordFormData) => {
    if (!isLoaded) return
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('(protected)')
      }
    } catch (err: any) {
      Alert.alert(i18n.t('auth.login.loginFailed'), err.errors[0].longMessage)
    }
  }, [isLoaded, signIn, setActive, router])

  return (
    <>
      <KeyboardAvoidingView behavior='padding'>
        {!successfulCreation && (
          <>
            <Controller
              name='email'
              control={forgotPasswordControl}
              rules={{ required: { value: true, message: i18n.t('auth.forgotPassword.form.emailRequired') } }}
              render={({ field: { onChange, value } }) => (
                <FormField
                  autoCapitalize='none'
                  error={forgotPasswordErrors.email?.message}
                  placeholder={i18n.t('auth.forgotPassword.form.emailAddress')}
                  value={value}
                  inputMode='email'
                  onChangeText={(val) => {
                    onChange(val)
                    clearForgotPasswordErrors('email')
                  }}
                />
              )}
            />
            <ActionButton
              onPress={handleForgotPasswordSubmit(onSendCode)}
              style={{ marginTop: Sizes.spacing.s21 }}
            >
              {i18n.t('auth.forgotPassword.actions.sendCode')}
            </ActionButton>
          </>
        )}

        {successfulCreation && (
          <>
            <Controller
              name='password'
              control={resetPasswordControl}
              rules={{ required: { value: true, message: i18n.t('auth.forgotPassword.form.passwordRequired') } }}
              render={({ field: { onChange, value } }) => (
                <FormField
                  autoCapitalize='none'
                  error={resetPasswordErrors.password?.message}
                  placeholder={i18n.t('auth.forgotPassword.form.password')}
                  value={value}
                  secureTextEntry={!showPassword}
                  onChangeText={(val) => {
                    onChange(val)
                    clearResetPasswordErrors('password')
                  }}
                  icon={
                    showPassword
                      ? <Icon.EyeOff size={21} color={Colors.secondary} />
                      : <Icon.Eye size={21} color={Colors.secondary} />
                  }
                  onIconPress={() => setShowPassword(!showPassword)}
                />
              )}
            />
            <Controller
              name='code'
              control={resetPasswordControl}
              rules={{ required: { value: true, message: i18n.t('auth.forgotPassword.form.codeRequired') } }}
              render={({ field: { onChange, value } }) => (
                <FormField
                  error={resetPasswordErrors.code?.message}
                  placeholder={i18n.t('auth.forgotPassword.form.code')}
                  value={value}
                  onChangeText={(val) => {
                    onChange(val)
                    clearResetPasswordErrors('code')
                  }}
                />
              )}
            />
            <ActionButton
              onPress={handleResetPasswordSubmit(onReset)}
              style={{ marginTop: Sizes.spacing.s21 }}
            >
              {i18n.t('auth.forgotPassword.actions.reset')}
            </ActionButton>
          </>
        )}
      </KeyboardAvoidingView>

      <AuthPrompt
        promptText={i18n.t('auth.forgotPassword.promptText')}
        actionText={i18n.t('auth.forgotPassword.actionText')}
        onAction={() => router.replace('/login')}
      />
    </>
  )
}
