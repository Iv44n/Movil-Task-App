import { Database } from '@/lib/database.types'

export type Project = Database['public']['Tables']['projects']['Row']
export type InsertProject = Database['public']['Tables']['projects']['Insert']
export type UpdateProject = Database['public']['Tables']['projects']['Update']

// Omitting fields that are not needed for the form
export type InsertProjectForForm = Omit<InsertProject, 'id' | 'created_at' | 'updated_at' | 'task_count' | 'deleted'>
export type UpdateProjectForForm = Omit<UpdateProject, 'user_id' | 'id' | 'created_at' | 'updated_at' | 'deleted'>
