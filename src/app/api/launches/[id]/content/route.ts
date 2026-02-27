import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contents = await prisma.generatedContent.findMany({
    where: { launchId: id },
    orderBy: { createdAt: 'desc' },
    include: { communication: { select: { id: true, day: true, channel: true, title: true } } },
  })
  return NextResponse.json(contents)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { contentId, communicationId, isApproved } = await request.json()

  // If approving and linking to a communication
  if (communicationId && isApproved) {
    // Unapprove any previous content for this communication
    const existing = await prisma.communication.findUnique({
      where: { id: communicationId },
      select: { approvedContentId: true },
    })
    if (existing?.approvedContentId) {
      await prisma.generatedContent.update({
        where: { id: existing.approvedContentId },
        data: { isApproved: false },
      })
    }

    // Approve this content and link it
    await prisma.generatedContent.update({
      where: { id: contentId },
      data: { isApproved: true },
    })
    await prisma.communication.update({
      where: { id: communicationId },
      data: {
        approvedContentId: contentId,
        content: (await prisma.generatedContent.findUnique({ where: { id: contentId } }))?.content || '',
      },
    })
  } else if (isApproved === false) {
    // Unapprove
    await prisma.generatedContent.update({
      where: { id: contentId },
      data: { isApproved: false },
    })
    // Remove link from communication if exists
    await prisma.communication.updateMany({
      where: { approvedContentId: contentId },
      data: { approvedContentId: null, content: '' },
    })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { contentId } = await request.json()
  await prisma.generatedContent.delete({ where: { id: contentId } })
  return NextResponse.json({ success: true })
}
