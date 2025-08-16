import { AuthSession } from '@supabase/supabase-js'
import { database } from './watermelon'
import { User } from '@/models'
import { TABLE_NAMES } from './schema'
import { Q } from '@nozbe/watermelondb'

async function upsertUserFromSession(session: AuthSession | null) {
  if (!session?.user) return
  const { user_metadata, ...user } = session.user

  const isMetadataValid = user_metadata?.firstName as string | undefined && user_metadata?.lastName as string | undefined
  if (!isMetadataValid || !user.email) return

  const { email } = user

  const userCollection = database.get<User>(TABLE_NAMES.USERS)

  await database.write(async () => {
    try {
      const [existing] = await userCollection.query(Q.where('id', user.id)).fetch()

      if (existing) {
        await existing.update(u => {
          u.firstName = user_metadata.firstName
          u.lastName = user_metadata.lastName
          u.email = email
        })
      } else {
        await userCollection.create(u => {
          u._raw.id = user.id
          u.firstName = user_metadata.firstName
          u.lastName = user_metadata.lastName
          u.email = email
        })
      }
    } catch (error) {
      console.error('Failed to upsert user from session', error)
    }
  })
}

export default upsertUserFromSession
