import { UserProfile } from '@/types/user'
import { create } from 'zustand'

interface AuthStore {
  user: UserProfile | null
  isLoading: boolean
  error: string | null
  setUser: (user: UserProfile | null) => void
  updateUsername: (newUsername: string) => Promise<void>
}

export const useUserStore = create<AuthStore>()((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user: UserProfile | null) => set({ user }),
  updateUsername: async (newUsername: string) => {}
}))
