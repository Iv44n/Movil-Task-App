import { create } from 'zustand'
import { userSlice } from './slices/user.slice'
import { authSlice } from './slices/auth.slice'
import { RootState } from './types'
import { projectsSlice } from './slices/projects.slice'
import { categorySlice } from './slices/category.slice'
import { overlaySlice } from './slices/overlay.slice'
import { colorsSlice } from './slices/color.slice'

const useBoundStore = create<RootState>()((...a) => ({
  ...userSlice(...a),
  ...authSlice(...a),
  ...projectsSlice(...a),
  ...categorySlice(...a),
  ...overlaySlice(...a),
  ...colorsSlice(...a)
}))

export default useBoundStore
