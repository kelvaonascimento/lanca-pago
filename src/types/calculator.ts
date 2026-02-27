export interface ProjectionScenario {
  label: string
  multiplier: number
  tickets: number
  ticketRevenue: number
  orderBumpRevenue: number
  productRevenue: number
  downsellRevenue: number
  totalRevenue: number
  roas: number
  profit: number
}

export interface BatchCalculation {
  name: string
  order: number
  price: number
  quantity: number
  revenue: number
  percentOfTotal: number
  cumulative: number
}

export interface CpaCalculation {
  salesBudget: number
  trafficTickets: number
  maxCpa: number
  currentCpa?: number
  status: 'ok' | 'warning' | 'danger'
}

export interface PacingCalculation {
  targetTickets: number
  totalDays: number
  businessDays: number
  pacingTotal: number
  pacingBusiness: number
  currentPacing?: number
  status: 'ok' | 'warning' | 'danger'
}

export interface CashbackCalculation {
  recordingPrice: number
  productPrice: number
  withCashback: {
    effectivePrice: number
    estimatedConversion: number
    estimatedSales: number
    revenue: number
  }
  withoutCashback: {
    effectivePrice: number
    estimatedConversion: number
    estimatedSales: number
    revenue: number
  }
  uplift: number
}

export interface RoasCalculation {
  investment: number
  ticketRevenue: number
  orderBumpRevenue: number
  productRevenue: number
  downsellRevenue: number
  totalRevenue: number
  roas: number
  profit: number
  margin: number
}
