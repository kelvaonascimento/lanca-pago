'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import {
  Calendar, Mail, Phone, MessageSquare, Megaphone, Image, Loader2,
  CheckCircle2, Circle, Filter, ChevronDown, ChevronRight, FileText, Sparkles,
  ThumbsUp, ThumbsDown, Eye, EyeOff,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, addDays, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

/* ── Types ─────────────────────────────────────────────── */

interface CommunicationAction {
  channel: string
  type: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

interface CommunicationDay {
  day: number
  date: Date
  label: string
  phase: string
  actions: CommunicationAction[]
}

interface DbComm {
  id: string
  day: number
  channel: string
  type: string
  title: string
  content: string
  status: string
  approvedContentId: string | null
  approvedContent: { id: string; type: string; subtype: string; content: string; createdAt: string } | null
}

/* ── Constants ─────────────────────────────────────────── */

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  whatsapp: Phone,
  instagram: Image,
  stories: MessageSquare,
  ads: Megaphone,
}

const CHANNEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  email: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  whatsapp: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  instagram: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  stories: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  ads: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
}

/** Actions that are tasks/checklists — no AI content needed */
const TASK_TYPES = new Set([
  'campanha',     // Ativar campanhas
  'otimizacao',   // Otimizar campanhas
  'live',         // Stories ao vivo
  'countdown',    // Stories countdown
])

function isTaskAction(action: CommunicationAction): boolean {
  return TASK_TYPES.has(action.type)
}

/* ── Static calendar generator ────── */

