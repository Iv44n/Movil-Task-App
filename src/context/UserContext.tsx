import { User } from '@/models'
import { useUser } from '@clerk/clerk-expo'
import { createContext, ReactNode, useCallback, useEffect, useState } from 'react'
import { addNetworkStateListener } from 'expo-network'
import { TABLE_NAMES } from '@/lib/schema'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'

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
  updateProfile: (data: { firstName?: string, lastName?: string }) => Promise<void>
  deleteAccount: () => Promise<void>
}

export const UserContext = createContext<UserContextType | null>(null)

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const db = useDatabase()
  const { user: ClerkUser } = useUser()

  const [user, setUser] = useState<User | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])

  const userCollection = db.collections.get<User>(TABLE_NAMES.USERS)

  useEffect(() => {
    const subscription = addNetworkStateListener(({ isConnected }) => setIsOnline(isConnected ?? false))
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    if (ClerkUser) {
      const subscription = userCollection
        .query(Q.where('id', ClerkUser.id), Q.take(1))
        .observeWithColumns(['id', 'email', 'first_name', 'last_name'])
        .subscribe((user) => {
          if (user.length > 0) {
            setUser(user[0])
            setConnectedAccounts(
              ClerkUser.externalAccounts
                .map(acc =>
                  ({ id: acc.id, provider: acc.provider, emailAddress: acc.emailAddress })
                )
            )
          }
        })

      return () => subscription.unsubscribe()
    }
  }, [user, ClerkUser, userCollection])

  const refreshUser = useCallback(async () => {
    if (!isOnline || !ClerkUser) return

    await db.write(async () => {
      const existingUser = await userCollection.query(Q.where('id', ClerkUser.id), Q.take(1)).fetch()
      if (existingUser.length > 0) {
        await existingUser[0].update((user) => {
          user._raw.id = ClerkUser.id
          user.firstName = ClerkUser.firstName || ''
          user.lastName = ClerkUser.lastName || ''
          user.email = ClerkUser.emailAddresses[0].emailAddress
          user.profileImageUrl = ClerkUser.imageUrl
        })
      } else {
        await userCollection.create((user) => {
          user._raw.id = ClerkUser.id
          user.email = ClerkUser.emailAddresses[0].emailAddress
          user.firstName = ClerkUser.firstName || ''
          user.lastName = ClerkUser.lastName || ''
          user.profileImageUrl = ClerkUser.imageUrl
        })
      }
    })
  }, [ClerkUser, isOnline, db, userCollection])

  const updateProfile = useCallback(async (data: { firstName?: string, lastName?: string }) => {
    if (!user || !ClerkUser) return
    if (!isOnline) throw new Error('You need to be online to update your profile')

    await ClerkUser.update(data)
    await refreshUser()
  }, [user, ClerkUser, isOnline, refreshUser])

  const deleteAccount = useCallback(async () => {
    if (!user || !ClerkUser) return
    if (!isOnline) throw new Error('You need to be online to delete your account')

    await ClerkUser.delete()
    await db.write(async () => {
      await user.destroyPermanently()
      setUser(null)
    })
  }, [user, ClerkUser, isOnline, db])

  return (
    <UserContext value={{
      user,
      isOnline,
      connectedAccounts,
      refreshUser,
      updateProfile,
      deleteAccount
    }}
    >
      {children}
    </UserContext>
  )
}
