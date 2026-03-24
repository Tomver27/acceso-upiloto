import path from 'node:path'
import { PrismaClient } from './generated/prisma'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

function createPrismaClient() {
  const client = createClient({
    url: `file:${path.join(process.cwd(), 'data', 'lab.db')}`,
  })
  const adapter = new PrismaLibSQL(client)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

export default db