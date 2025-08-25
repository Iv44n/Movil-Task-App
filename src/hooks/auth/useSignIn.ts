import { useCallback, useState } from 'react'
import { useSignIn as ClerkSignIn, isClerkAPIResponseError } from '@clerk/clerk-expo'

type Error =  { message: string; code?: string } | null

export default function useSignIn() {
  const { isLoaded, signIn: clerkSignIn, setActive } = ClerkSignIn()
  const [signInLoading, setSignInLoading] = useState(false)
  const [signInError, setSignInError] = useState<Error>(null)

  const signIn = useCallback(async (identifier: string, password: string) => {
    setSignInLoading(true)
    setSignInError(null)

    try {
      if (!isLoaded) return

      const signInAttempt = await clerkSignIn.create({ identifier, password })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      const isClerkError = isClerkAPIResponseError(err)
      const message = isClerkError ? err.errors[0].message : 'Error desconocido'
      const code = isClerkError ? err.errors[0].code : undefined

      setSignInError({ message, code })
    } finally {
      setSignInLoading(false)
    }
  }, [clerkSignIn, isLoaded, setActive])

  return {
    signInLoading,
    signInError,
    signIn
  }
}
