import React, { useEffect, useState } from 'react'
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

export default function UserLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoadingAuth, errorAuth, setErrorAuth, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoadingAuth) {
      router.replace('(protected)', { withAnchor: true })
    }
  }, [isAuthenticated, isLoadingAuth, router])

  const finishLogin = async () => {
    if (!username || !password) {
      setErrorAuth({ message: 'Please enter username and password.', errorCode: 'INVALID_CREDENTIALS' })
      return
    }
    await login({ username, password })
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      >
        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder='Enter your username'
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
            placeholder='Enter your password'
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
        <Text style={styles.errorText}>{errorAuth?.message}</Text>

        <Pressable
          style={styles.loginButton}
          onPress={finishLogin}
        >
          <Text style={styles.loginButtonText}>{isLoadingAuth ? 'Loading...' : 'Login'}</Text>
        </Pressable>
      </KeyboardAvoidingView>

      <Pressable
        onPress={() => router.replace('/register')}
        style={styles.registerButton}
      >
        <Text style={styles.registerButtonText}>Don&apos;t have an account?
          <Text style={styles.registerButtonTextBold}> Register.</Text>
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
