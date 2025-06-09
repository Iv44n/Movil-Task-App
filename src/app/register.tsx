import  { useEffect, useState } from 'react'
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
import { useAuth } from '@/hooks/useAuth'

export default function UserRegister() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoadingAuth, errorAuth, setErrorAuth, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoadingAuth) {
      router.replace('(protected)', { withAnchor: true })
    }
  }, [isAuthenticated, isLoadingAuth, router])

  const finishRegister = async () => {
    if (!username || !password) {
      setErrorAuth({ message: 'Please enter username and password.', errorCode: 'INVALID_CREDENTIALS' })
      return
    }
    await register({ username, password })
  }

  const isButtonDisabled = !username || !password || isLoadingAuth

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
            if (errorAuth) setErrorAuth(null)
            setUsername(text)
          }}
          autoCapitalize='none'
        />
        <Text style={styles.errorText}>{errorAuth?.message}</Text>

        <Text style={[styles.label, { marginTop: 8 }]}>Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder='Choose a secure password'
            placeholderTextColor={Colors.textSecondary}
            style={[styles.input, { flex: 1 }]}
            value={password}
            onChangeText={(text) => {
              if (errorAuth) setErrorAuth(null)
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
        <Text style={styles.errorText}>{errorAuth?.message && errorAuth.errorCode !== 'USER_ALREADY_EXISTS'}</Text>

        <Pressable
          style={styles.loginButton}
          onPress={finishRegister}
          disabled={isButtonDisabled}
        >
          <Text style={styles.loginButtonText}>
            {isLoadingAuth ? 'Registering...' : 'Register'}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>

      <Pressable
        onPress={() => router.replace('/login')}
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
