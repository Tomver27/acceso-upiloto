import { type NextRequest } from 'next/server'
import db from '@/lib/db'
import { handlePrismaError } from '@/lib/prisma-error'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)

  if (Number.isNaN(numId)) {
    return Response.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  const user = await db.user.findUnique({
    where: { id: numId },
    include: {
      role: true,
      career: true,
      documentType: true,
    },
  })

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json(user)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)

  if (Number.isNaN(numId)) {
    return Response.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  const body = await request.json()
  const { firstName, middleName, lastName, document, code, cardUuid, idDocumentType, idRole, idCareer } = body

  const existing = await db.user.findUnique({ where: { id: numId } })
  if (!existing) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  try {
    const user = await db.user.update({
      where: { id: numId },
      data: { firstName, middleName, lastName, document, code, cardUuid, idDocumentType, idRole, idCareer },
      include: {
        role: true,
        career: true,
        documentType: true,
      },
    })

    return Response.json(user)
  } catch (error) {
    return handlePrismaError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)

  if (Number.isNaN(numId)) {
    return Response.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  const existing = await db.user.findUnique({ where: { id: numId } })
  if (!existing) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  try {
    await db.user.delete({ where: { id: numId } })
    return new Response(null, { status: 204 })
  } catch (error) {
    return handlePrismaError(error)
  }
}
