import { PrismaClient } from '../lib/generated/prisma/index.js'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const dbPath     = path.resolve(__dirname, '..', 'data', 'lab.db')

console.log('Conectando a:', dbPath)

const adapter = new PrismaBetterSqlite3({ url: dbPath })
const db      = new PrismaClient({ adapter })

async function main() {
  for (const data of [
    { name: 'admin',        description: 'Administrador del sistema' },
    { name: 'programador', description: 'Programador con acceso completo' },
    { name: 'estudiante',   description: 'Estudiante con acceso restringido' },
  ]) {
    await db.role.upsert({ where: { name: data.name }, update: {}, create: data })
  }

  for (const data of [
    { description: 'Acceso concedido' },
    { description: 'UUID no registrado' },
    { description: 'Usuario inactivo' },
    { description: 'Fuera de horario permitido' },
    { description: 'Sin permiso para este laboratorio' },
  ]) {
    await db.reason.upsert({ where: { description: data.description }, update: {}, create: data })
  }

  for (const data of [
    { name: 'Cédula de ciudadanía', nameNormalized: 'CC' },
    { name: 'Tarjeta de identidad', nameNormalized: 'TI' },
    { name: 'Pasaporte',            nameNormalized: 'PA' },
  ]) {
    await db.documentType.upsert({ where: { nameNormalized: data.nameNormalized }, update: {}, create: data })
  }


  await db.lab.upsert({
    where:  { id: 1 },
    update: {},
    create: { name: 'Laboratorio Semillero', location: 'Sede F - Salón - 102' },
  })

  for (const data of [
    { name : 'Ingeniería de Sistemas'},
    { name : 'Ingeniería Mecatrónica'},
    { name : 'Ingeniería de Telecomunicaciones'},
  ]) {
    await db.career.upsert({ where: { name: data.name }, update: {}, create: data })
  }

  console.log('Seeds ejecutados correctamente')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
