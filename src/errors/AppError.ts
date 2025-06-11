export class AppError extends Error {
  public readonly name: string
  public readonly code: string

  constructor(
    message: string,
    name: string = 'AppError',
    code: string = 'GENERAL_ERROR'
  ) {
    super(message)
    this.name = name
    this.code = code
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 'DatabaseError', 'DATABASE_ERROR')
  }
}

export class ValidationError extends AppError {
  public readonly field?: string | string[]

  constructor(message: string, field: string | string[]) {
    super(message, 'ValidationError', 'VALIDATION_ERROR')
    this.field = field
  }
}
