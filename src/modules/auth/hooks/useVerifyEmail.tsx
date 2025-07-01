import { useSignUp as ClerkUseSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo'
import { useCallback, useState } from 'react'

export default function useVerifyEmail() {
  const { signUp: ClerkSignUp, isLoaded, setActive } = ClerkUseSignUp()
  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false)
  const [verifyEmailError, setVerifyEmailError] = useState<string | null>(null)

  const verifySignUp = useCallback(async (code: string) => {
    if (!isLoaded) return

    try {
      setVerifyEmailLoading(true)
      const signUpAttempt = await ClerkSignUp.attemptEmailAddressVerification({ code })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
      }
    } catch (err: any) {
      if (!isClerkAPIResponseError(err)) {
        console.error('Non-Clerk Error:', err)
        setVerifyEmailError('An unexpected error occurred. Please try again.')
        return
      }

      const clerkError = err.errors[0]
      setVerifyEmailError(clerkError.message)
    } finally {
      setVerifyEmailLoading(false)
    }
  }, [isLoaded, ClerkSignUp, setActive])

  return {
    verifySignUp,
    clearError: () => setVerifyEmailError(null),
    verifyEmailLoading,
    verifyEmailError
  }
}
