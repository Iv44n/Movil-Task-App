import { useEffect, useState } from 'react'
import { User } from '@/models'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TABLE_NAMES } from '@/lib/schema'
import { Q } from '@nozbe/watermelondb'

export default function useCurrentUser(userId: string | null) {
  const database = useDatabase()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!userId) return

    const subscription = database.collections
      .get<User>(TABLE_NAMES.USERS)
      .query(Q.where('id', userId))
      .observeWithColumns(['id', 'email', 'first_name', 'last_name'])
      .subscribe((users) => {
        if (users.length > 0) {
          setUser(users[0])
        }
      })

    return () => subscription.unsubscribe()
  }, [database, userId])

  return user
}
