import type { Config } from 'drizzle-kit'

export default {
  schema: './src/schema.ts',
  out: './db/drizzle',
} satisfies Config
