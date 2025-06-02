import { runMigrations } from './MigrationsManager'

let initialized = false

export async function initDatabase() {
  if (initialized) return
  initialized = true

  try {
    await runMigrations()
    console.log('✅ Migrations completed')
  } catch (err) {
    console.error('❌ Error during migrations:', err)
  }
}
