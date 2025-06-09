import * as FileSystem from 'expo-file-system'
import * as Sqlite from 'expo-sqlite'

const DB_NAME = 'myDatabase.db'
const DB_DIR = `${FileSystem.documentDirectory}SQLite`

let dbInstance: Sqlite.SQLiteDatabase | null = null
let initializationPromise: Promise<Sqlite.SQLiteDatabase> | null = null

export async function getDb(): Promise<Sqlite.SQLiteDatabase> {
  if (dbInstance) return dbInstance
  if (initializationPromise) return initializationPromise

  initializationPromise = (async () => {
    try {
      dbInstance = await openDatabaseWithRecovery()
      return dbInstance
    } finally{
      initializationPromise = null
    }
  })()

  return initializationPromise
}

async function openDatabaseWithRecovery(): Promise<Sqlite.SQLiteDatabase> {
  try {
    return await openAndConfigureDatabase()
  } catch (error: any) {
    if (error.code === 'ERR_OPEN_DATABASE') {
      console.warn('🔄 DB open failed, recovering...')
      await recoverDatabaseEnvironment()
      const db = await openAndConfigureDatabase()
      console.log('🔄 RECOVERY SUCCESSFUL: Database opened after fixing environment')
      return db
    }

    console.error('❌ Failed to open DB:', error.code || error)
    throw error
  }
}

async function openAndConfigureDatabase(): Promise<Sqlite.SQLiteDatabase> {
  const db = await Sqlite.openDatabaseAsync(DB_NAME, undefined, DB_DIR)
  await db.execAsync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;')

  return db
}

async function recoverDatabaseEnvironment() {
  try {
    const info = await FileSystem.getInfoAsync(DB_DIR)

    if(info.exists && !info.isDirectory){
      console.warn('🗑️ DB_DIR exists as a file, deleting...')
      await handleDirectoryDeletion()
    } else if (!info.exists){
      console.warn('📁 DB_DIR does not exist, creating...')
      await handleDirectoryCreation()
    }

  } catch (fsError: any) {
    console.error('❌ Could not verify DB directory, aborting cleanup:', fsError)
    throw new Error(`Failed to check DB directory: ${fsError.message}`)
  }
}

async function handleDirectoryDeletion() {
  try {
    await FileSystem.deleteAsync(DB_DIR, { idempotent: true })
    console.log('✅ Successfully deleted problematic DB_DIR file.')
  } catch (deleteError: any) {
    console.error('❌ Failed to delete problematic DB_DIR file:', deleteError)
    throw new Error(`DB directory file deletion failed: ${deleteError.message}`)
  }

  await handleDirectoryCreation()
}

async function handleDirectoryCreation(): Promise<void> {
  try {
    await FileSystem.makeDirectoryAsync(DB_DIR, { intermediates: true })
    console.log('✅ Successfully created DB_DIR.')
  } catch (createError: any) {
    console.error('❌ Failed to create DB_DIR:', createError)
    throw new Error(`DB directory creation failed: ${createError.message}`)
  }
}
