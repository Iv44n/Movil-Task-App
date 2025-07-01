import { useSignUp as ClerkUseSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo'
import { useCallback, useState } from 'react'

interface SignUpCreateParams {
  firstName: string
  lastName: string
  password: string
  username: string,
  emailAddress: string,
}

export default function useSignUp() {
  const { signUp: ClerkSignUp, isLoaded } = ClerkUseSignUp()
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [signUpError, setSignUpError] = useState<{ message: string, code: string } | null>(null)
  const [verifyInfo, setVerifyInfo] = useState({
    emailAddress: '',
    pendingVerification: false
  })

  const handleClerkError = useCallback((error: any) => {
    if (!isClerkAPIResponseError(error)) {
      console.error('Non-Clerk Error:', error)
      return
    }

    const clerkError = error.errors[0]
    if (clerkError.code === 'form_password_pwned') {
      setSignUpError({
        message: 'Password found in breach. Use a different one.',
        code: clerkError.code
      })
    } else {
      setSignUpError({
        message: clerkError.message,
        code: clerkError.code
      })
    }
  }, [])

  const signUp = useCallback(async (params: SignUpCreateParams) => {
    if (!isLoaded) return

    setSignUpLoading(true)
    setSignUpError(null)

    try {
      await ClerkSignUp.create(params)
      await ClerkSignUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setVerifyInfo({
        emailAddress: params.emailAddress,
        pendingVerification: true
      })
    } catch (err: any) {
      handleClerkError(err)
    } finally {
      setSignUpLoading(false)
    }
  }, [isLoaded, ClerkSignUp, handleClerkError])

  return {
    signUpLoading,
    signUpError,
    signUp,
    verifyInfo
  }
}
