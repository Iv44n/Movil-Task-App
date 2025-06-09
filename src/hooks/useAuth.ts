import { AuthService } from '@/lib/services/auth.sevice'
import { useUserStore } from '@/store/userStore'
import { LoginCredentials, RegisterData } from '@/types/user'
import AppError from '@/utils/AppError'
import { useCallback, useEffect, useState } from 'react'

type AuthError = { errorCode: string; message: string } | null

export const useAuth = () => {
  const user = useUserStore((state) => state.user)
  const setUserInStore = useUserStore((state) => state.setUser)

  const [isReady, setIsReady] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(false)
  const [errorAuth, setErrorAuth] = useState<AuthError>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        setUserInStore(currentUser)
      } catch (error) {
        console.error('Failed to check auth:', error)
      }

      setIsReady(true)
    }

    checkAuth()
  }, [setUserInStore])

  const register = useCallback(async (data: RegisterData) => {
    setIsLoadingAuth(true)
    setErrorAuth(null)

    try {
      const loggedInUser = await AuthService.register(data)
      setUserInStore(loggedInUser)
      setIsLoadingAuth(false)
    } catch (err: any) {
      if(err instanceof AppError) {
        setErrorAuth({
          errorCode: err.errorCode,
          message: err.message
        })
        setIsLoadingAuth(false)
        return
      }

      setErrorAuth({
        errorCode: 'REGISTER_FAILED',
        message: 'Registration failed.' + (err.message || '')
      })
      setIsLoadingAuth(false)
    }
  }, [setUserInStore])

  const login = useCallback(async (data: LoginCredentials) => {
    setIsLoadingAuth(true)
    setErrorAuth(null)

    try {
      const loggedInUser = await AuthService.login(data)
      setUserInStore(loggedInUser)
      setIsLoadingAuth(false)
    } catch (err: any) {
      if(err instanceof AppError) {
        setErrorAuth({
          errorCode: err.errorCode,
          message: err.message
        })
        setIsLoadingAuth(false)
        return
      }

      setErrorAuth({
        errorCode: 'REGISTER_FAILED',
        message: 'Registration failed.' + (err.message || '')
      })
      setIsLoadingAuth(false)
    }
  }, [setUserInStore])

  const logout = useCallback(async () => {
    setIsLoadingAuth(true)
    setErrorAuth(null)

    try {
      await AuthService.logout()
      setUserInStore(null)
      setIsLoadingAuth(false)
    } catch (err: any) {
      if(err instanceof AppError) {
        setErrorAuth({
          errorCode: err.errorCode,
          message: err.message
        })
        setIsLoadingAuth(false)
        return
      }

      setErrorAuth({
        errorCode: 'REGISTER_FAILED',
        message: 'Registration failed.' + (err.message || '')
      })
      setIsLoadingAuth(false)
    }
  }, [setUserInStore])

  return {
    isAuthenticated: !!user,
    isLoadingAuth,
    errorAuth,
    isReady,
    register,
    login,
    logout,
    setErrorAuth
  }
}
