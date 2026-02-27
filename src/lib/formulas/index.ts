import type { BatchConfig } from '@/types/launch'
import type { ProjectionScenario, BatchCalculation, CpaCalculation, PacingCalculation, CashbackCalculation, RoasCalculation } from '@/types/calculator'

export function calculateMaxCpa(salesBudget: number, trafficTickets: number): CpaCalculation {
  const maxCpa = trafficTickets > 0 ? salesBudget / trafficTickets : 0
  return { salesBudget, trafficTickets, maxCpa, status: 'ok' }
}

export function calculatePacing(targetTickets: number, totalDays: number): PacingCalculation {
  const businessDays = Math.ceil(totalDays * (5 / 7))
  return {
    targetTickets,
    totalDays,
    businessDays,
    pacingTotal: totalDays > 0 ? Math.ceil(targetTickets / totalDays) : 0,
    pacingBusiness: businessDays > 0 ? Math.ceil(targetTickets / businessDays) : 0,
    status: 'ok',
  }
}

export function calculateAvgTicket(batches: BatchConfig[]): number {
  const totalRevenue = batches.reduce((sum, b) => sum + b.price * b.quantity, 0)
  const totalQuantity = batches.reduce((sum, b) => sum + b.quantity, 0)
  return totalQuantity > 0 ? totalRevenue / totalQuantity : 0
}

export function calculateBatches(batches: BatchConfig[]): BatchCalculation[] {
  const totalRevenue = batches.reduce((sum, b) => sum + b.price * b.quantity, 0)
  let cumulative = 0
  return batches.map((b) => {
    const revenue = b.price * b.quantity
    cumulative += revenue
    return {
      name: b.name, order: b.order, price: b.price, quantity: b.quantity,
      revenue, percentOfTotal: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0, cumulative,
    }
  })
}

export function generateBatches(basePrice: number, totalTickets: number, batchCount: number = 7): BatchConfig[] {
  const batches: BatchConfig[] = []
  const increment = basePrice * 0.15
  const ticketsPerBatch = Math.ceil(totalTickets / batchCount)
  for (let i = 0; i < batchCount; i++) {
    const isFirst = i === 0
    const isLast = i === batchCount - 1
    const qty = isFirst ? Math.ceil(ticketsPerBatch * 0.5) : isLast ? Math.ceil(ticketsPerBatch * 1.5) : ticketsPerBatch
    batches.push({ name: `Lote ${i + 1}`, order: i + 1, price: Math.round(basePrice + increment * i), quantity: qty })
  }
  return batches
}

export function calculateProjection(
  targetTickets: number, avgTicket: number, budget: number,
  orderBumpRate = 0.25, avgOrderBumpPrice = 197,
  productConversion = 0.25, productPrice = 997,
  downsellConversion = 0.10, downsellPrice = 497,
): ProjectionScenario[] {
  return [
    { label: 'Pessimista', multiplier: 0.7 },
    { label: 'Realista', multiplier: 1.0 },
    { label: 'Otimista', multiplier: 1.3 },
  ].map(({ label, multiplier }) => {
    const tickets = Math.round(targetTickets * multiplier)
    const ticketRevenue = tickets * avgTicket
    const orderBumpRevenue = Math.round(tickets * orderBumpRate) * avgOrderBumpPrice
    const eventAttendees = Math.round(tickets * 0.65)
    const productRevenue = Math.round(eventAttendees * productConversion) * productPrice
    const downsellRevenue = Math.round(eventAttendees * (1 - productConversion) * downsellConversion) * downsellPrice
    const totalRevenue = ticketRevenue + orderBumpRevenue + productRevenue + downsellRevenue
    return {
      label, multiplier, tickets, ticketRevenue, orderBumpRevenue, productRevenue,
      downsellRevenue, totalRevenue, roas: budget > 0 ? totalRevenue / budget : 0, profit: totalRevenue - budget,
    }
  })
}

export function calculateCashback(recordingPrice: number, productPrice: number, tickets = 1000, baseConversion = 0.25): CashbackCalculation {
  const cashbackConversion = baseConversion * 1.35
  const attendees = Math.round(tickets * 0.65)
  return {
    recordingPrice, productPrice,
    withCashback: {
      effectivePrice: productPrice - recordingPrice,
      estimatedConversion: cashbackConversion * 100,
      estimatedSales: Math.round(attendees * cashbackConversion),
      revenue: Math.round(attendees * cashbackConversion) * (productPrice - recordingPrice) + attendees * recordingPrice,
    },
    withoutCashback: {
      effectivePrice: productPrice,
      estimatedConversion: baseConversion * 100,
      estimatedSales: Math.round(attendees * baseConversion),
      revenue: Math.round(attendees * baseConversion) * productPrice,
    },
    uplift: ((cashbackConversion - baseConversion) / baseConversion) * 100,
  }
}

export function calculateRoas(investment: number, ticketRevenue: number, orderBumpRevenue: number, productRevenue: number, downsellRevenue: number): RoasCalculation {
  const totalRevenue = ticketRevenue + orderBumpRevenue + productRevenue + downsellRevenue
  const profit = totalRevenue - investment
  return {
    investment, ticketRevenue, orderBumpRevenue, productRevenue, downsellRevenue,
    totalRevenue, roas: investment > 0 ? totalRevenue / investment : 0, profit,
    margin: totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0,
  }
}
