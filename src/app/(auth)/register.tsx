import  { useState } from 'react'
import { useRouter } from 'expo-router'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { Colors } from '@/constants/colors'
import { fontFamily } from '@/constants/fontFamily'
import EyeIcon from '@/components/icons/EyeIcon'
import EyeOffIcon from '@/components/icons/EyeOffIcon'
import useBoundStore from '@/store/useBoundStore'
import { ValidationError } from '@/errors/AppError'

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

    return fields.includes(field) ? errorAuth.message : null
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder='Choose a username'
          placeholderTextColor={Colors.textSecondary}
          style={[styles.input, {
            backgroundColor: Colors.card,
            borderRadius: 8,
            paddingHorizontal: 19
          }]}
          value={username}
          onChangeText={(text) => {
            if (getFieldError('username')) setErrorAuth(null)
            setUsername(text)
          }}
          autoCapitalize='none'
        />
        <Text style={styles.errorText}>{getFieldError('username')}</Text>

        <Text style={[styles.label, { marginTop: 8 }]}>Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder='Choose a secure password'
            placeholderTextColor={Colors.textSecondary}
            style={[styles.input, { flex: 1 }]}
            value={password}
            onChangeText={(text) => {
              if (getFieldError('password')) setErrorAuth(null)
              setPassword(text)
            }}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOffIcon color={Colors.textSecondary} />
            ) : (
              <EyeIcon color={Colors.textSecondary} />
            )}
          </Pressable>
        </View>
        <Text style={styles.errorText}>{getFieldError('password')}</Text>

        <Pressable
          style={styles.loginButton}
          onPress={finishRegister}
          disabled={isLoadingAuth}
        >
          <Text style={styles.loginButtonText}>
            {isLoadingAuth ? 'Registering...' : 'Register'}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>

      <Pressable
        onPress={() => {
          setErrorAuth(null)
          router.replace('/login')
        }}
        style={styles.registerButton}
      >
        <Text style={styles.registerButtonText}>
          Already have an account?
          <Text style={styles.registerButtonTextBold}> Log in.</Text>
        </Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center'
  },
  label: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: fontFamily.medium,
    marginBottom: 4
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  input: {
    color: Colors.textPrimary,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    paddingVertical: 12
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: Colors.yellow,
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center'
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.extraBold,
    color: Colors.textBlack
  },
  errorText: {
    color: '#FF8080',
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    marginTop: 4,
    marginLeft: 6
  },
  registerButton: {
    marginTop: 10,
    alignItems: 'center'
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: Colors.textSecondary
  },
  registerButtonTextBold: {
    color: Colors.yellow,
    fontFamily: fontFamily.bold
  }
})
