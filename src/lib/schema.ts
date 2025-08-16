import { appSchema, tableSchema } from '@nozbe/watermelondb'

export enum TABLE_NAMES {
  USERS = 'users',
  CATEGORIES = 'categories',
  PROJECTS = 'projects',
  TASKS = 'tasks',
  SUBTASKS = 'subtasks'
}

export default appSchema({
  version: 1,
  tables: [
    // =========================
    // Usuarios
    // =========================
    tableSchema({
      name: TABLE_NAMES.USERS,
      columns: [
        { name: 'first_name', type: 'string' },
        { name: 'last_name', type: 'string' },
        { name: 'email', type: 'string', isIndexed: true },
        { name: 'profile_image_url', type: 'string', isOptional: true }, // URL en la nube
        { name: 'profile_image_local_path', type: 'string', isOptional: true }, // Ruta en almacenamiento local
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),

    // =========================
    // Categorias
    // =========================
    tableSchema({
      name: TABLE_NAMES.CATEGORIES,
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),

    // =========================
    // Proyectos
    // =========================
    tableSchema({
      name: TABLE_NAMES.PROJECTS,
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true }, // user_id del creador
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'color', type: 'string' },
        { name: 'category_id', type: 'string' },
        { name: 'task_count', type: 'number' },
        { name: 'completed_task_count', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),

    // =========================
    // Tareas
    // =========================
    tableSchema({
      name: TABLE_NAMES.TASKS,
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true }, // user_id del creador
        { name: 'project_id', type: 'string', isIndexed: true }, // Relación con projects
        { name: 'title', type: 'string' },
        { name: 'status', type: 'string' }, // 'pending' 'in_progress' 'completed'
        { name: 'priority', type: 'string' },
        { name: 'start_date', type: 'number', isOptional: true },
        { name: 'due_date', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    }),

    // =========================
    // Subtareas
    // =========================
    tableSchema({
      name: TABLE_NAMES.SUBTASKS,
      columns: [
        { name: 'task_id', type: 'string', isIndexed: true }, // Relación con tasks
        { name: 'text', type: 'string' },
        { name: 'completed', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    })
  ]
})
