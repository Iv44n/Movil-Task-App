import { LoginCredentials, RegisterData, UserProfile } from '@/types/user'
import { UserRepository } from '../repositories/user.repository'
import { deleteItem, getItem, saveItem } from '@/utils/secureStore'
import { IncorrectPasswordError, UserAlreadyExistsError, UserNotFoundError } from '@/errors/AuthErrors'
import { AppError, ValidationError } from '@/errors/AppError'

const AUTH_TOKEN_KEY = 'auth_token'

export const AuthService = {
  register: async ({ username, password }: RegisterData): Promise<UserProfile> =>{
    if (!username) {
      throw new ValidationError('username is required', 'username')
    }

    if (username.length < 3) {
      throw new ValidationError('El usuario debe tener al menos 3 caracteres', 'username')
    }

    if (password.length < 6) {
      throw new ValidationError('password must be at least 6 characters long', 'password')
    }

    /*     if (password !== confirmPassword) {
      throw new ValidationError('confirmPassword', 'Las contraseñas no coinciden')
    }*/

    try {
      const newUser = await UserRepository.createUser({
        username,
        password
      })

      const token = `mock_jwt_token_for_${newUser.user_id}`
      await saveItem(AUTH_TOKEN_KEY, token)

      return newUser
    } catch (error) {
      if(error instanceof UserAlreadyExistsError){
        throw new ValidationError(error.message, 'username')
      }
      throw error
    }
  },
  login: async ({ username, password }: LoginCredentials): Promise<UserProfile> => {
    if (!username || !password) {
      throw new ValidationError('Username and password are required', ['username', 'password'])
    }

    if (!username.trim()) {
      throw new ValidationError('username', 'El nombre de usuario es requerido')
    }

    if (!password.trim()) {
      throw new ValidationError('password', 'La contraseña es requerida')
    }

    try {
      const user = await UserRepository.getUserByUsername(username)

      const isValidPassword = user.hashedPassword === password

      if(!isValidPassword) {
        throw new IncorrectPasswordError()
      }

      const token = `mock_jwt_token_for_${user.user_id}`
      await saveItem(AUTH_TOKEN_KEY, token)

      return {
        user_id: user.user_id,
        username: user.username,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    } catch (error) {
      if(error instanceof UserNotFoundError || error instanceof IncorrectPasswordError) {
        throw new ValidationError('Invalid username or password', ['username', 'password'])
      }
      throw error
    }
  },
  logout: async () => {
    try {
      await deleteItem(AUTH_TOKEN_KEY)
    } catch (error: any) {
      throw new AppError(error.message, 'LogoutError', 'LOGOUT_ERROR')
    }
  },
  getSession: async (): Promise<UserProfile | null> => {
    const token = await getItem(AUTH_TOKEN_KEY)

    if(!token) return null

    const userIdMatch = token.match(/_for_(\d+)$/)
    const userId = userIdMatch ? parseInt(userIdMatch[1], 10) : null

    if(!userId) return null

    try {
      return await UserRepository.getUserById(userId)
    } catch (error) {
      if(error instanceof UserNotFoundError && token) {
        await deleteItem(AUTH_TOKEN_KEY)
        return null
      }

      throw error
    }
  }
}
