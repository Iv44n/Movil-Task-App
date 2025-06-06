const TABLE = 'projects'

const COL = {
  id: 'project_id',
  name: 'name',
  description: 'description',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  userId: 'user_id'
} as const

const RETURNING = `${COL.id}, ${COL.name}, ${COL.description}, ${COL.createdAt}, ${COL.updatedAt}` as const

export const projectQueries = {
  insertProject: `
    INSERT INTO ${TABLE} (${COL.name}, ${COL.description}, ${COL.userId})
    VALUES (?, ?, ?)
    RETURNING ${RETURNING};
  `,
  getProjectById: `
    SELECT ${RETURNING}
    FROM ${TABLE}
    WHERE ${COL.id} = ?;
  `,
  getUserProjects: `
    SELECT ${RETURNING}
    FROM ${TABLE}
    WHERE ${COL.userId} = ?
    ORDER BY ${COL.createdAt} DESC;
  `,
  deleteProjectById: `
    DELETE FROM ${TABLE}
    WHERE ${COL.id} = ?;
  `
}

export function buildUpdateProjectQuery(
  projectId: number,
  fields: Partial<{ name: string; description: string }>
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
  if (fields.description != null) {
    setClauses.push(`${COL.description} = ?`)
    values.push(fields.description)
  }

  setClauses.push(`${COL.updatedAt} = CURRENT_TIMESTAMP`)

  const text = `
    UPDATE ${TABLE}
    SET ${setClauses.join(', ')}
    WHERE ${COL.id} = ?
    RETURNING ${RETURNING};
  `
  values.push(projectId)

  return {
    text,
    values
  }
}
