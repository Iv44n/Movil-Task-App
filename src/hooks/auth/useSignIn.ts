import { supabase } from '@/lib/supabase'
import { AuthError } from '@supabase/supabase-js'
import { useCallback, useState } from 'react'

type Error =  { message: string; code?: string } | null

export default function useSignIn() {
  const [signInLoading, setSignInLoading] = useState(false)
  const [signInError, setSignInError] = useState<Error>(null)

  const signIn = useCallback(async (identifier: string, password: string) => {
    setSignInLoading(true)
    setSignInError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password
      })

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (err: any) {
      const message = err instanceof AuthError ? err.message : 'Error desconocido'
      const code = err instanceof AuthError ? err.code : undefined
      setSignInError({ message, code })
      return { data: null, error: err }
    } finally {
      setSignInLoading(false)
    }
  }, [])

  return {
    signInLoading,
    signInError,
    signIn
  }
}
