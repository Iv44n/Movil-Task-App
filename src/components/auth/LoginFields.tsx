import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import { Colors, Sizes } from '@/constants/theme'
import Typo from '@/components/shared/Typo'
import FormField from '@/components/shared/FormField'
import { Controller, useForm } from 'react-hook-form'
import useSignIn from '@/hooks/auth/useSignIn'
import ActionButton from '@/components/shared/ActionButton'
import AuthPrompt from './AuthPrompt'
import Icon from '../icons/Icon'
import i18n from '@/i18n'

interface FormData {
  email: string
  password: string
}

export default function LoginFields() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, signInLoading, signInError } = useSignIn()

  const { control, handleSubmit, formState: { errors }, clearErrors } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const onSubmit = useCallback(async ({ email, password }: FormData) => {
    await signIn(email.trim(), password.trim())
  }, [signIn])

  useEffect(() => {
    if (signInError) {
      Alert.alert(
        'Login Failed',
        signInError.message,
        [
          { text: 'ok', style: 'cancel' }
        ],
        { userInterfaceStyle: 'dark' }
      )
    }
  }, [signInError])

  return (
    <>
      <KeyboardAvoidingView>
        <Controller
          name='email'
          control={control}
          rules={{ required: 'Email address is required' }}
          render={({ field: { onChange, value } }) => (
            <FormField
              autoCapitalize='none'
              error={errors.email?.message}
              placeholder={i18n.t('auth.login.form.emailAddress')}
              value={value}
              inputMode='email'
              onChangeText={(value) => {
                onChange(value)
                clearErrors('email')
              }}
            />
          )}
        />

        <View>
          <Controller
            name='password'
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field: { onChange, value } }) => (
              <FormField
                autoCapitalize='none'
                icon={
                  showPassword
                    ? <Icon.EyeOff size={21} color={Colors.secondary} />
                    : <Icon.Eye size={21} color={Colors.secondary} />
                }
                onIconPress={() => setShowPassword(!showPassword)}
                error={errors.password?.message}
                value={value}
                onChangeText={(value) => {
                  onChange(value)
                  clearErrors('password')
                }}
                placeholder={i18n.t('auth.login.form.password')}
                secureTextEntry={!showPassword}
              />
            )}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              marginTop: -Sizes.spacing.s9,
              marginRight: Sizes.spacing.s5,
              alignItems: 'flex-end'
            }}
            onPress={() => {
              router.replace('/forgot-password')
            }}
          >
            <Typo
              size={13}
              weight='500'
              color='yellow'
            >
              {i18n.t('auth.login.form.forgotPassword')}
            </Typo>
          </TouchableOpacity>
        </View>

        <ActionButton
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: Sizes.spacing.s21 }}
        >
          {signInLoading
            ? i18n.t('auth.login.actions.signInLoading')
            : i18n.t('auth.login.actions.signIn')}
        </ActionButton>
      </KeyboardAvoidingView>

      <AuthPrompt
        promptText={i18n.t('auth.login.promptText')}
        actionText={i18n.t('auth.login.actionText')}
        onAction={() => router.replace('/register')}
      />
    </>
  )
}
