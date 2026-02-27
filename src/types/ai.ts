export type ContentType = 'emails' | 'whatsapp' | 'instagram' | 'stories' | 'ads' | 'copy_pagina' | 'scripts'

export interface ContentTemplate {
  type: ContentType
  label: string
  description: string
  icon: string
  subtypes: { value: string; label: string; description: string }[]
}

export interface GenerateRequest {
  type: ContentType
  subtype: string
  launchContext: LaunchContext
  customInstructions?: string
}

export interface LaunchContext {
  name: string
  niche: string
  expert: string
  bigIdea: string
  narrative: string
  theme: string
  ticketPrice: number
  productName: string
  productPrice: number
  eventDate: string
  eventPlatform: string
}

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    type: 'emails', label: 'Emails', description: 'Abertura, conteúdo, prova social, virada de lote, lembretes, evento, pós-evento, urgência, encerramento', icon: 'Mail',
    subtypes: [
      { value: 'lancamento', label: 'Abertura de Vendas', description: 'Email de abertura do primeiro lote' },
      { value: 'conteudo', label: 'Conteúdo + Valor', description: 'Email de conteúdo educativo com sutileza sobre o evento' },
      { value: 'prova_social', label: 'Prova Social', description: 'Email com depoimentos e resultados de alunos' },
      { value: 'virada_lote', label: 'Virada de Lote', description: 'Email de urgência na virada de lote' },
      { value: 'lembrete', label: 'Lembretes Pré-Evento', description: 'Emails de lembrete D-7, D-3 e D-1' },
      { value: 'evento', label: 'Dia do Evento', description: 'Email da manhã do evento com link e motivação' },
      { value: 'pos_evento', label: 'Pós-Evento / Carrinho', description: 'Email de carrinho aberto para high ticket' },
      { value: 'follow_up', label: 'Follow-up', description: 'Email de follow-up D+1 com prova social' },
      { value: 'urgencia', label: 'Urgência (Últimas 24h)', description: 'Email de últimas 24h com FOMO real' },
      { value: 'encerramento', label: 'Encerramento', description: 'Email de encerramento final — últimas 2h' },
    ],
  },
  {
    type: 'whatsapp', label: 'WhatsApp', description: 'Base, conteúdo, lembretes, evento, urgência, pós-evento, follow-up, encerramento', icon: 'Phone',
    subtypes: [
      { value: 'base', label: 'Base Existente', description: 'Mensagem para lista existente sobre o evento' },
      { value: 'conteudo', label: 'Conteúdo para Base', description: 'Conteúdo relevante para quem está no grupo' },
      { value: 'urgencia', label: 'Últimas Vagas do Lote', description: 'Mensagem de urgência — últimas vagas' },
      { value: 'lembrete', label: 'Lembretes Pré-Evento', description: 'Lembretes D-7 e D-1 com link e horário' },
      { value: 'evento', label: 'Dia do Evento', description: 'Mensagem 30min antes com link' },
      { value: 'pos_evento', label: 'Pós-Evento / Oferta', description: 'Oferta com cashback para quem comprou gravações' },
      { value: 'follow_up', label: 'Follow-up', description: 'Acompanhamento pós-evento' },
      { value: 'encerramento', label: 'Encerramento', description: 'Última mensagem de encerramento das vendas' },
    ],
  },
  {
    type: 'instagram', label: 'Instagram (Feed)', description: 'Posts de abertura, conteúdo educativo, reels, encerramento', icon: 'Instagram',
    subtypes: [
      { value: 'post', label: 'Post Feed', description: 'Legenda para post no feed (abertura, amanhã, encerramento)' },
      { value: 'conteudo', label: 'Post de Valor/Desejo', description: 'Post de conteúdo que gera desejo pelo evento' },
      { value: 'reels', label: 'Reels', description: 'Roteiro curto para reels (30-60s)' },
    ],
  },
  {
    type: 'stories', label: 'Stories', description: 'Bastidores, prova social, countdown, urgência, ao vivo, oferta', icon: 'MessageSquare',
    subtypes: [
      { value: 'conteudo', label: 'Bastidores / Antecipação', description: 'Stories de bastidores e preparação do evento' },
      { value: 'social_proof', label: 'Prova Social', description: 'Stories com depoimentos, números e resultados' },
      { value: 'urgencia', label: 'Urgência', description: 'Stories de urgência — countdown virada de lote ou encerramento' },
      { value: 'countdown', label: 'Contagem Regressiva', description: 'Stories de countdown para o evento' },
      { value: 'live', label: 'Ao Vivo do Evento', description: 'Roteiro de stories ao vivo durante o evento' },
      { value: 'oferta', label: 'Oferta High Ticket', description: 'Stories de oferta pós-evento' },
    ],
  },
  {
    type: 'ads', label: 'Ads / Tráfego', description: 'Briefing de campanhas e criativos para tráfego pago', icon: 'Palette',
    subtypes: [
      { value: 'campanha', label: 'Briefing de Campanha', description: 'Briefing completo para campanha de tráfego' },
      { value: 'otimizacao', label: 'Checklist Otimização', description: 'Checklist de otimização semanal de campanhas' },
    ],
  },
  {
    type: 'copy_pagina', label: 'Copy Página de Vendas', description: 'Página completa, hook, seção de oferta', icon: 'FileText',
    subtypes: [
      { value: 'completa', label: 'Página Completa', description: 'Copy completa da página de vendas' },
      { value: 'hook', label: 'Apenas Hook', description: '5 variações de headline e sub-headline' },
      { value: 'oferta', label: 'Seção de Oferta', description: 'Apresentação da oferta com lotes e bumps' },
    ],
  },
  {
    type: 'scripts', label: 'Scripts Comerciais', description: 'Abordagem, follow-up, downsell, boleto', icon: 'MessageSquare',
    subtypes: [
      { value: 'abordagem_cashback', label: 'Abordagem Cashback', description: 'Script para oferecer cashback das gravações' },
      { value: 'follow_up', label: 'Follow-up Comercial', description: 'Script de acompanhamento pós-interesse' },
      { value: 'downsell', label: 'Downsell', description: 'Script para oferecer versão mais acessível' },
      { value: 'boleto', label: 'Recuperação Boleto', description: 'Script para recuperar boletos não pagos' },
    ],
  },
]
