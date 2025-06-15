import  { useState } from 'react'
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

export default function UserRegister() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoadingAuth, errorAuth, setErrorAuth } = useBoundStore()
  const router = useRouter()

  const finishRegister = async () => {
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

    await register({
      username: username.trim(),
      password: password.trim()
    })
  }

  const getFieldError = (field: string) => {
    if(!(errorAuth instanceof ValidationError)) return null

    const fields = Array.isArray(errorAuth.field)
      ? errorAuth.field
      : [errorAuth.field]

    return fields.includes(field) ? `* ${errorAuth.message}` : null
  }

  return (
    <ScreenWrapper style={{ justifyContent: 'center' }}>
      <KeyboardAvoidingView>
        <FormField
          label='Username'
          value={username}
          onChangeText={(text) => {
            if (getFieldError('username')) setErrorAuth(null)
            setUsername(text)
          }}
          placeholder='Enter your username'
          error={getFieldError('username')}
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
          placeholder='Choose a secure password'
          secureTextEntry={!showPassword}
        />

        <Pressable
          style={styles.loginButton}
          onPress={finishRegister}
          disabled={isLoadingAuth}
        >
          <Typo
            size={17}
            fontWeight='extraBold'
            color={Colors.textBlack}
          >
            {isLoadingAuth ? 'Registering...' : 'Register'}
          </Typo>
        </Pressable>
      </KeyboardAvoidingView>

      <View style={styles.registerButton}>
        <Typo
          size={15}
          fontWeight='medium'
          color={Colors.textSecondary}
        >
          Already have an account?
          <Typo
            size={15}
            color={Colors.yellow}
            fontWeight='bold'
            textProps={{ onPress: () => {
              setErrorAuth(null)
              router.replace('/login')
            } }}
          >
            {'  '}Login.
          </Typo>
        </Typo>
      </View>
    </ScreenWrapper>
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
