import { supabase } from '@/lib/supabase'
import { AuthSession, AuthUser } from '@supabase/supabase-js'
import { createContext, useEffect, useRef, useState, ReactNode } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { AppState, AppStateStatus } from 'react-native'

interface SessionContextType {
  session: AuthSession | null
  user: AuthUser | null
  isLoaded: boolean
}

const EVENTS = {
  SIGNED_IN: 'SIGNED_IN',
  SIGNED_OUT: 'SIGNED_OUT'
}

export const AuthContext = createContext<SessionContextType>({
  session: null,
  user: null,
  isLoaded: false
})

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const appStateRef = useRef(AppState.currentState)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      supabase.auth.getSession(),
      supabase.auth.getUser()
    ]).then(([{ data: sessionData }, { data: userData }]) => {
      if (isMounted) {
        setSession(sessionData.session)
        setUser(userData.user)
        setIsLoaded(true)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === EVENTS.SIGNED_IN) {
        setSession(session)
        setUser(session?.user ?? null)
      }
      if (event === EVENTS.SIGNED_OUT) {
        setSession(null)
        setUser(null)
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

  return (
    <AuthContext.Provider value={{ session, user, isLoaded }}>
      {children}
    </AuthContext.Provider>
  )
}
