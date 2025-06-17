import { AppError } from '@/errors/AppError'
import { AuthService } from '@/lib/services/auth.service'
import { StateCreator } from 'zustand'
import { AuthSlice, RootState } from '../types'

type StateCreatorType = StateCreator<RootState, [], [], AuthSlice>

export const authSlice: StateCreatorType = (set, get) => ({
  isAuthenticated: false,
  isLoadingAuth: false,
  errorAuth: null,
  register: async (data) => {
    set({ isLoadingAuth: true, errorAuth: null })

    try {
      const userData = await AuthService.register(data)
      get().setUser(userData)
      set({
        isLoadingAuth: false,
        isAuthenticated: get().user !== null
      })
    } catch (error) {
      if (error instanceof AppError) {
        set({ errorAuth: error, isLoadingAuth: false })
      }
      set({ isLoadingAuth: false })
    }
  },
  login: async (data) => {
    set({ isLoadingAuth: true, errorAuth: null })

    try {
      const userData = await AuthService.login(data)
      get().setUser(userData)
      set({
        isLoadingAuth: false,
        isAuthenticated: get().user !== null
      })
    } catch (error) {
      if (error instanceof AppError) {
        set({ errorAuth: error, isLoadingAuth: false })
      }
      set({ isLoadingAuth: false })
    }
  },
  logout: async() => {
    set({ isLoadingAuth: true, errorAuth: null })

    try {
      await AuthService.logout()
      get().setUser(null)
      set({
        isLoadingAuth: false,
        isAuthenticated: get().user !== null
      })
    } catch (error) {
      if (error instanceof AppError) {
        set({ errorAuth: error, isLoadingAuth: false })
      }
      set({ isLoadingAuth: false })
    }
  },
  checkAuth: async () => {
    set({ isLoadingAuth: true, errorAuth: null })

    console.log('check auth')
    try {
      const userData = await AuthService.getSession()
      get().setUser(userData)
      set({
        isLoadingAuth: false,
        isAuthenticated: get().user !== null
      })
    } catch (error) {
      if (error instanceof AppError) {
        set({ errorAuth: error, isLoadingAuth: false })
      }
      set({ isLoadingAuth: false })
    }
  },
  setErrorAuth: (error: AppError | null) => set({ errorAuth: error })
})
