import { SQLiteDatabase } from 'expo-sqlite'
import migration1 from './migrations/001-create-tables'

interface Migration {
  version: number
  description: string
  up: (db: SQLiteDatabase) => Promise<void>
}

const migrations: Migration[] = [migration1]

export async function runMigrations(db: SQLiteDatabase) {
  try {
    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;')

    // If the result is null, it means the database is new and has no version set, in the future we need to handle this case of the null result
    const currentVersion = result?.user_version ?? 0
    console.log(`🔍 Current database version: ${currentVersion}`)

    const pendingMigrations = migrations
      .filter(migration => migration.version > currentVersion)
      .sort((a, b) => a.version - b.version)

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations to run.')
      return
    }

    for (const migration of pendingMigrations) {
      console.log(`🔄 Running migration ${migration.version}: ${migration.description}`)
      try {
        await db.withExclusiveTransactionAsync(async () => {
          await migration.up(db)
          await db.execAsync(`PRAGMA user_version = ${migration.version};`)
        })
      } catch (mError) {
        console.error(`❌ Migration ${migration.version} failed:`, mError)
        throw mError
      }
    }

    console.log('✅ All migrations completed successfully.')
  } catch (error) {
    console.error('❌ Error running migrations:', error)
  }
}
