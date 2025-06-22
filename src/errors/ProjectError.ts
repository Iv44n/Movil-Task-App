import { AppError } from './AppError'

export class ProjectNotFoundError extends AppError {
  constructor(message?: string) {
    super(message || 'Project not found', 'ProjectNotFoundError', 'PROJECT_NOT_FOUND')
  }
}

export class ProjectAlreadyExistsError extends AppError {
  constructor() {
    super('Project already exists', 'ProjectAlreadyExistsError', 'PROJECT_ALREADY_EXISTS')
  }
}

export class FailedToCreateProjectError extends AppError {
  constructor(message?: string) {
    super(message || 'Failed to create project', 'FailedToCreateProjectError', 'FAILED_TO_CREATE_PROJECT')
  }
}
