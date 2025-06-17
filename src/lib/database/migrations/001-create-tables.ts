import { SQLiteDatabase } from 'expo-sqlite'

export default {
  version: 1,
  description: 'Create initial tables for the application',
  up: async (db: SQLiteDatabase) => {

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        user_id        INTEGER PRIMARY KEY AUTOINCREMENT,
        username       TEXT    NOT NULL UNIQUE,
        hashedPassword TEXT    NOT NULL,
        created_at     DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        updated_at     DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS projects (
        project_id    INTEGER  PRIMARY KEY AUTOINCREMENT,
        name          TEXT     NOT NULL UNIQUE,
        description   TEXT     NULL,
        bg_color      TEXT     NOT NULL DEFAULT '#fff',
        created_date  DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        updated_date  DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        user_id       INTEGER  NOT NULL,
        category_id   INTEGER  NOT NULL,
        FOREIGN KEY (user_id)
          REFERENCES users (user_id)
          ON DELETE CASCADE,
        FOREIGN KEY (category_id)
          REFERENCES categories (category_id)
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS priorities (
        priority_id INTEGER PRIMARY KEY AUTOINCREMENT,
        level       TEXT    NOT NULL UNIQUE,
        color       TEXT    NOT NULL
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id   INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT    NOT NULL UNIQUE
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        task_id        INTEGER   PRIMARY KEY AUTOINCREMENT,
        title          TEXT      NOT NULL,
        description    TEXT      NULL,
        created_date   DATETIME  NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        start_date     DATETIME  NULL,
        due_date       DATETIME  NULL,
        status         TEXT      NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
        is_recurring   INTEGER   NOT NULL DEFAULT 0,
        project_id     INTEGER   NULL,
        assigned_user_id INTEGER NOT NULL,
        priority_id    INTEGER   NULL,

        FOREIGN KEY (project_id)
          REFERENCES projects (project_id)
          ON DELETE CASCADE,

        FOREIGN KEY (assigned_user_id)
          REFERENCES users (user_id)
          ON DELETE CASCADE,

        FOREIGN KEY (priority_id)
          REFERENCES priorities (priority_id)
          ON DELETE SET NULL
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS project_categories (
        project_id   INTEGER NOT NULL,
        category_id  INTEGER NOT NULL,

        PRIMARY KEY (project_id, category_id),

        FOREIGN KEY (project_id)
          REFERENCES projects (project_id)
          ON DELETE CASCADE,

        FOREIGN KEY (category_id)
          REFERENCES categories (category_id)
          ON DELETE CASCADE
      );
    `)

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS recurrences (
        recurrence_id INTEGER  PRIMARY KEY AUTOINCREMENT,
        task_id       INTEGER  NOT NULL,
        interval      INTEGER  NOT NULL CHECK (interval > 0),
        unit          TEXT     NOT NULL CHECK (unit IN ('day', 'week', 'month')),
        weekdays      TEXT     NULL,
        monthly_day   INTEGER  NULL CHECK (monthly_day > 0 AND monthly_day <= 31),

        FOREIGN KEY (task_id)
          REFERENCES tasks (task_id)
          ON DELETE CASCADE
      );
    `)
  }
}
