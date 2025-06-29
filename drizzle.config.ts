import type { Config } from 'drizzle-kit'

export default {
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/lib/db/schemas',
  out: './src/drizzle',
  casing: 'snake_case'
} satisfies Config
