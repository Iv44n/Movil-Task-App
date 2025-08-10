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

interface FormData {
  firstName: string
  lastName: string
  emailAddress: string
  password: string
}

const PASSWORD_RULES = {
  required: 'Password is required',
  minLength: { value: 6, message: 'Password must be at least 6 characters long' },
  maxLength: { value: 20, message: 'Password must be at most 20 characters long' }
}

export default function UserRegister() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { signUp, signUpLoading, signUpError } = useSignUp()

  const { control, handleSubmit, formState: { errors }, clearErrors } = useForm<FormData>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      emailAddress: '',
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
      emailAddress: data.emailAddress.trim(),
      password: data.password.trim()
    }
    const result = await signUp(dataTrimmed)

    if(!result) return

    if(result.user?.identities?.[0].identity_data?.email_verified === false) {
      Alert.alert(
        'Check your email',
        `We have sent a verification email to ${dataTrimmed.emailAddress}`,
        [
          { text: 'ok', style: 'cancel' }
        ],
        { userInterfaceStyle: 'dark' }
      )
    }
  }, [signUp])

  useEffect(() => {
    if (signUpError) {
      // TODO: Improve error alert UI/UX
      Alert.alert(
        'Register Failed',
        signUpError.message,
        [
          { text: 'ok', style: 'cancel' }
        ],
        { userInterfaceStyle: 'dark' }
      )
    }
  }, [signUpError])

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
            rules={{ required: 'First name is required' }}
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
            rules={{ required: 'Last name is required' }}
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
          name='emailAddress'
          control={control}
          rules={{ required: 'Email address is required' }}
          render={({ field: { onChange, value } }) => (
            <FormField
              autoCapitalize='none'
              error={errors.emailAddress?.message}
              placeholder={i18n.t('auth.register.form.emailAddress')}
              inputMode='email'
              value={value}
              onChangeText={(value) => {
                onChange(value)
                clearErrors('emailAddress')
              }}
            />
          )}
        />

        <Controller
          name='password'
          control={control}
          rules={PASSWORD_RULES}
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
