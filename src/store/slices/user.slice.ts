import { UserProfile } from '@/types/user'
import { StateCreator } from 'zustand'
import { RootState, UserSlice } from '../types'

type StateCreatorType = StateCreator<RootState, [], [], UserSlice>

export const userSlice: StateCreatorType = (set) => ({
  user: null,
  setUser: (user: UserProfile | null) => set({ user }),
  updateUsername: async (newUsername: string) => {}
})
