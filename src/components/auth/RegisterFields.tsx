import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import {
  View,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import { Colors, Sizes } from '@/constants/theme'
import EyeIcon from '@/components/icons/EyeIcon'
import EyeOffIcon from '@/components/icons/EyeOffIcon'
import FormField from '@/components/shared/FormField'
import useSignUp from '@/hooks/auth/useSignUp'
import { Controller, useForm } from 'react-hook-form'
import ActionButton from '@/components/shared/ActionButton'
import AuthPrompt from './AuthPrompt'

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
                placeholder='First name'
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
                placeholder='Last name'
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
              placeholder='Email address'
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
                  ? <EyeOffIcon size={21} color={Colors.secondary} />
                  : <EyeIcon size={21} color={Colors.secondary} />
              }
              onIconPress={togglePasswordVisibility}
              error={errors.password?.message}
              value={value}
              onChangeText={(value) => {
                onChange(value)
                clearErrors('password')
              }}
              placeholder='Choose a secure password'
              secureTextEntry={!showPassword}
            />
          )}
        />

        <ActionButton
          label={signUpLoading ? 'Registering...' : 'Register'}
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: Sizes.spacing.s15 }}
        />
      </KeyboardAvoidingView>

      <AuthPrompt
        promptText='Already have an account?'
        actionText='Login'
        onAction={() => router.replace('/login')}
      />
    </>
  )
}
