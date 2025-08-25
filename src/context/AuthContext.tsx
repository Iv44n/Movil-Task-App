import { createContext, ReactNode, useEffect } from 'react'
import useCurrentUser from '@/hooks/auth/useCurrentUser'
import { User } from '@/models'
import { useUser } from '@clerk/clerk-expo'
import upsertUserFromSession from '@/lib/helpers'

interface SessionContextType {
  user: User | null
  isLoaded: boolean
}

export const AuthContext = createContext<SessionContextType>({
  user: null,
  isLoaded: false
})

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser()
  const currentUser = useCurrentUser(user?.id ?? null)

  useEffect(() => {
    if (isSignedIn && isLoaded && user) {
      upsertUserFromSession({
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      })
    }
  }, [isSignedIn, isLoaded, user])

  return (
    <AuthContext.Provider value={{ user: currentUser, isLoaded }}>
      {children}
    </AuthContext.Provider>
  )
}
