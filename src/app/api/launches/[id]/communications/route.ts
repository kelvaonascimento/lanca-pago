import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subDays, addDays } from 'date-fns'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const comms = await prisma.communication.findMany({
    where: { launchId: id },
    orderBy: [{ day: 'asc' }],
    include: {
      approvedContent: {
        select: { id: true, type: true, subtype: true, content: true, createdAt: true },
      },
    },
  })
  return NextResponse.json(comms)
}

// Initialize 44 days of communications for a launch
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Check if already initialized
  const count = await prisma.communication.count({ where: { launchId: id } })
  if (count > 0) {
    return NextResponse.json({ message: 'Already initialized', count })
  }

  const launch = await prisma.launch.findUnique({ where: { id } })
  if (!launch) return NextResponse.json({ error: 'Launch not found' }, { status: 404 })

  const eventDate = launch.eventDate
  const startDate = subDays(eventDate, 43)

  const communications: Array<{
    launchId: string; day: number; date: Date; channel: string; type: string; title: string; status: string
  }> = []

  for (let i = 0; i <= 43; i++) {
    const day = i + 1
    const date = addDays(startDate, i)

    const actions = getCommunicationActions(day)
    for (const action of actions) {
      communications.push({
        launchId: id,
        day,
        date,
        channel: action.channel,
        type: action.type,
        title: action.title,
        status: 'pending',
      })
    }
  }

  await prisma.communication.createMany({ data: communications })

  return NextResponse.json({ created: communications.length })
}

export async function PATCH(request: Request) {
  const { communicationId, status, approvedContentId } = await request.json()

  const data: Record<string, unknown> = {}
  if (status) data.status = status
  if (approvedContentId !== undefined) data.approvedContentId = approvedContentId

  await prisma.communication.update({
    where: { id: communicationId },
    data,
  })

  return NextResponse.json({ success: true })
}

function getCommunicationActions(day: number): Array<{ channel: string; type: string; title: string }> {
  const actions: Array<{ channel: string; type: string; title: string }> = []

  // Phase: Pré-Lançamento (Days 1-10)
  if (day === 1) {
    actions.push({ channel: 'email', type: 'lancamento', title: 'Email de abertura de vendas' })
    actions.push({ channel: 'instagram', type: 'post', title: 'Post de abertura no feed' })
    actions.push({ channel: 'ads', type: 'campanha', title: 'Ativar campanhas de tráfego' })
    actions.push({ channel: 'stories', type: 'conteudo', title: 'Stories de bastidores' })
  }
  if (day === 3) {
    actions.push({ channel: 'stories', type: 'social_proof', title: 'Stories prova social primeiras vendas' })
    actions.push({ channel: 'whatsapp', type: 'base', title: 'WhatsApp para base existente' })
  }
  if (day === 5) {
    actions.push({ channel: 'email', type: 'conteudo', title: 'Email de conteúdo + valor' })
    actions.push({ channel: 'instagram', type: 'post', title: 'Post de conteúdo educativo' })
  }
  if (day === 7) {
    actions.push({ channel: 'email', type: 'prova_social', title: 'Email prova social + depoimentos' })
    actions.push({ channel: 'stories', type: 'conteudo', title: 'Stories bastidores e preparação' })
    actions.push({ channel: 'ads', type: 'otimizacao', title: 'Otimizar campanhas (1a semana)' })
  }

  // Phase: Vendas Ativas (Days 11-35)
  if ([11, 14, 18, 22, 26, 30, 34].includes(day)) {
    actions.push({ channel: 'email', type: 'virada_lote', title: `Email virada de lote (Dia ${day})` })
    actions.push({ channel: 'whatsapp', type: 'urgencia', title: `WhatsApp últimas vagas do lote` })
    actions.push({ channel: 'stories', type: 'urgencia', title: 'Stories countdown virada de lote' })
  }
  if (day >= 11 && day <= 35 && day % 3 === 0 && ![14, 22, 30].includes(day)) {
    actions.push({ channel: 'instagram', type: 'conteudo', title: 'Post de valor/desejo' })
  }
  if (day >= 11 && day <= 35 && day % 4 === 0) {
    actions.push({ channel: 'email', type: 'conteudo', title: 'Email conteúdo/prova social' })
  }
  if (day >= 11 && day <= 35 && day % 5 === 0) {
    actions.push({ channel: 'whatsapp', type: 'conteudo', title: 'WhatsApp conteúdo para base' })
  }
  if (day >= 11 && day <= 35 && day % 2 === 0) {
    actions.push({ channel: 'stories', type: 'social_proof', title: 'Stories prova social/bastidores' })
  }
  if ([14, 21, 28, 35].includes(day)) {
    actions.push({ channel: 'ads', type: 'otimizacao', title: 'Otimizar campanhas (semanal)' })
  }
  if ([15, 25].includes(day)) {
    actions.push({ channel: 'instagram', type: 'reels', title: 'Reels depoimento/resultado' })
  }

  // Phase: Pré-Evento (Days 36-40)
  if (day === 36) {
    actions.push({ channel: 'email', type: 'lembrete', title: 'Email lembrete D-7' })
    actions.push({ channel: 'whatsapp', type: 'lembrete', title: 'WhatsApp lembrete D-7 + cronograma' })
  }
  if (day === 38) {
    actions.push({ channel: 'email', type: 'lembrete', title: 'Email lembrete D-3' })
    actions.push({ channel: 'stories', type: 'countdown', title: 'Stories contagem regressiva' })
  }
  if (day === 39) {
    actions.push({ channel: 'email', type: 'lembrete', title: 'Email D-1: Amanhã é o dia!' })
    actions.push({ channel: 'whatsapp', type: 'lembrete', title: 'WhatsApp D-1 com link e horário' })
    actions.push({ channel: 'stories', type: 'countdown', title: 'Stories countdown final' })
    actions.push({ channel: 'instagram', type: 'post', title: 'Post "Amanhã" no feed' })
  }
  if (day === 40) {
    actions.push({ channel: 'email', type: 'evento', title: 'Email manhã do evento + link' })
    actions.push({ channel: 'whatsapp', type: 'evento', title: 'WhatsApp 30min antes com link' })
    actions.push({ channel: 'stories', type: 'live', title: 'Stories ao vivo do evento' })
  }

  // Phase: Evento + Pós (Days 41-44)
  if (day === 41) {
    actions.push({ channel: 'email', type: 'pos_evento', title: 'Email carrinho aberto — high ticket' })
    actions.push({ channel: 'whatsapp', type: 'pos_evento', title: 'WhatsApp oferta + cashback' })
    actions.push({ channel: 'stories', type: 'oferta', title: 'Stories oferta high ticket' })
  }
  if (day === 42) {
    actions.push({ channel: 'email', type: 'follow_up', title: 'Email follow-up D+1 — prova social' })
    actions.push({ channel: 'whatsapp', type: 'follow_up', title: 'WhatsApp follow-up' })
  }
  if (day === 43) {
    actions.push({ channel: 'email', type: 'urgencia', title: 'Email últimas 24h' })
    actions.push({ channel: 'whatsapp', type: 'urgencia', title: 'WhatsApp última chance' })
    actions.push({ channel: 'stories', type: 'urgencia', title: 'Stories urgência encerramento' })
  }
  if (day === 44) {
    actions.push({ channel: 'email', type: 'encerramento', title: 'Email encerramento final' })
    actions.push({ channel: 'whatsapp', type: 'encerramento', title: 'WhatsApp encerramento' })
    actions.push({ channel: 'instagram', type: 'post', title: 'Post encerramento/agradecimento' })
  }

  return actions
}
