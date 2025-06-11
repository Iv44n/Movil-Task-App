import { AppError } from './AppError'

export class UserNotFoundError extends AppError{
  constructor(){
    super('User not found', 'UserNotFoundError', 'USER_NOT_FOUND')
  }
}

export class IncorrectPasswordError extends AppError{
  constructor(){
    super('Incorrect password', 'IncorrectPasswordError', 'INCORRECT_PASSWORD')
  }
}

export class UserAlreadyExistsError extends AppError{
  constructor(){
    super('User already exists', 'UserAlreadyExistsError', 'USER_ALREADY_EXISTS')
  }
}