function generateCommunicationCalendar(eventDate: Date): CommunicationDay[] {
  const startDate = subDays(eventDate, 43)
  const days: CommunicationDay[] = []

  for (let i = 0; i <= 43; i++) {
    const day = i + 1
    const date = addDays(startDate, i)
    const actions: CommunicationAction[] = []
    let phase = ''
    let label = ''

    if (day <= 10) {
      phase = 'Pré-Lançamento'
      label = `Preparação D-${44 - day}`

      if (day === 1) {
        actions.push({ channel: 'email', type: 'lancamento', title: 'Email de abertura de vendas', description: 'Anunciar abertura do primeiro lote', priority: 'high' })
        actions.push({ channel: 'instagram', type: 'post', title: 'Post de abertura', description: 'Anúncio oficial do evento no feed', priority: 'high' })
        actions.push({ channel: 'ads', type: 'campanha', title: 'Ativar campanhas de tráfego', description: 'Ligar todas as campanhas configuradas', priority: 'high' })
      }
      if (day <= 3) {
        actions.push({ channel: 'stories', type: 'conteudo', title: 'Stories de bastidores', description: 'Mostrar preparação do evento', priority: 'medium' })
      }
      if (day === 3) {
        actions.push({ channel: 'stories', type: 'social_proof', title: 'Stories prova social primeiras vendas', description: 'Compartilhar primeiros depoimentos e vendas', priority: 'medium' })
        actions.push({ channel: 'whatsapp', type: 'base', title: 'WhatsApp para base existente', description: 'Mensagem para lista existente sobre o evento', priority: 'medium' })
      }
      if (day === 5) {
        actions.push({ channel: 'email', type: 'conteudo', title: 'Email de conteúdo + valor', description: 'Valor + sutileza sobre o evento', priority: 'medium' })
        actions.push({ channel: 'instagram', type: 'post', title: 'Post de conteúdo educativo', description: 'Conteúdo de valor relacionado ao evento', priority: 'medium' })
      }
      if (day === 7) {
        actions.push({ channel: 'email', type: 'prova_social', title: 'Email prova social + depoimentos', description: 'Email com resultados e depoimentos de alunos', priority: 'medium' })
        actions.push({ channel: 'stories', type: 'conteudo', title: 'Stories bastidores e preparação', description: 'Bastidores da preparação do evento', priority: 'medium' })
        actions.push({ channel: 'ads', type: 'otimizacao', title: 'Otimizar campanhas (1a semana)', description: 'Pausar criativos ruins, escalar os que convertem', priority: 'medium' })
      }
    } else if (day <= 35) {
      phase = 'Vendas Ativas'
      label = `Vendas D-${44 - day}`

      if ([11, 14, 18, 22, 26, 30, 34].includes(day)) {
        actions.push({ channel: 'email', type: 'virada_lote', title: `Email virada de lote (Dia ${day})`, description: 'Aviso de que lote atual está encerrando', priority: 'high' })
        actions.push({ channel: 'whatsapp', type: 'urgencia', title: 'WhatsApp últimas vagas do lote', description: 'Últimas vagas do lote atual', priority: 'high' })
        actions.push({ channel: 'stories', type: 'urgencia', title: 'Stories countdown virada de lote', description: 'Contagem regressiva para virada', priority: 'high' })
      }
      if (day % 3 === 0 && ![14, 22, 30].includes(day)) {
        actions.push({ channel: 'instagram', type: 'conteudo', title: 'Post de valor/desejo', description: 'Conteúdo que gera desejo pelo evento', priority: 'medium' })
      }
      if (day % 4 === 0) {
        actions.push({ channel: 'email', type: 'conteudo', title: 'Email conteúdo/prova social', description: 'Alternância entre valor e prova social', priority: 'medium' })
      }
      if (day % 5 === 0) {
        actions.push({ channel: 'whatsapp', type: 'conteudo', title: 'WhatsApp conteúdo para base', description: 'Conteúdo relevante para quem está no grupo', priority: 'medium' })
      }
      if (day % 2 === 0) {
        actions.push({ channel: 'stories', type: 'social_proof', title: 'Stories prova social/bastidores', description: 'Depoimentos, números de vendas, bastidores', priority: 'medium' })
      }
      if ([14, 21, 28, 35].includes(day)) {
        actions.push({ channel: 'ads', type: 'otimizacao', title: 'Otimizar campanhas (semanal)', description: 'Pausar criativos ruins, escalar bons', priority: 'medium' })
      }
      if ([15, 25].includes(day)) {
        actions.push({ channel: 'instagram', type: 'reels', title: 'Reels depoimento/resultado', description: 'Reels curto com prova social', priority: 'medium' })
      }
    } else if (day <= 40) {
      phase = 'Pré-Evento'
      label = `Pré-Evento D-${44 - day}`

      if (day === 36) {
        actions.push({ channel: 'email', type: 'lembrete', title: 'Email lembrete D-7', description: 'Lembrete do evento + o que preparar', priority: 'high' })
        actions.push({ channel: 'whatsapp', type: 'lembrete', title: 'WhatsApp lembrete D-7 + cronograma', description: 'Lembrete no grupo com cronograma', priority: 'high' })
      }
      if (day === 38) {
        actions.push({ channel: 'email', type: 'lembrete', title: 'Email lembrete D-3', description: 'Lembrete com detalhes finais', priority: 'high' })
        actions.push({ channel: 'stories', type: 'countdown', title: 'Stories contagem regressiva', description: 'Countdown para o evento', priority: 'high' })
      }
      if (day === 39) {
        actions.push({ channel: 'email', type: 'lembrete', title: 'Email D-1: Amanhã é o dia!', description: 'Checklist + links + horário', priority: 'high' })
        actions.push({ channel: 'whatsapp', type: 'lembrete', title: 'WhatsApp D-1 com link e horário', description: 'Lembrete com link e horário', priority: 'high' })
        actions.push({ channel: 'stories', type: 'countdown', title: 'Stories countdown final', description: 'Contagem regressiva para o evento', priority: 'high' })
        actions.push({ channel: 'instagram', type: 'post', title: 'Post "Amanhã" no feed', description: 'Post de expectativa no feed', priority: 'high' })
      }
      if (day === 40) {
        actions.push({ channel: 'email', type: 'evento', title: 'Email manhã do evento + link', description: 'Link + motivação + horário', priority: 'high' })
        actions.push({ channel: 'whatsapp', type: 'evento', title: 'WhatsApp 30min antes com link', description: 'Link e lembrete final', priority: 'high' })
        actions.push({ channel: 'stories', type: 'live', title: 'Stories ao vivo do evento', description: 'Bastidores do evento', priority: 'high' })
      }
      if (day >= 36 && day <= 40) {
        actions.push({ channel: 'stories', type: 'conteudo', title: 'Stories antecipação', description: 'Gerar expectativa para o evento', priority: 'medium' })
      }
    } else {
      phase = day === 41 ? 'Evento' : 'Pós-Evento'
      label = day === 41 ? 'Dia do Evento' : `Pós-Evento D+${day - 41}`

      if (day === 41) {
        actions.push({ channel: 'email', type: 'pos_evento', title: 'Email carrinho aberto — high ticket', description: 'Oferta do high ticket', priority: 'high' })
        actions.push({ channel: 'whatsapp', type: 'pos_evento', title: 'WhatsApp oferta + cashback', description: 'Oferta com cashback para quem comprou gravações', priority: 'high' })
        actions.push({ channel: 'stories', type: 'oferta', title: 'Stories oferta high ticket', description: 'Stories com oferta e depoimentos', priority: 'high' })
      }
      if (day === 42) {
        actions.push({ channel: 'email', type: 'follow_up', title: 'Email follow-up D+1 — prova social', description: 'Follow-up com prova social', priority: 'high' })
        actions.push({ channel: 'whatsapp', type: 'follow_up', title: 'WhatsApp follow-up', description: 'Acompanhamento dos interessados', priority: 'high' })
      }
      if (day === 43) {
        actions.push({ channel: 'email', type: 'urgencia', title: 'Email últimas 24h', description: 'Últimas 24h da oferta', priority: 'high' })
        actions.push({ channel: 'whatsapp', type: 'urgencia', title: 'WhatsApp última chance', description: 'Carrinho encerrando', priority: 'high' })
        actions.push({ channel: 'stories', type: 'urgencia', title: 'Stories urgência encerramento', description: 'Stories de urgência final', priority: 'high' })
      }
      if (day === 44) {
        actions.push({ channel: 'email', type: 'encerramento', title: 'Email encerramento final', description: 'Últimas 2h + obrigado', priority: 'high' })
        actions.push({ channel: 'whatsapp', type: 'encerramento', title: 'WhatsApp encerramento', description: 'Última mensagem de encerramento', priority: 'high' })
        actions.push({ channel: 'instagram', type: 'post', title: 'Post encerramento/agradecimento', description: 'Post final de agradecimento', priority: 'high' })
      }
    }

    if (actions.length > 0) {
      days.push({ day, date, label, phase, actions })
    }
  }

  return days
}

