import { supabase } from '@/lib/supabase'
import { AuthError } from '@supabase/supabase-js'
import { useCallback, useState } from 'react'
import { makeRedirectUri } from 'expo-auth-session'

type Error =  { message: string; code?: string } | null

interface SignUpCreateParams {
  firstName: string
  lastName: string
  password: string
  emailAddress: string
}

const redirectUri = makeRedirectUri({ path: 'login' })

export default function useSignUp() {
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [signUpError, setSignUpError] = useState<Error>(null)

  const signUp = useCallback(
    async ({ firstName, lastName, password, emailAddress }: SignUpCreateParams) => {
      setSignUpLoading(true)
      setSignUpError(null)

      try {
        const { data, error } = await supabase.auth.signUp({
          email: emailAddress,
          password,
          options: {
            data: { firstName, lastName },
            emailRedirectTo: redirectUri
          }
        })

        if (error) {
          throw error
        }

        if (
          data.user?.identities &&
          data.user.identities.length === 0 &&
          data.user.user_metadata.email_verified === undefined
        ) {
          throw new AuthError('Email already registered or pending verification')
        }

        return { user: data.user, session: data.session, error: null }

      } catch (err: any) {
        const message = err instanceof AuthError ? err.message : 'Error desconocido'
        const code = err instanceof AuthError ? err.code : undefined

        setSignUpError({ message, code })
        return { user: null, session: null, error: { message, code } }
      } finally {
        setSignUpLoading(false)
      }
    },
    []
  )

  return {
    signUpLoading,
    signUpError,
    signUp
  }
}
