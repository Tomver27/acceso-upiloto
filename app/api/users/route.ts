import { type NextRequest } from 'next/server'
import db from '@/lib/db'
import { handlePrismaError } from '@/lib/prisma-error'

export async function GET() {
  const users = await db.user.findMany({
    include: {
      role: true,
      career: true,
      documentType: true,
    },
  })
  return Response.json(users)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { firstName, middleName, lastName, document, code, cardUuid, idDocumentType, idRole, idCareer } = body

  if (!document || !idDocumentType || !idRole) {
    return Response.json(
      { error: 'document, idDocumentType and idRole are required' },
      { status: 400 }
    )
  }

  try {
    const user = await db.user.create({
      data: { firstName, middleName, lastName, document, code, cardUuid, idDocumentType, idRole, idCareer },
      include: {
        role: true,
        career: true,
        documentType: true,
      },
    })

    return Response.json(user, { status: 201 })
  } catch (error) {
    return handlePrismaError(error)
  }
}
