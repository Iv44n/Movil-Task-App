import { RegisterData, User, UserProfile } from '@/types/user'
import { getDb } from '../database/Connection'
import { AppError, DatabaseError } from '@/errors/AppError'
import { UserAlreadyExistsError, UserNotFoundError } from '@/errors/AuthErrors'

export const UserRepository = {
  createUser: async ({ username, password }: RegisterData): Promise<UserProfile> => {
    try {
      const db = await getDb()
      const user = await db.getFirstAsync<UserProfile>(`
        INSERT INTO users (username, hashedPassword)
        VALUES (?, ?)
        RETURNING user_id, username, created_at, updated_at;
      `, [username, password])

      if(!user){
        throw new DatabaseError('Failed to create user')
      }

      return user
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new UserAlreadyExistsError()
      }
      throw new DatabaseError(error.message)
    }
  },
  getUserByUsername: async (username: string): Promise<User> => {
    try {
      const db = await getDb()
      const user = await db.getFirstAsync<User>(`
        SELECT * FROM users WHERE username = ?;
      `, [username])

      if (!user) {
        throw new UserNotFoundError()
      }

      return user
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new DatabaseError(error.message)
    }
  },
  getUserById: async (id: number): Promise<UserProfile> => {
    try {
      const db = await getDb()
      const user = await db.getFirstAsync<UserProfile>(`
        SELECT user_id, username, created_at, updated_at
        FROM users WHERE user_id = ?;
      `, [id])

      if (!user) {
        throw new UserNotFoundError()
      }

      return user
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new DatabaseError(error.message)
    }
  }
}
