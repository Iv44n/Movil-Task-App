import { AuthContext } from '@/context/AuthContext'
import { useContext } from 'react'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useSessionContext must be used within a SessionContextProvider')
  }
  return ctx
}
