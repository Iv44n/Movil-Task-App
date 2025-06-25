import { StateCreator } from 'zustand'
import { ColorsSlice, RootState } from '../types'
import { ColorService } from '@/lib/services/color.service'

type StateCreatorType = StateCreator<RootState, [], [], ColorsSlice>

export const colorsSlice: StateCreatorType = (set, get) => ({
  colors: [],
  createColor: async (color) => {
    const userId = get().user?.user_id
    if (!userId) return

    const newColor = await ColorService.createColor({ color, userId })

    set((state) => ({
      colors: [newColor, ...state.colors]
    }))
    return newColor
  },
  getAllColors: async () => {
    const userId = get().user?.user_id
    if (!userId) return

    const colors = await ColorService.getAllColors(userId)
    set({ colors })
  }
})
