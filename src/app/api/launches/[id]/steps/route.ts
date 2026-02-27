import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { steps } = await request.json()

  // Prevent duplicate initialization
  const existing = await prisma.launchStep.count({ where: { launchId: id } })
  if (existing > 0) {
    return NextResponse.json({ message: 'Already initialized', count: existing })
  }

  for (const step of steps) {
    await prisma.launchStep.create({
      data: {
        launchId: id,
        stepKey: step.key,
        phase: step.phase,
        order: step.order,
        items: {
          create: step.items.map((item: string, idx: number) => ({
            label: item,
            order: idx,
          })),
        },
      },
    })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}

export async function PATCH(request: Request) {
  const { stepId, status, itemId, completed } = await request.json()

  if (itemId !== undefined) {
    await prisma.stepItem.update({
      where: { id: itemId },
      data: { completed },
    })
  } else if (stepId) {
    await prisma.launchStep.update({
      where: { id: stepId },
      data: {
        status,
        completedAt: status === 'completed' ? new Date() : null,
      },
    })
  }

  return NextResponse.json({ success: true })
}
