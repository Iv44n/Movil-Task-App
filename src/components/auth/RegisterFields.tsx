import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import {
  View,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import { Colors, Sizes } from '@/constants/theme'
import FormField from '@/components/shared/FormField'
import useSignUp from '@/hooks/auth/useSignUp'
import { Controller, useForm } from 'react-hook-form'
import ActionButton from '@/components/shared/ActionButton'
import AuthPrompt from './AuthPrompt'
import Icon from '@/components/icons/Icon'
import i18n from '@/i18n'
import VerifyEmailForm from './VerifyEmailForm'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
}

enum ErrorCodes {
  FORM_IDENTIFIER_EXISTS = 'form_identifier_exists',
  FORM_PASSWORD_PWNED = 'form_password_pwned',
  FORM_PASSWORD_LENGTH_TOO_SHORT = 'form_password_length_too_short'
}

export default function UserRegister() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { signUp, signUpLoading, signUpError, pendingVerification } = useSignUp()

  const { control, handleSubmit, formState: { errors }, clearErrors, getValues } = useForm<FormData>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  })

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev)
  }, [])

  const onSubmit = useCallback(async (data: FormData) =>{
    const dataTrimmed = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      emailAddress: data.email.trim(),
      password: data.password.trim()
    }
    await signUp(dataTrimmed)
  }, [signUp])

  useEffect(() => {
    if (signUpError) {
      let message = ''
      switch (signUpError.code) {
        case ErrorCodes.FORM_IDENTIFIER_EXISTS:
          message = i18n.t('auth.register.errors.emailExists')
          break

        case ErrorCodes.FORM_PASSWORD_PWNED:
          message = i18n.t('auth.register.errors.passwordTooWeak')
          break

        case ErrorCodes.FORM_PASSWORD_LENGTH_TOO_SHORT:
          message = i18n.t('auth.register.errors.passwordTooShort')
          break

        default:
          message = signUpError.message
          break
      }

      // TODO: Improve error alert UI/UX
      Alert.alert(
        i18n.t('auth.register.registerFailed'),
        message,
        [
          { text: i18n.t('common.ok'), style: 'cancel' }
        ],
        { userInterfaceStyle: 'dark' }
      )
    }
  }, [signUpError])

  if (pendingVerification) {
    return (
      <View
        style={{
          minWidth: '110%',
          minHeight: '110%',
          flex: 1,
          zIndex: 100,
          position: 'absolute'
        }}
      >
        <VerifyEmailForm emailAddress={getValues('email')} />
      </View>
    )
  }

  return (
    <>
      <KeyboardAvoidingView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Controller
            name='firstName'
            control={control}
            rules={{ required: i18n.t('auth.register.form.firstNameRequired') }}
            render={({ field: { onChange, value } }) => (
              <FormField
                error={errors.firstName?.message}
                placeholder={i18n.t('auth.register.form.firstName')}
                value={value}
                onChangeText={(value) => {
                  onChange(value)
                  clearErrors('firstName')
                }}
                containerStyle={{ width: '48%' }}
              />
            )}
          />

          <Controller
            name='lastName'
            control={control}
            rules={{ required: i18n.t('auth.register.form.lastNameRequired') }}
            render={({ field: { onChange, value } }) => (
              <FormField
                error={errors.lastName?.message}
                placeholder={i18n.t('auth.register.form.lastName')}
                value={value}
                onChangeText={(value) => {
                  onChange(value)
                  clearErrors('lastName')
                }}
                containerStyle={{ width: '48%' }}
              />
            )}
          />
        </View>

        <Controller
          name='email'
          control={control}
          rules={{ required: i18n.t('auth.register.form.emailRequired') }}
          render={({ field: { onChange, value } }) => (
            <FormField
              autoCapitalize='none'
              error={errors.email?.message}
              placeholder={i18n.t('auth.register.form.emailAddress')}
              inputMode='email'
              value={value}
              onChangeText={(value) => {
                onChange(value)
                clearErrors('email')
              }}
            />
          )}
        />

        <Controller
          name='password'
          control={control}
          rules={ {
            required: i18n.t('auth.register.form.passwordRequired'),
            minLength: { value: 6, message: i18n.t('auth.register.form.passwordMinLength') }
          }}
          render={({ field: { onChange, value } }) => (
            <FormField
              autoCapitalize='none'
              icon={
                showPassword
                  ? <Icon.EyeOff size={21} color={Colors.secondary} />
                  : <Icon.Eye size={21} color={Colors.secondary} />
              }
              onIconPress={togglePasswordVisibility}
              error={errors.password?.message}
              value={value}
              onChangeText={(value) => {
                onChange(value)
                clearErrors('password')
              }}
              placeholder={i18n.t('auth.register.form.password')}
              secureTextEntry={!showPassword}
            />
          )}
        />

        <ActionButton
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: Sizes.spacing.s15 }}
          disabled={signUpLoading}
        >
          {signUpLoading
            ? i18n.t('auth.register.actions.signUpLoading')
            : i18n.t('auth.register.actions.signUp')}
        </ActionButton>
      </KeyboardAvoidingView>

      <AuthPrompt
        promptText={i18n.t('auth.register.promptText')}
        actionText={i18n.t('auth.register.actionText')}
        onAction={() => router.replace('/login')}
      />
    </>
  )
}
