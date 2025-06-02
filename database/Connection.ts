import * as Sqlite from 'expo-sqlite'

let dbInstance: Sqlite.SQLiteDatabase | null = null
const dbName = 'myDatabase.db'

export async function getDb() {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await Sqlite.openDatabaseAsync(dbName)
  return dbInstance
}
