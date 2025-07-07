import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase'
import { configureSynced } from '@legendapp/state/sync'
import { supabase } from './supabase'
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'

export const globalSync = configureSynced(syncedSupabase, {
  supabase,
  generateId: () => randomUUID(),
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  fieldDeleted: 'deleted',
  persist: {
    plugin: observablePersistAsyncStorage({ AsyncStorage }),
    retrySync: true
  }
})
