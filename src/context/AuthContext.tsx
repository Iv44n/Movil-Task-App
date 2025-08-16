import { supabase } from '@/lib/supabase'
import { AuthSession } from '@supabase/supabase-js'
import { createContext, useEffect, useRef, useState, ReactNode } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { AppState, AppStateStatus } from 'react-native'
import * as QueryParams from 'expo-auth-session/build/QueryParams'
import useCurrentUser from '@/hooks/auth/useCurrentUser'
import { User } from '@/models'
import upsertUserFromSession from '@/lib/helpers'

interface SessionContextType {
  session: AuthSession | null
  user: User | null
  isLoaded: boolean,
  createdSessionFromUrl: (url: string) => Promise<AuthSession | undefined | null>
}

const EVENTS = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT'
}

export const AuthContext = createContext<SessionContextType>({
  session: null,
  user: null,
  isLoaded: false,
  createdSessionFromUrl: async () => undefined
})

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const currentUser = useCurrentUser(session?.user?.id ?? null)
  const [isOnline, setIsOnline] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const appStateRef = useRef(AppState.currentState)

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session)
        setIsLoaded(true)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === EVENTS.SIGNED_IN) {
        setSession(session)
        upsertUserFromSession(session)
      }
      if (event === EVENTS.SIGNED_OUT) {
        setSession(null)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    NetInfo.fetch().then(state => {
      if (isMounted) setIsOnline(state.isConnected ?? false)
    })

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false)
    })

    const handleAppState = (nextAppState: AppStateStatus) => {
      appStateRef.current = nextAppState
      handleAutoRefresh(appStateRef.current, isOnline)
    }
    const appStateSubscription = AppState.addEventListener('change', handleAppState)

    return () => {
      isMounted = false
      unsubscribeNetInfo()
      appStateSubscription.remove()
      supabase.auth.stopAutoRefresh()
    }
  }, [isOnline])

  useEffect(() => {
    handleAutoRefresh(appStateRef.current, isOnline)
  }, [isOnline])

  function handleAutoRefresh(appState: AppStateStatus, online: boolean) {
    if (appState === 'active' && online) {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  }

  const createdSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url)

    if (errorCode) {
      console.error({ 'ERROR_ON_GET_QUERY_PARAMS': errorCode })
      return
    }

    const { access_token, refresh_token } = params

    if (!access_token) return

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token
    })
    if (error) {
      console.error({ 'ERROR_AFTER_SESSION_SET': error })
      return
    }

    return data.session
  }

  return (
    <AuthContext.Provider value={{ session, user: currentUser, isLoaded, createdSessionFromUrl }}>
      {children}
    </AuthContext.Provider>
  )
}
