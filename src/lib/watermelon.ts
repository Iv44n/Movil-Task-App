import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { setGenerator } from '@nozbe/watermelondb/utils/common/randomId'
import schema from './schema'
import migrations from './migrations'
import { randomUUID } from 'expo-crypto'
import { Category, Project, Subtask, Task, User } from '@/models'

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: true,
  onSetUpError: error => {
    console.error('Failed to set up database', error)
  }
})

export const database = new Database({
  adapter,
  modelClasses: [User, Category, Project, Task, Subtask]
})

setGenerator(() => randomUUID())
