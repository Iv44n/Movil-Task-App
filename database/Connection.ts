import * as Sqlite from 'expo-sqlite'

let dbInstance: Sqlite.SQLiteDatabase | null = null
const dbName = 'myDatabase.db'

export async function getDb() {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await Sqlite.openDatabaseAsync(dbName)
  await dbInstance.execAsync('PRAGMA foreign_keys = ON;')
  await dbInstance.execAsync('PRAGMA journal_mode = WAL;')

  return dbInstance
}
