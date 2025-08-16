import { useEffect, useState } from 'react'
import { User } from '@/models'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TABLE_NAMES } from '@/lib/schema'

export default function useCurrentUser(userId: string | null) {
  const database = useDatabase()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!userId) return

    const subscription = database.collections
      .get<User>(TABLE_NAMES.USERS)
      .findAndObserve(userId)
      .subscribe(setUser)

    return () => subscription.unsubscribe()
  }, [database, userId])

  return user
}