/* ── Page Component ──────────────────────────────────── */

export default function CronogramaPage() {
  const { id } = useParams<{ id: string }>()
  const [launch, setLaunch] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeChannel, setActiveChannel] = useState<string | null>(null)
  const [contentFilter, setContentFilter] = useState<'all' | 'with' | 'without' | 'approved' | 'pending'>('all')
  const [dbComms, setDbComms] = useState<DbComm[]>([])
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set())
  const [expandedContent, setExpandedContent] = useState<Set<string>>(new Set())
  const [updatingStatus, setUpdatingStatus] = useState<Set<string>>(new Set())

  useEffect(() => { loadData() }, [id])

  async function loadData() {
    try {
      const [launchRes, commRes] = await Promise.all([
        fetch(`/api/launches/${id}`),
        fetch(`/api/launches/${id}/communications`),
      ])
      const launchData = await launchRes.json()
      let commData = await commRes.json()

      setLaunch(launchData)

      if (!Array.isArray(commData) || commData.length === 0) {
        await fetch(`/api/launches/${id}/communications`, { method: 'POST' })
        const reRes = await fetch(`/api/launches/${id}/communications`)
        commData = await reRes.json()
      }

      setDbComms(Array.isArray(commData) ? commData : [])
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const calendar = useMemo(() => {
    if (!launch?.eventDate) return []
    return generateCommunicationCalendar(new Date(launch.eventDate as string))
  }, [launch])

  function findDbComm(day: number, action: CommunicationAction): DbComm | undefined {
    return dbComms.find((c) => c.day === day && c.channel === action.channel && c.type === action.type)
  }

  async function toggleStatus(commId: string, currentStatus: string) {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved'
    setUpdatingStatus((prev) => new Set(prev).add(commId))
    try {
      await fetch(`/api/launches/${id}/communications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ communicationId: commId, status: newStatus }),
      })
      setDbComms((prev) => prev.map((c) => c.id === commId ? { ...c, status: newStatus } : c))
      toast.success(newStatus === 'approved' ? 'Ação aprovada!' : 'Aprovação removida')
    } catch {
      toast.error('Erro ao atualizar status')
    } finally {
      setUpdatingStatus((prev) => { const n = new Set(prev); n.delete(commId); return n })
    }
  }

  const filteredCalendar = useMemo(() => {
    let filtered = calendar
    if (activeChannel) {
      filtered = filtered
        .map((d) => ({ ...d, actions: d.actions.filter((a) => a.channel === activeChannel) }))
        .filter((d) => d.actions.length > 0)
    }
    if (contentFilter === 'with') {
      filtered = filtered
        .map((d) => ({ ...d, actions: d.actions.filter((a) => findDbComm(d.day, a)?.approvedContentId) }))
        .filter((d) => d.actions.length > 0)
    } else if (contentFilter === 'without') {
      filtered = filtered
        .map((d) => ({ ...d, actions: d.actions.filter((a) => !findDbComm(d.day, a)?.approvedContentId && !isTaskAction(a)) }))
        .filter((d) => d.actions.length > 0)
    } else if (contentFilter === 'approved') {
      filtered = filtered
        .map((d) => ({ ...d, actions: d.actions.filter((a) => findDbComm(d.day, a)?.status === 'approved') }))
        .filter((d) => d.actions.length > 0)
    } else if (contentFilter === 'pending') {
      filtered = filtered
        .map((d) => ({ ...d, actions: d.actions.filter((a) => findDbComm(d.day, a)?.status !== 'approved') }))
        .filter((d) => d.actions.length > 0)
    }
    return filtered
  }, [calendar, activeChannel, contentFilter, dbComms])

  // Stats
  const totalActions = calendar.reduce((sum, d) => sum + d.actions.length, 0)
  const approvedCount = calendar.reduce(
    (sum, d) => sum + d.actions.filter((a) => findDbComm(d.day, a)?.status === 'approved').length, 0
  )
  const withContent = calendar.reduce(
    (sum, d) => sum + d.actions.filter((a) => findDbComm(d.day, a)?.approvedContentId).length, 0
  )
  const approvedPct = totalActions > 0 ? Math.round((approvedCount / totalActions) * 100) : 0

  const channels = ['email', 'whatsapp', 'instagram', 'stories', 'ads']

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-violet-400" /></div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/10 via-white/[0.02] to-indigo-600/5 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Cronograma de Comunicação — 44 Dias</h3>
              <p className="text-sm text-slate-500 mt-1">
                {launch?.eventDate
                  ? `Evento: ${format(new Date(launch.eventDate as string), "dd 'de' MMMM", { locale: ptBR })}`
                  : 'Data do evento não definida'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Badge variant="outline">{calendar.length} dias</Badge>
              <Badge variant="outline">{totalActions} ações</Badge>
              <Badge variant="success">{approvedCount}/{totalActions} aprovadas ({approvedPct}%)</Badge>
              {withContent > 0 && (
                <Badge variant="default">{withContent} com IA</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant={activeChannel === null ? 'default' : 'outline'} size="sm" onClick={() => setActiveChannel(null)}>
          Todos
        </Button>
        {channels.map((ch) => {
          const Icon = CHANNEL_ICONS[ch] || Calendar
          const color = CHANNEL_COLORS[ch]
          return (
            <Button
              key={ch}
              variant={activeChannel === ch ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveChannel(activeChannel === ch ? null : ch)}
              className="gap-1.5 capitalize"
            >
              <Icon className="h-3.5 w-3.5" />
              {ch}
            </Button>
          )
        })}

        <div className="ml-auto flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select value={contentFilter} onValueChange={(v) => setContentFilter(v as typeof contentFilter)}>
            <SelectTrigger className="w-[170px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as ações</SelectItem>
              <SelectItem value="approved">Aprovadas</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="with">Com conteúdo IA</SelectItem>
              <SelectItem value="without">Sem conteúdo IA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar */}
      <div className="space-y-3">
        {filteredCalendar.map((day) => {
          const isDayExpanded = expandedDays.has(day.day)
          const dayApproved = day.actions.filter((a) => findDbComm(day.day, a)?.status === 'approved').length
          const dayTotal = day.actions.length
          const dayPct = dayTotal > 0 ? Math.round((dayApproved / dayTotal) * 100) : 0

          return (
            <Card key={day.day}>
              <CardHeader
                className="pb-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => {
                  setExpandedDays((prev) => {
                    const next = new Set(prev)
                    next.has(day.day) ? next.delete(day.day) : next.add(day.day)
                    return next
                  })
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isDayExpanded ? <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" /> : <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />}
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                      dayPct === 100
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    }`}>
                      {day.day}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{day.label}</CardTitle>
                      <CardDescription className="text-xs">
                        {format(day.date, "EEEE, dd/MM", { locale: ptBR })}
                        <span className="ml-2">· {day.phase}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {dayApproved > 0 && (
                      <Badge variant={dayPct === 100 ? 'success' : 'warning'} className="text-[10px]">
                        {dayApproved}/{dayTotal} {dayPct === 100 ? 'completo' : 'aprovadas'}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px]">{dayTotal} ações</Badge>
                  </div>
                </div>
              </CardHeader>

              {isDayExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {day.actions.map((action, i) => {
                      const Icon = CHANNEL_ICONS[action.channel] || Calendar
                      const channelColor = CHANNEL_COLORS[action.channel] || { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' }
                      const dbComm = findDbComm(day.day, action)
                      const hasContent = !!dbComm?.approvedContentId
                      const isApproved = dbComm?.status === 'approved'
                      const isTask = isTaskAction(action)
                      const actionKey = `${day.day}-${action.channel}-${action.type}-${i}`
                      const isActionExpanded = expandedContent.has(actionKey)
                      const isUpdating = dbComm ? updatingStatus.has(dbComm.id) : false

                      return (
                        <div key={i} className={`rounded-xl border overflow-hidden transition-all ${
                          isApproved
                            ? 'border-emerald-500/20 bg-emerald-500/[0.02]'
                            : 'border-white/[0.06] bg-white/[0.01]'
                        }`}>
                          {/* Action row */}
                          <div className="flex items-center gap-3 p-3">
                            {/* Approve/Disapprove toggle */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (dbComm && !isUpdating) toggleStatus(dbComm.id, dbComm.status)
                              }}
                              disabled={!dbComm || isUpdating}
                              className="shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-transform hover:scale-110"
                              title={isApproved ? 'Desaprovar' : 'Aprovar'}
                            >
                              {isApproved ? (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                </div>
                              ) : (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 hover:border-white/40 transition-colors">
                                  <Circle className="h-3.5 w-3.5 text-slate-500" />
                                </div>
                              )}
                            </button>

                            {/* Channel icon */}
                            <div className={`rounded-lg p-1.5 ${channelColor.bg} shrink-0`}>
                              <Icon className={`h-3.5 w-3.5 ${channelColor.text}`} />
                            </div>

                            {/* Title + description */}
                            <button
                              className="flex-1 min-w-0 text-left cursor-pointer"
                              onClick={() => {
                                setExpandedContent((prev) => {
                                  const next = new Set(prev)
                                  next.has(actionKey) ? next.delete(actionKey) : next.add(actionKey)
                                  return next
                                })
                              }}
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className={`text-[13px] font-medium ${isApproved ? 'text-slate-400 line-through' : 'text-white'}`}>
                                  {action.title}
                                </p>
                                <Badge
                                  variant={action.priority === 'high' ? 'destructive' : action.priority === 'medium' ? 'warning' : 'secondary'}
                                  className="text-[9px] px-1.5 py-0"
                                >
                                  {action.priority === 'high' ? 'Alta' : action.priority === 'medium' ? 'Média' : 'Baixa'}
                                </Badge>
                                {isTask && (
                                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">Tarefa</Badge>
                                )}
                                {!isTask && hasContent && (
                                  <Badge variant="success" className="text-[9px] px-1.5 py-0 gap-0.5">
                                    <Sparkles className="h-2 w-2" /> IA
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5">{action.description}</p>
                            </button>

                            {/* Expand chevron */}
                            <button
                              className="shrink-0 p-1 cursor-pointer"
                              onClick={() => {
                                setExpandedContent((prev) => {
                                  const next = new Set(prev)
                                  next.has(actionKey) ? next.delete(actionKey) : next.add(actionKey)
                                  return next
                                })
                              }}
                            >
                              {isActionExpanded ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                            </button>
                          </div>

                          {/* Expanded content */}
                          {isActionExpanded && (
                            <div className="border-t border-white/[0.06]">
                              {isTask ? (
                                /* ── Task action: simple checklist view ── */
                                <div className="px-4 py-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {isApproved ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                      ) : (
                                        <Circle className="h-5 w-5 text-slate-600" />
                                      )}
                                      <div>
                                        <p className="text-sm font-medium">{isApproved ? 'Tarefa concluída' : 'Tarefa pendente'}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                                      </div>
                                    </div>
                                    <Button
                                      variant={isApproved ? 'outline' : 'default'}
                                      size="sm"
                                      className="text-xs gap-1.5"
                                      disabled={!dbComm || isUpdating}
                                      onClick={() => dbComm && toggleStatus(dbComm.id, dbComm.status)}
                                    >
                                      {isApproved ? (
                                        <><ThumbsDown className="h-3 w-3" /> Desmarcar</>
                                      ) : (
                                        <><ThumbsUp className="h-3 w-3" /> Concluir</>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              ) : hasContent && dbComm?.approvedContent ? (
                                /* ── Content action with approved IA content ── */
                                <div className="px-4 py-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                                      <span className="text-xs font-medium text-violet-400">Conteúdo IA vinculado</span>
                                      <Badge variant="outline" className="text-[9px]">
                                        {dbComm.approvedContent.type}/{dbComm.approvedContent.subtype}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-slate-600">
                                        {new Date(dbComm.approvedContent.createdAt).toLocaleDateString('pt-BR')}
                                      </span>
                                      <Button
                                        variant={isApproved ? 'outline' : 'default'}
                                        size="sm"
                                        className="text-xs gap-1.5"
                                        disabled={isUpdating}
                                        onClick={() => toggleStatus(dbComm.id, dbComm.status)}
                                      >
                                        {isApproved ? (
                                          <><ThumbsDown className="h-3 w-3" /> Desaprovar</>
                                        ) : (
                                          <><ThumbsUp className="h-3 w-3" /> Aprovar</>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="whitespace-pre-wrap text-[13px] leading-relaxed max-h-[300px] overflow-y-auto rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-slate-300">
                                    {dbComm.approvedContent.content}
                                  </div>
                                </div>
                              ) : (
                                /* ── Content action without content ── */
                                <div className="px-4 py-5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                                        <FileText className="h-5 w-5 text-slate-600" />
                                      </div>
                                      <div>
                                        <p className="text-sm text-slate-400">Sem conteúdo vinculado</p>
                                        <p className="text-[11px] text-slate-600 mt-0.5">Gere no painel Conteúdo IA e aprove</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Link
                                        href={`/lancamentos/${id}/conteudo`}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 text-xs font-medium text-violet-400 hover:bg-violet-500/20 transition-colors"
                                      >
                                        <Sparkles className="h-3 w-3" />
                                        Gerar com IA
                                      </Link>
                                      <Button
                                        variant={isApproved ? 'outline' : 'default'}
                                        size="sm"
                                        className="text-xs gap-1.5"
                                        disabled={!dbComm || isUpdating}
                                        onClick={() => dbComm && toggleStatus(dbComm.id, dbComm.status)}
                                      >
                                        {isApproved ? (
                                          <><ThumbsDown className="h-3 w-3" /> Desaprovar</>
                                        ) : (
                                          <><ThumbsUp className="h-3 w-3" /> Aprovar</>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
