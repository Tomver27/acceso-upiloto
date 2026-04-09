import { type NextRequest } from 'next/server'
import db from '@/lib/db'
import { handlePrismaError } from '@/lib/prisma-error'

const REASON_GRANTED = 'Acceso concedido'
const REASON_UUID_NOT_FOUND = 'UUID no registrado'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { cardUuid, idLab } = body

  if (!cardUuid || !idLab) {
    return Response.json(
      { error: 'cardUuid e idLab son requeridos' },
      { status: 400 }
    )
  }

  const lab = await db.lab.findUnique({ where: { id: idLab } })
  if (!lab) {
    return Response.json(
      { error: 'Laboratorio no encontrado' },
      { status: 404 }
    )
  }

  const user = await db.user.findUnique({ where: { cardUuid } })

  const granted = !!user
  const reasonDesc = granted ? REASON_GRANTED : REASON_UUID_NOT_FOUND

  const reason = await db.reason.findUnique({
    where: { description: reasonDesc },
  })

  if (!reason) {
    return Response.json(
      { error: `Razón "${reasonDesc}" no encontrada en la BD` },
      { status: 500 }
    )
  }

  try {
    const entry = await db.entry.create({
      data: {
        cardUuid,
        granted,
        startDate: new Date(),
        idUser: user?.id ?? null,
        idLab,
        idReason: reason.id,
      },
    })

    return Response.json({
      granted,
      reason: reasonDesc,
      entryId: entry.id,
      user: user
        ? { id: user.id, firstName: user.firstName, lastName: user.lastName, document: user.document }
        : null,
    })
  } catch (error) {
    return handlePrismaError(error)
  }
}
