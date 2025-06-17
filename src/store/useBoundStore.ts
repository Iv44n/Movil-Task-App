import { create } from 'zustand'
import { userSlice } from './slices/user.slice'
import { authSlice } from './slices/auth.slice'
import { RootState } from './types'
import { projectsSlice } from './slices/projects.slice'

const useBoundStore = create<RootState>()((...a) => ({
  ...userSlice(...a),
  ...authSlice(...a),
  ...projectsSlice(...a)
}))

export default useBoundStore
