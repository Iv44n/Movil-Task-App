import { SQLiteDatabase } from 'expo-sqlite'

export default {
  version: 1,
  description: 'Create initial tables for the application',
  up: async (db: SQLiteDatabase) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS User (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        updated_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Project (
        project_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT NULL,
        created_date TEXT NOT NULL DEFAULT (date('now')),
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id)
          REFERENCES User (user_id)
          ON DELETE CASCADE
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Priority (
        priority_id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Tag (
        tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Task (
        task_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NULL,
        created_date TEXT NOT NULL DEFAULT (date('now')),
        start_date TEXT NULL,
        due_date TEXT NULL,
        status TEXT NOT NULL DEFAULT 'pending'
          CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
        is_recurring INTEGER NOT NULL DEFAULT 0,
        project_id INTEGER NULL,
        assigned_user_id INTEGER NOT NULL,
        priority_id INTEGER NOT NULL,

        FOREIGN KEY (project_id)
          REFERENCES Project (project_id)
          ON DELETE CASCADE,

        FOREIGN KEY (assigned_user_id)
          REFERENCES User (user_id)
          ON DELETE CASCADE,

        FOREIGN KEY (priority_id)
          REFERENCES Priority (priority_id)
          ON DELETE CASCADE
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Task_Tag (
        task_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,

        PRIMARY KEY (task_id, tag_id),

        FOREIGN KEY (task_id)
          REFERENCES Task (task_id)
          ON DELETE CASCADE,

        FOREIGN KEY (tag_id)
          REFERENCES Tag (tag_id)
          ON DELETE CASCADE
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Recurrence (
        recurrence_id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        interval INTEGER NOT NULL CHECK (interval > 0),
        unit TEXT NOT NULL CHECK (unit IN ('day', 'week', 'month')),
        weekdays TEXT NULL,
        monthly_day INTEGER NULL CHECK (monthly_day > 0 AND monthly_day <= 31),

        FOREIGN KEY (task_id)
          REFERENCES Task (task_id)
          ON DELETE CASCADE
      );
    `)
  }
}
