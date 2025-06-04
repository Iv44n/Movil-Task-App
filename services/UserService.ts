import { getDb } from '@/database/Connection'
import { buildUpdateUserQuery, userQueries  } from './queries/UserQueries'

interface User {
  user_id: number
  name: string
  created_at: string,
  updated_at: string
}

interface NewUserInput {
  name: string
  password: string
}

export const userService = {
  insertUser: async ({ name, password }: NewUserInput): Promise<User> => {
    try {
      const db = await getDb()
      const user = await db.getFirstAsync<User>(userQueries.insertUser, [name, password])

      if (!user) {
        throw new Error('User insertion failed')
      }

      return user
    } catch (error) {
      console.error('Error inserting user:', error)
      throw error
    }
  },
  getUserByName: async (name: string): Promise<User> => {
    try {
      const db = await getDb()
      const user = await db.getFirstAsync<User>(userQueries.getUserByName, [name])

      if (!user) {
        throw new Error(`User with name "${name}" not found`)
      }

      return user
    } catch (error) {
      console.error('Error getting user by name:', error)
      throw error
    }
  },
  updateUserById: async (
    userId: number, fields: Partial<{ name: string; password: string }>
  ): Promise<User | { user: User, passwordChanged: boolean }> => {
    try {
      const db = await getDb()

      const { text, values } = buildUpdateUserQuery(userId, fields)
      const user = await db.getFirstAsync<User>(text, values)

      if (!user) {
        throw new Error(`Failed to update user with ID ${userId}`)
      }

      const passwordChanged = !!fields.password
      return passwordChanged ? { user, passwordChanged } : user
    } catch (error) {
      console.error('Error updating user name by ID:', error)
      throw error
    }
  },
  deleteUserById: async (userId: number): Promise<{ isDelete: boolean }> => {
    try {
      const db = await getDb()
      const result = await db.runAsync(userQueries.deleteUserById, [userId])

      if (result.changes === 0) {
        throw new Error(`No user found with ID ${userId}`)
      }
      return { isDelete: true }
    } catch (error) {
      console.error('Error deleting user by ID:', error)
      throw error
    }
  }
}
