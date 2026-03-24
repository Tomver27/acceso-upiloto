import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const dbUrl = `file:${path.join(process.cwd(), 'data', 'lab.db')}`

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  datasource: {
    url: dbUrl,
  },
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  migrate: {
    adapter: async () => {
      const client = createClient({ url: dbUrl })
      return new PrismaLibSQL(client)
    },
  },
})