import { Prisma } from '@/lib/generated/prisma'

const fieldLabels: Record<string, string> = {
  card_uuid: 'tarjeta (UUID)',
  document: 'documento',
  code: 'código',
  first_name: 'nombre',
  middle_name: 'segundo nombre',
  last_name: 'apellido',
}

function extractFields(message: string): string | null {
  const match = message.match(/fields:\s*\((.+?)\)/)
  if (!match) return null
  return match[1]
    .split(',')
    .map((f) => f.trim().replace(/`/g, ''))
    .map((f) => fieldLabels[f] ?? f)
    .join(', ')
}

export function handlePrismaError(error: unknown): Response {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const fields = extractFields(error.message)
        return Response.json(
          { error: fields
              ? `Ya existe un registro con ese valor de ${fields}`
              : 'Ya existe un registro con ese valor' },
          { status: 409 }
        )
      }
      case 'P2003':
        return Response.json(
          { error: 'Referencia inválida: una de las relaciones indicadas no existe' },
          { status: 400 }
        )
      case 'P2025':
        return Response.json(
          { error: 'El registro no fue encontrado' },
          { status: 404 }
        )
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return Response.json(
      { error: 'Datos inválidos: verifica los campos enviados' },
      { status: 400 }
    )
  }

  return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
}
