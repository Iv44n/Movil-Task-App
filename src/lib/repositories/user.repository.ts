import { RegisterData, User, UserProfile } from '@/types/user'
import { getDb } from '../database/Connection'
import AppError from '@/utils/AppError'

export const UserRepository = {
  createUser: async ({ username, password }: RegisterData): Promise<UserProfile> => {
    const db = await getDb()

    try {
      const user = await db.getFirstAsync<UserProfile>(`
        INSERT INTO users (username, hashedPassword)
        VALUES (?, ?)
        RETURNING user_id, username, created_at, updated_at;
      `, [username, password])

      if(!user){
        throw new AppError('User not found after creation', 'USER_NOT_FOUND')
      }

      return user
    } catch (error: any) {
      if (typeof error.message === 'string' && error.message.includes('UNIQUE constraint failed: users.username')) {
        throw new AppError('User already exists', 'USER_ALREADY_EXISTS')
      }

      throw new AppError('Failed to create user', 'USER_CREATION_FAILED')
    }

  },
  getUserByUsername: async (username: string): Promise<User | null> => {
    try {
      const db = await getDb()
      const user = await db.getFirstAsync<User>(`
        SELECT * FROM users WHERE username = ?;
      `, [username])

      return user
    } catch (error: any) {
      console.log('ERRO_CODE', error.code)
      throw new Error(`Failed to retrieve user by name: ${error.message || error}`)
    }
  },
  getUserById: async (id: number): Promise<UserProfile | null> => {
    try {
      const db = await getDb()
      const user = await db.getFirstAsync<UserProfile>(`
        SELECT user_id, username, created_at, updated_at
        FROM users WHERE user_id = ?;
      `, [id])

      if (!user) {
        console.log(`User with id "${id}" not found.`)
      }

      return user
    } catch (error: any) {
      console.log('ERRO_CODE', error.code)
      throw new Error(`Failed to retrieve user by id: ${error.message || error}`)
    }
  },
  existsUserByUsername: async (username: string): Promise<boolean> => {
    try {
      const db = await getDb()
      const row = await db.getFirstAsync<{ user_exists: number }>(`
        SELECT EXISTS(SELECT 1 FROM users WHERE username = ?) AS user_exists;
      `, [username])

      return row?.user_exists === 1
    } catch (error: any) {
      console.error('existsUserByUsername error:', error)
      throw new AppError('Failed to check if user exists', 'USER_EXISTS_CHECK_FAILED')
    }
  }
}
