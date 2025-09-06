import { User } from '@/models'
import { useUser } from '@clerk/clerk-expo'
import { createContext, ReactNode, useCallback, useEffect, useState, useMemo } from 'react'
import { TABLE_NAMES } from '@/lib/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import useNetworkState from '@/hooks/useNetworkState'

interface ConnectedAccount {
  id: string
  provider: string
  emailAddress: string
}

interface UserContextType {
  user: User | null
  connectedAccounts: ConnectedAccount[]
  isOnline: boolean
  refreshUser: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
  deleteAccount: () => Promise<void>
}

type UpdateProfileData = {
  firstName?: string
  lastName?: string
}

const OFFLINE_ERROR = 'You need to be online to perform this action'

export const UserContext = createContext<UserContextType | null>(null)

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const db = useDatabase()
  const { user: clerkUser, isLoaded } = useUser()

  const [user, setUser] = useState<User | null>(null)
  const isOnline = useNetworkState()

  const userCollection = useMemo(
    () => db.collections.get<User>(TABLE_NAMES.USERS),
    [db]
  )
  const connectedAccounts = useMemo((): ConnectedAccount[] => {
    if (!clerkUser?.externalAccounts) return []

    return clerkUser.externalAccounts.map(acc => ({
      id: acc.id,
      provider: acc.provider,
      emailAddress: acc.emailAddress
    }))
  }, [clerkUser?.externalAccounts])

  const ensureLocalUser = useCallback(async (): Promise<User | null> => {
    if (!clerkUser) return null

    try {
      return await db.write(async () => {
        const [existingUser] = await userCollection
          .query(Q.where('id', clerkUser.id))
          .fetch()

        if (existingUser) return existingUser

        return await userCollection.create(newUser => {
          newUser._raw.id = clerkUser.id
          newUser.email = clerkUser.emailAddresses[0]?.emailAddress ?? ''
          newUser.firstName = clerkUser.firstName ?? ''
          newUser.lastName = clerkUser.lastName ?? ''
          newUser.profileImageUrl = clerkUser.imageUrl ?? ''
        })
      })
    } catch (error) {
      console.error('Error ensuring local user:', error)
      return null
    }
  }, [clerkUser, db, userCollection])

  useEffect(() => {
    if (!isLoaded) return

    if (!clerkUser) {
      setUser(null)
      return
    }

    let subscription: { unsubscribe: () => void } | null = null

    const setupUserSubscription = async () => {
      try {
        const localUser = await ensureLocalUser()

        if (!localUser) {
          return
        }

        subscription = userCollection
          .query(Q.where('id', clerkUser.id))
          .observe()
          .subscribe(rows => {
            setUser(rows[0] ?? null)
          })
      } catch (error) {
        console.error('Error setting up user subscription:', error)
      }
    }

    setupUserSubscription()

    return () => {
      subscription?.unsubscribe()
    }
  }, [clerkUser, isLoaded, userCollection, ensureLocalUser])

  const refreshUser = useCallback(async () => {
    if (!isOnline) {
      throw new Error(OFFLINE_ERROR)
    }

    if (!clerkUser) return

    const localUser = await ensureLocalUser()
    if (!localUser) return

    await db.write(async () => {
      await localUser.update(updatedUser => {
        updatedUser.firstName = clerkUser.firstName ?? ''
        updatedUser.lastName = clerkUser.lastName ?? ''
        updatedUser.email = clerkUser.emailAddresses[0]?.emailAddress ?? ''
        updatedUser.profileImageUrl = clerkUser.imageUrl ?? ''
      })
    })
  }, [clerkUser, isOnline, db, ensureLocalUser])

  const updateProfile = useCallback(
    async (data: UpdateProfileData) => {
      if (!user || !clerkUser) {
        throw new Error('User not found')
      }

      if (!isOnline) {
        throw new Error(OFFLINE_ERROR)
      }

      await clerkUser.update(data)
      await refreshUser()
    },
    [user, clerkUser, isOnline, refreshUser]
  )

  const deleteAccount = useCallback(async () => {
    if (!user || !clerkUser) {
      throw new Error('User not found')
    }

    if (!isOnline) {
      throw new Error(OFFLINE_ERROR)
    }

    await clerkUser.delete()
    await db.write(async () => {
      await user.destroyPermanently()
    })
    setUser(null)
  }, [user, clerkUser, isOnline, db])

  const contextValue = useMemo((): UserContextType => ({
    user,
    isOnline,
    connectedAccounts,
    refreshUser,
    updateProfile,
    deleteAccount
  }), [
    user,
    isOnline,
    connectedAccounts,
    refreshUser,
    updateProfile,
    deleteAccount
  ])

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}
