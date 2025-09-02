import { UserContext } from '@/context/UserContext'
import { useContext } from 'react'

export default function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within a UserContextProvider')
  return ctx
}
