export enum StatusTask {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export const LANG_STORAGE_KEY = 'APP_LANGUAGE'
export const languages = [
  { label: 'Español', value: 'es' },
  { label: 'English', value: 'en' }
]
