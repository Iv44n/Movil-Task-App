import { StateCreator } from 'zustand'
import { OverlaySlice, RootState } from '../types'

type StateCreatorType = StateCreator<RootState, [], [], OverlaySlice>

export const overlaySlice: StateCreatorType = (set) => ({
  overlayContent: null,
  showOverlay: (content) => set({ overlayContent: content }),
  hideOverlay: () => set({ overlayContent: null })
})
