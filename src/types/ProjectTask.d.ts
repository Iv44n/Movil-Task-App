import { Database } from '@/lib/database.types'

export type ProjectTask = Database['public']['Tables']['project_tasks']['Row']
export type InsertProjectTask = Database['public']['Tables']['project_tasks']['Insert']
export type UpdateProjectTask = Database['public']['Tables']['project_tasks']['Update']

// Omitting fields that are not needed for the form
export type InsertProjectTaskForForm = Omit<InsertProjectTask, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'project_id' | 'deleted' | 'status'>
export type UpdateProjectTaskForForm =  Omit<UpdateProjectTask, 'updated_at' | 'deleted' | 'user_id' | 'project_id' | 'id' | 'created_at'>
