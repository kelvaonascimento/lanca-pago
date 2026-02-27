import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateMaxCpa, calculatePacing } from '@/lib/formulas'
import type { LaunchFormData } from '@/types/launch'

export async function GET() {
  const launches = await prisma.launch.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      ticketBatches: true,
      products: true,
      orderBumps: true,
    },
  })
  return NextResponse.json(launches)
}

export async function POST(request: Request) {
  const body: LaunchFormData = await request.json()

  const trafficTickets = Math.round(body.targetTickets * 0.7)
  const cpa = calculateMaxCpa(body.budget, trafficTickets)
  const pacing = calculatePacing(body.targetTickets, body.saleDays)

  const launch = await prisma.launch.create({
    data: {
      name: body.name,
      niche: body.niche,
      expert: body.expert,
      followers: body.followers,
      targetTickets: body.targetTickets,
      budget: body.budget,
      saleDays: body.saleDays,
      eventDate: new Date(body.eventDate),
      eventDuration: body.eventDuration,
      eventPlatform: body.eventPlatform,
      bigIdea: body.bigIdea,
      narrative: body.narrative,
      theme: body.theme,
      maxCpa: cpa.maxCpa,
      dailyPacing: pacing.pacingTotal,
      status: 'active',

      // Ticket batches
      ticketBatches: {
        create: body.batches.map((b) => ({
          name: b.name,
          order: b.order,
          price: b.price,
          quantity: b.quantity,
          status: b.order === 1 ? 'active' : 'upcoming',
        })),
      },

      // Product
      products: {
        create: [
          { type: 'main', name: body.mainProduct.name, price: body.mainProduct.price },
          ...(body.downsell.enabled
            ? [{ type: 'downsell', name: body.downsell.name, price: body.downsell.price }]
            : []),
          ...(body.tripwire.enabled
            ? [{ type: 'tripwire', name: body.tripwire.name, price: body.tripwire.price }]
            : []),
        ],
      },

      // Order bumps
      orderBumps: {
        create: [
          ...(body.orderBumps.gravacoes.enabled
            ? [{
                name: 'gravacoes',
                label: 'Acesso em Formato de Aulas',
                price: body.orderBumps.gravacoes.price,
                hasCashback: body.orderBumps.gravacoes.hasCashback,
                cashbackAmount: body.orderBumps.gravacoes.hasCashback ? body.orderBumps.gravacoes.price : 0,
              }]
            : []),
          ...(body.orderBumps.debriefing.enabled
            ? [{
                name: 'debriefing',
                label: 'Debriefing Exclusivo',
                price: body.orderBumps.debriefing.price,
                hasCashback: false,
                cashbackAmount: 0,
              }]
            : []),
          ...(body.orderBumps.materiais.enabled
            ? [{
                name: 'materiais',
                label: 'Kit de Materiais',
                price: body.orderBumps.materiais.price,
                hasCashback: false,
                cashbackAmount: 0,
              }]
            : []),
          ...(body.orderBumps.combo.enabled
            ? [{
                name: 'combo',
                label: 'Combo Completo',
                price: body.orderBumps.combo.price,
                hasCashback: false,
                cashbackAmount: 0,
              }]
            : []),
        ],
      },
    },
  })

  return NextResponse.json({ id: launch.id }, { status: 201 })
}
