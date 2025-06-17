import { AppError } from './AppError'

export class ProjectNotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'ProjectNotFoundError', 'PROJECT_NOT_FOUND')
  }
}
