import { useSignIn as ClerkUseSignIn, isClerkAPIResponseError } from '@clerk/clerk-expo'
import { useCallback, useState } from 'react'

export default function useSignIn() {
  const { signIn: ClerkSignIn, isLoaded, setActive } = ClerkUseSignIn()
  const [signInLoading, setSignInLoading] = useState(false)
  const [signInError, setSignInError] = useState<string | null>(null)

  const signIn = useCallback(async (identifier: string, password: string) => {
    if (!isLoaded) return

    setSignInLoading(true)
    setSignInError(null)
    try {
      const signInResult = await ClerkSignIn.create({ identifier, password })

      if (signInResult.status === 'complete') {
        setActive({ session: signInResult.createdSessionId })
      }
    } catch (err: any) {
      if (!isClerkAPIResponseError(err)) {
        console.error('Non-Clerk Error:', err)
        setSignInError('An unexpected error occurred. Please try again.')
        return
      }

      const clerkError = err.errors[0]
      setSignInError(clerkError.message)
    } finally {
      setSignInLoading(false)
    }
  }, [isLoaded, ClerkSignIn, setActive])

  return {
    signInLoading,
    signInError,
    signIn
  }
}
