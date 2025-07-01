import { drizzle } from 'drizzle-orm/expo-sqlite'
import { useSQLiteContext } from 'expo-sqlite'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'

export function useDrizzleDb() {
  const expoDb = useSQLiteContext()
  useDrizzleStudio(expoDb)
  return drizzle(expoDb, { casing: 'snake_case' })
}
