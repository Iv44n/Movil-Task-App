import { create } from 'zustand'
import { userSlice } from './slices/user.slice'
import { authSlice } from './slices/auth.slice'
import { RootState } from './types'

const useBoundStore = create<RootState>()((...a) => ({
  ...userSlice(...a),
  ...authSlice(...a)
}))

export default useBoundStore
