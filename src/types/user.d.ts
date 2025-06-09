export interface User {
  user_id: number
  username: string
  hashedPassword: string
  created_at: string
  updated_at: string
}

export type UserProfile = Omit<User, 'hashedPassword'>

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  password: string
}
