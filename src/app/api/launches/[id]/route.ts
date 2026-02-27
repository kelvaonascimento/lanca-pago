import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const launch = await prisma.launch.findUnique({
    where: { id },
    include: {
      ticketBatches: { orderBy: { order: 'asc' } },
      products: true,
      orderBumps: true,
      steps: { include: { items: { orderBy: { order: 'asc' } } }, orderBy: [{ phase: 'asc' }, { order: 'asc' }] },
      communications: { orderBy: { day: 'asc' } },
      dailyMetrics: { orderBy: { day: 'asc' } },
    },
  })

  if (!launch) return NextResponse.json({ error: 'Lançamento não encontrado' }, { status: 404 })
  return NextResponse.json(launch)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  const launch = await prisma.launch.update({
    where: { id },
    data: body,
  })

  return NextResponse.json(launch)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.launch.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
