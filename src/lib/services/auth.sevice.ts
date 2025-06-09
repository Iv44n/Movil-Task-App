import { LoginCredentials, RegisterData, UserProfile } from '@/types/user'
import { UserRepository } from '../repositories/user.repository'
import { deleteItem, getItem, saveItem } from '@/utils/secureStore'
import AppError from '@/utils/AppError'

const AUTH_TOKEN_KEY = 'auth_token'

export const AuthService = {
  register: async ({ username, password }: RegisterData): Promise<UserProfile> =>{
    try {
      const existingUser = await UserRepository.existsUserByUsername(username)

      if (existingUser) {
        throw new AppError('User already exists', 'USER_ALREADY_EXISTS')
      }

      const newUser = await UserRepository.createUser({
        username,
        password
      })

      const token = `mock_jwt_token_for_${newUser.user_id}`
      await saveItem(AUTH_TOKEN_KEY, token)

      return newUser
    } catch (error: AppError | any) {
      if (error instanceof AppError) {
        throw error
      }

      console.error('AuthService: Error during register:', error)
      throw new AppError('AuthService: Error during register:', 'REGISTER_FAILED')
    }
  },
  login: async (data: LoginCredentials): Promise<UserProfile> => {
    try {
      const user = await UserRepository.getUserByUsername(data.username)

      if (!user) {
        throw new AppError('Invalid username or password.', 'INVALID_CREDENTIALS')
      }

      const isValidPassword = user.hashedPassword === data.password

      if(!isValidPassword) {
        throw new AppError('Invalid username or password.', 'INVALID_CREDENTIALS')
      }

      const token = `mock_jwt_token_for_${user.user_id}`
      await saveItem(AUTH_TOKEN_KEY, token)

      return {
        user_id: user.user_id,
        username: user.username,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }

      console.error('AuthService: Error during login:', error)
      throw new AppError('AuthService: Error during login:', 'LOGIN_FAILED')
    }
  },
  logout: async () => {
    try {
      await deleteItem(AUTH_TOKEN_KEY)
    } catch (error) {
      console.error('AuthService: Error during logout:', error)
      throw new Error('Failed to log out securely.')
    }
  },
  getCurrentUser: async (): Promise<UserProfile | null> => {
    const token = await getItem(AUTH_TOKEN_KEY)

    if(!token) {
      return null
    }

    const userIdMatch = token.match(/_for_(\d+)$/)

    if (userIdMatch && userIdMatch[1]) {
      const userId = parseInt(userIdMatch[1], 10)

      try {
        const user = await UserRepository.getUserById(userId)

        if(!user && token) {
          await deleteItem(AUTH_TOKEN_KEY)
        }

        return user
      } catch (error: any) {
        console.log('ERROR_CODE', error.code)
        return null
      }
    }

    return null
  }
}
