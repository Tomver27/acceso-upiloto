import path from 'node:path'
import { PrismaClient } from './generated/prisma'
import { PrismaLibSql } from '@prisma/adapter-libsql'

function createPrismaClient() {
  const url = `file:${path.join(process.cwd(), 'data', 'lab.db')}`
  const adapter = new PrismaLibSql({ url })
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