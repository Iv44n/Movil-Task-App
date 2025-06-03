import { getDb } from './Connection'
import { runMigrations } from './MigrationsManager'

let initialized = false

export async function initDatabase() {
  if (initialized) return
  initialized = true

  const db = await getDb()
  await runMigrations(db)
}
