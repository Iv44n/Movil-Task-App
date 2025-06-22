import { useState } from 'react'
import { useRouter } from 'expo-router'
import {
  View,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView
} from 'react-native'
import { Colors, Shapes, Sizes } from '@/constants/theme'
import EyeIcon from '@/components/icons/EyeIcon'
import EyeOffIcon from '@/components/icons/EyeOffIcon'
import useBoundStore from '@/store/useBoundStore'
import { ValidationError } from '@/errors/AppError'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import FormField from '@/components/FormField'
import IconTextField from '@/components/IconTextField'

export default function UserLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const {
    login,
    setErrorAuth,
    isLoadingAuth,
    errorAuth
  } = useBoundStore()
  const router = useRouter()

  const finishLogin = async () => {
    const errors = []

    if(!username) errors.push('username')
    if(!password) errors.push('password')

    if(errors.length > 0) {
      const message = errors.length === 2
        ? 'Please enter username and password.'
        : errors[0] === 'username'
          ? 'Username are required'
          : 'Password are required'

      setErrorAuth(new ValidationError(message, errors))
    }

    await login({
      username: username.trim(),
      password: password.trim()
    })
  }

  const getFieldError = (field: string) => {
    if (!(errorAuth instanceof ValidationError)) return null

    const fields = Array.isArray(errorAuth.field)
      ? errorAuth.field
      : [errorAuth.field]

    return fields.includes(field) ? `* ${errorAuth.message}` : null
  }

  return (
    <>
      <KeyboardAvoidingView>
        <FormField
          label='Username'
          error={getFieldError('username')}
          placeholder='Enter your username'
          value={username}
          onChangeText={(text) => {
            if (getFieldError('username')) setErrorAuth(null)
            setUsername(text)
          }}
          containerStyle={{ marginBottom: Sizes.spacing.s9 }}
        />

        <IconTextField
          label='Password'
          icon={showPassword ? <EyeOffIcon color={Colors.textSecondary} /> : <EyeIcon color={Colors.textSecondary} />}
          onIconPress={() => setShowPassword(!showPassword)}
          error={getFieldError('password')}
          value={password}
          onChangeText={(text) => {
            if (getFieldError('password')) setErrorAuth(null)
            setPassword(text)
          }}
          placeholder='Enter your password'
          secureTextEntry={!showPassword}
        />

        <Pressable
          style={styles.loginButton}
          onPress={finishLogin}
          disabled={isLoadingAuth}
        >
          <Typo
            size={17}
            fontWeight='extraBold'
            color={Colors.textBlack}
          >
            {isLoadingAuth ? 'Loading...' : 'Login'}
          </Typo>
        </Pressable>
      </KeyboardAvoidingView>

      <View
        style={styles.registerButton}
      >
        <Typo
          size={15}
          fontWeight='medium'
          color={Colors.textSecondary}
        >
          Don&apos;t have an account?
          <Typo
            size={15}
            color={Colors.yellow}
            fontWeight='bold'
            textProps={{ onPress: () =>{
              setErrorAuth(null)
              router.replace('/register')
            } }}
          >
            {'  '}Register.
          </Typo>
        </Typo>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  loginButton: {
    marginTop: Sizes.spacing.s17,
    backgroundColor: Colors.yellow,
    paddingVertical: Sizes.spacing.s13,
    borderRadius: Shapes.rounded.large,
    alignItems: 'center'
  },
  registerButton: {
    marginTop: Sizes.spacing.s11,
    alignItems: 'center'
  }
})
