import { useCallback, useState } from 'react'
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import type { SignUpField } from '@clerk/types'

type FormValues = Record<SignUpField, string>

export function useCompleteSignUp() {
  const router = useRouter()
  const { signUp, setActive, isLoaded } = useSignUp()
  const [isLoadingCompleteSignUp, setIsLoadingCompleteSignUp] = useState(false)
  const [completeError, setCompleteError] = useState<string | null>(null)

  const handleComplete = useCallback(
    async (data: FormValues) => {
      if(!isLoaded) return

      setIsLoadingCompleteSignUp(true)
      try {
        const res = await signUp.update(data)

        if(data.email_address) {
          await res.prepareEmailAddressVerification({ strategy: 'email_code' })

          router.replace({
            pathname: 'verify-email',
            params: { emailAddress: data.email_address }
          })
        } else {
          setActive({ session: res.createdSessionId })
        }
      } catch (error: any) {
        if (!isClerkAPIResponseError(error)) {
          console.error('Non-Clerk Error:', error)
          setCompleteError('An unexpected error occurred. Please try again.')
          return
        }

        const clerkError = error.errors[0]
        setCompleteError(clerkError.message)
      } finally {
        setIsLoadingCompleteSignUp(false)
      }
    },
    [signUp, setActive, router, isLoaded]
  )

  return {
    missingFields: signUp?.missingFields ?? [],
    isLoadingCompleteSignUp,
    complete: handleComplete,
    completeError,
    clearError: () => setCompleteError(null)
  }
}
