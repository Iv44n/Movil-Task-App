import { database } from './watermelon'
import { User } from '@/models'
import { TABLE_NAMES } from './schema'
import { Q } from '@nozbe/watermelondb'

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
}

async function upsertUserFromSession(user: UserData | null) {
  if (!user) return

  const isMetadataValid = user.firstName.trim() !== '' && user.lastName.trim() !== ''
  if (!isMetadataValid || !user.email) return

  const { email } = user

  const userCollection = database.get<User>(TABLE_NAMES.USERS)

  await database.write(async () => {
    try {
      const [existing] = await userCollection.query(Q.where('id', user.id)).fetch()

      if (existing) {
        await existing.update(u => {
          u.firstName = user.firstName
          u.lastName = user.lastName
          u.email = email
        })
      } else {
        await userCollection.create(u => {
          u._raw.id = user.id
          u.firstName = user.firstName
          u.lastName = user.lastName
          u.email = email
        })
      }
    } catch (error) {
      console.error('Failed to upsert user from session', error)
    }
  })
}

export default upsertUserFromSession
