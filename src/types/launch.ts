export interface LaunchFormData {
  // Step 1: Sobre o Projeto
  name: string
  niche: string
  expert: string
  followers: number

  // Step 2: Meta & Orçamento
  targetTickets: number
  budget: number
  saleDays: number
  eventDate: string
  eventDuration: number
  eventPlatform: string

  // Step 3: Produto & Ofertas
  mainProduct: {
    name: string
    price: number
  }
  orderBumps: {
    gravacoes: { enabled: boolean; price: number; hasCashback: boolean; cashbackAmount: number }
    debriefing: { enabled: boolean; price: number }
    materiais: { enabled: boolean; price: number }
    combo: { enabled: boolean; price: number }
  }
  downsell: {
    enabled: boolean
    name: string
    price: number
  }
  tripwire: {
    enabled: boolean
    name: string
    price: number
  }

  // Step 4: Lotes & Escassez
  batches: BatchConfig[]

  // Step 5: Tema & Narrativa
  bigIdea: string
  narrative: string
  theme: string
}

export interface BatchConfig {
  name: string
  order: number
  price: number
  quantity: number
}

export interface LaunchMetrics {
  maxCpa: number
  dailyPacing: number
  avgTicket: number
  projectedRevenue: {
    pessimistic: number
    realistic: number
    optimistic: number
  }
  roas: {
    pessimistic: number
    realistic: number
    optimistic: number
  }
  totalTicketRevenue: number
  totalOrderBumpRevenue: number
  totalProductRevenue: number
  totalDownsellRevenue: number
  totalRevenue: number
}

export interface Alert {
  id: string
  type: 'danger' | 'warning' | 'info' | 'success'
  title: string
  message: string
  action?: string
  rule: string
}

export type LaunchPhase = 0 | 1 | 2 | 3 | 4

export const PHASE_NAMES: Record<LaunchPhase, string> = {
  0: 'Fundação',
  1: 'Pré-Lançamento',
  2: 'Lançamento',
  3: 'Evento',
  4: 'Pós-Evento',
}

export const PHASE_COLORS: Record<LaunchPhase, string> = {
  0: '#6366f1',
  1: '#8b5cf6',
  2: '#f59e0b',
  3: '#22c55e',
  4: '#ef4444',
}

export const NICHES = [
  'Marketing Digital',
  'Finanças',
  'Saúde e Bem-estar',
  'Desenvolvimento Pessoal',
  'Educação',
  'Tecnologia',
  'Emagrecimento',
  'Relacionamentos',
  'Negócios',
  'Cripto/Investimentos',
  'Beleza e Estética',
  'Fitness',
  'Culinária',
  'Idiomas',
  'Outro',
] as const

export const EVENT_PLATFORMS = [
  { value: 'zoom', label: 'Zoom' },
  { value: 'youtube', label: 'YouTube Live' },
  { value: 'presencial', label: 'Presencial' },
] as const
