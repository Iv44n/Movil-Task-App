import * as SQLite from 'expo-sqlite'
import { runMigrations } from './migrations/init'

export async function initDatabase() {
  try {
    const db = await SQLite.openDatabaseAsync('mydatabase.db')

    await db.execAsync(`
      PRAGMA foreign_keys = ON;
    `)

    await runMigrations(db)

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)

  }
}
