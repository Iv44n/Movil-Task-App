import { getDb } from '../database/Connection'
import { runMigrations } from './MigrationsManager'

let initialized = false

export async function initDatabase() {
  if (initialized) return
  initialized = true

  try {
    const db = await getDb()
    await runMigrations(db)
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}
