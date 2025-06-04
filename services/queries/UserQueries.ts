const TABLE = 'users'

const COL = {
  id: 'user_id',
  name: 'name',
  password: 'password',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
} as const

const RETURNING = `${COL.id}, ${COL.name}, ${COL.createdAt}, ${COL.updatedAt}` as const

export const userQueries = {
  insertUser: `
    INSERT INTO ${TABLE} (${COL.name}, ${COL.password})
    VALUES (?, ?)
    RETURNING ${RETURNING};
  `,
  getUserByName: `
    SELECT ${RETURNING}
    FROM ${TABLE}
    WHERE ${COL.name} = ?
  `,
  deleteUserById: `
    DELETE FROM ${TABLE}
    WHERE ${COL.id} = ?
  `
} as const

export function buildUpdateUserQuery(
  userId: number,
  fields: Partial<{ name: string; password: string }>
): { text: string; values: any[] } {

  const setClauses: string[] = []
  const values = []

  if (Object.keys(fields).length === 0) {
    throw new Error('No fields provided for update')
  }

  if (fields.name != null) {
    setClauses.push(`${COL.name} = ?`)
    values.push(fields.name)
  }
  if (fields.password != null) {
    setClauses.push(`${COL.password} = ?`)
    values.push(fields.password)
  }

  setClauses.push(`${COL.updatedAt} = CURRENT_TIMESTAMP`)

  const text = `
    UPDATE ${TABLE}
    SET ${setClauses.join(', ')}
    WHERE ${COL.id} = ?
    RETURNING ${RETURNING};
  `
  values.push(userId)

  return {
    text,
    values
  }
}
