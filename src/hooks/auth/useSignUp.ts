import { useCallback, useState } from 'react'
import { useSignUp as ClerkSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo'

type Error =  { message: string; code?: string } | null

interface SignUpCreateParams {
  firstName: string
  lastName: string
  password: string
  emailAddress: string
}

export default function useSignUp() {
  const { isLoaded, signUp: clerkSignUp, setActive } = ClerkSignUp()

  const [signUpLoading, setSignUpLoading] = useState(false)
  const [signUpError, setSignUpError] = useState<Error>(null)
  const [pendingVerification, setPendingVerification] = useState(false)

  const signUp = useCallback(
    async ({ firstName, lastName, password, emailAddress }: SignUpCreateParams) => {
      setSignUpLoading(true)
      setSignUpError(null)

      try {
        if (!isLoaded) return

        await clerkSignUp.create({
          emailAddress,
          password,
          firstName,
          lastName
        })

        await clerkSignUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        setPendingVerification(true)
      } catch (err: any) {
        const isClerkError = isClerkAPIResponseError(err)
        const message = isClerkError ? err.errors[0].message : 'Error desconocido'
        const code = isClerkError ? err.errors[0].code : undefined

        setSignUpError({ message, code })
      } finally {
        setSignUpLoading(false)
      }
    }, [clerkSignUp, isLoaded])

  const onVerify = useCallback(async (code: string) => {
    setSignUpLoading(true)
    setSignUpError(null)

    try {
      if (!isLoaded) return

      const signUpAttempt = await clerkSignUp.attemptEmailAddressVerification({
        code
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        setPendingVerification(false)
      } else {

      }
    } catch (err: any) {
      const isClerkError = isClerkAPIResponseError(err)
      const message = isClerkError ? err.errors[0].message : 'Error desconocido'
      const code = isClerkError ? err.errors[0].code : undefined

      setSignUpError({ message, code })
    } finally {
      setSignUpLoading(false)
    }
  }, [clerkSignUp, isLoaded, setActive])

  return {
    signUpLoading,
    signUpError,
    pendingVerification,
    signUp,
    onVerify
  }
}
