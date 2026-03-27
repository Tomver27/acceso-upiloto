import { type NextRequest } from 'next/server'
import db from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const user = await db.user.findUnique({
    where: { id: Number(id) },
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
  const body = await request.json()
  const { document, code, cardUuid, idDocumentType, idRole, idCareer } = body

  const existing = await db.user.findUnique({ where: { id: Number(id) } })
  if (!existing) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  const user = await db.user.update({
    where: { id: Number(id) },
    data: { document, code, cardUuid, idDocumentType, idRole, idCareer },
    include: {
      role: true,
      career: true,
      documentType: true,
    },
  })

  return Response.json(user)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const existing = await db.user.findUnique({ where: { id: Number(id) } })
  if (!existing) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  await db.user.delete({ where: { id: Number(id) } })

  return new Response(null, { status: 204 })
}
