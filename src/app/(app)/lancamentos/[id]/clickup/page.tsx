'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Upload, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { PHASE_NAMES } from '@/types/launch'
import { subDays, format } from 'date-fns'
import { toast } from 'sonner'

interface Communication {
  id: string
  day: number
  date: string
  channel: string
  type: string
  title: string
  content: string
  status: string
  approvedContentId: string | null
  approvedContent: { id: string; type: string; subtype: string; content: string } | null
}

interface TaskTemplate {
  name: string
  description: string
  phase: number
  role: string
  daysBeforeEvent: number
  priority: number
  selected: boolean
  hasContent?: boolean
  content?: string
}

const ROLES = ['Estrategista', 'Trafego', 'Copy', 'Design', 'Automacoes', 'Comercial', 'Expert']

function generateTasks(eventDate: Date, communications: Communication[]): TaskTemplate[] {
  const baseTasks: TaskTemplate[] = [
    // Phase 0
    { name: 'Definir nicho e expert', description: 'Validar nicho e confirmar expert do evento', phase: 0, role: 'Estrategista', daysBeforeEvent: 44, priority: 1, selected: true },
    { name: 'Criar Big Idea e narrativa', description: 'Definir conceito central e historia do evento', phase: 0, role: 'Estrategista', daysBeforeEvent: 43, priority: 1, selected: true },
    { name: 'Estruturar oferta completa', description: 'Ingresso + order bumps + high ticket + downsell + cashback', phase: 0, role: 'Estrategista', daysBeforeEvent: 42, priority: 1, selected: true },
    { name: 'Definir lotes e precos', description: 'Criar 7-9 lotes com escassez progressiva', phase: 0, role: 'Estrategista', daysBeforeEvent: 41, priority: 2, selected: true },
    { name: 'Calcular meta e orcamento', description: 'CPA maximo, pacing, distribuicao de budget', phase: 0, role: 'Trafego', daysBeforeEvent: 41, priority: 1, selected: true },

    // Phase 1
    { name: 'Criar copy da pagina de vendas', description: 'Hook + Mecanismo + Prova + Oferta + Escassez + CTA', phase: 1, role: 'Copy', daysBeforeEvent: 38, priority: 1, selected: true },
    { name: 'Desenvolver design da pagina', description: 'Layout responsivo, checkout integrado, lotes visiveis', phase: 1, role: 'Design', daysBeforeEvent: 36, priority: 1, selected: true },
    { name: 'Configurar checkout e gateway', description: 'Hotmart/outra plataforma, order bumps, boleto, PIX', phase: 1, role: 'Automacoes', daysBeforeEvent: 35, priority: 1, selected: true },
    { name: 'Configurar automacoes de email', description: 'Confirmacao, lembretes D-7/D-1/D0, virada de lote', phase: 1, role: 'Automacoes', daysBeforeEvent: 34, priority: 1, selected: true },
    { name: 'Criar grupo de WhatsApp', description: 'Grupo + mensagem de boas-vindas + regras + bot', phase: 1, role: 'Automacoes', daysBeforeEvent: 34, priority: 2, selected: true },
    { name: 'Produzir criativos (10+ pecas)', description: 'Mix: UGC + video expert + estaticos. Hook 3s obrigatorio', phase: 1, role: 'Design', daysBeforeEvent: 33, priority: 1, selected: true },
    { name: 'Escrever copies dos criativos', description: 'Legendas, headlines, CTAs para cada criativo', phase: 1, role: 'Copy', daysBeforeEvent: 33, priority: 1, selected: true },
    { name: 'Configurar campanhas de trafego', description: 'Facebook Advantage+ ou CBO. Google Search + YouTube', phase: 1, role: 'Trafego', daysBeforeEvent: 31, priority: 1, selected: true },
    { name: 'Instalar pixels e conversoes', description: 'Facebook Pixel, Google Tag, eventos de conversao', phase: 1, role: 'Trafego', daysBeforeEvent: 31, priority: 1, selected: true },
    { name: 'Criar calendario de conteudo', description: '15-20 dias de posts, stories, reels', phase: 1, role: 'Copy', daysBeforeEvent: 30, priority: 2, selected: true },
    { name: 'Teste end-to-end da jornada', description: 'Compra teste: pagina -> checkout -> email -> WhatsApp -> grupo', phase: 1, role: 'Automacoes', daysBeforeEvent: 29, priority: 1, selected: true },

    // Phase 2
    { name: 'Ativar campanhas de trafego', description: 'Ligar campanhas e monitorar primeiras 24h', phase: 2, role: 'Trafego', daysBeforeEvent: 28, priority: 1, selected: true },
    { name: 'Gestao diaria de trafego', description: 'Monitorar CPA, pausar criativos ruins, escalar bons', phase: 2, role: 'Trafego', daysBeforeEvent: 27, priority: 1, selected: true },
    { name: 'Executar viradas de lote', description: 'Comunicacao de urgencia: email + WhatsApp + stories', phase: 2, role: 'Copy', daysBeforeEvent: 25, priority: 1, selected: true },
    { name: 'Comunicacao diaria multi-canal', description: 'Email, WhatsApp, Instagram, stories conforme calendario', phase: 2, role: 'Copy', daysBeforeEvent: 28, priority: 2, selected: true },
    { name: 'Producao continua de criativos', description: 'Novos criativos semanais para manter performance', phase: 2, role: 'Design', daysBeforeEvent: 21, priority: 2, selected: true },

    // Phase 3
    { name: 'Preparar setup tecnico do evento', description: 'Testar plataforma, links, roteiro, equipe', phase: 3, role: 'Automacoes', daysBeforeEvent: 8, priority: 1, selected: true },
    { name: 'Criar roteiro do evento com pitch', description: 'Estrutura: abertura -> conteudo -> pitch -> Q&A -> encerramento', phase: 3, role: 'Estrategista', daysBeforeEvent: 7, priority: 1, selected: true },
    { name: 'Enviar sequencia de lembretes', description: 'D-7, D-1, D0 manha, 30min antes', phase: 3, role: 'Automacoes', daysBeforeEvent: 7, priority: 1, selected: true },
    { name: 'Briefar expert para o evento', description: 'Roteiro, momentos de pitch, links, CTA', phase: 3, role: 'Estrategista', daysBeforeEvent: 3, priority: 1, selected: true },
    { name: 'Preparar scripts comerciais', description: 'Cashback, follow-up, downsell, recuperacao boleto', phase: 3, role: 'Comercial', daysBeforeEvent: 3, priority: 1, selected: true },
    { name: 'Realizar evento', description: 'Execucao com pitch integrado ao conteudo', phase: 3, role: 'Expert', daysBeforeEvent: 0, priority: 1, selected: true },

    // Phase 4
    { name: 'Abrir carrinho high ticket', description: 'Email + WhatsApp com oferta. Minimo 3 dias aberto', phase: 4, role: 'Automacoes', daysBeforeEvent: -1, priority: 1, selected: true },
    { name: 'Ativar time comercial', description: 'Abordagem ativa com script de cashback', phase: 4, role: 'Comercial', daysBeforeEvent: -1, priority: 1, selected: true },
    { name: 'Follow-up D+1', description: 'Email + WhatsApp urgencia para quem nao comprou', phase: 4, role: 'Copy', daysBeforeEvent: -1, priority: 1, selected: true },
    { name: 'Follow-up D+3', description: 'Prova social + depoimentos + ultima chance', phase: 4, role: 'Copy', daysBeforeEvent: -3, priority: 2, selected: true },
    { name: 'Ativar downsell', description: 'Oferecer versao mais acessivel pos-encerramento', phase: 4, role: 'Estrategista', daysBeforeEvent: -5, priority: 2, selected: true },
    { name: 'Encerrar carrinho', description: 'Ultimas 2h + email final + WhatsApp final', phase: 4, role: 'Automacoes', daysBeforeEvent: -5, priority: 1, selected: true },
    { name: 'Consolidar metricas e relatorio', description: 'ROAS, CPA, conversao, aprendizados, documentar tudo', phase: 4, role: 'Estrategista', daysBeforeEvent: -7, priority: 2, selected: true },
  ]

  // Add communication tasks with approved content
  const commTasks: TaskTemplate[] = communications
    .filter((c) => c.approvedContentId && c.approvedContent)
    .map((c) => {
      const daysBeforeEvent = 44 - c.day
      let phase = 0
      if (c.day <= 10) phase = 1
      else if (c.day <= 35) phase = 2
      else if (c.day <= 40) phase = 3
      else phase = 4

      return {
        name: `[${c.channel.toUpperCase()}] ${c.title}`,
        description: `${c.approvedContent!.content}\n\n---\nCanal: ${c.channel}\nTipo: ${c.type}\nDia: ${c.day}`,
        phase,
        role: 'Copy',
        daysBeforeEvent,
        priority: 1,
        selected: true,
        hasContent: true,
        content: c.approvedContent!.content,
      }
    })

  return [...baseTasks, ...commTasks]
}

export default function ClickUpPage() {
  const { id } = useParams<{ id: string }>()
  const [launch, setLaunch] = useState<Record<string, unknown> | null>(null)
  const [communications, setCommunications] = useState<Communication[]>([])
  const [listId, setListId] = useState('')
  const [tasks, setTasks] = useState<TaskTemplate[]>([])
  const [filterPhase, setFilterPhase] = useState<string>('all')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterContent, setFilterContent] = useState<string>('all')
  const [exporting, setExporting] = useState(false)
  const [results, setResults] = useState<Array<{ success: boolean; name: string }>>([])

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    const [launchRes, commRes] = await Promise.all([
      fetch(`/api/launches/${id}`),
      fetch(`/api/launches/${id}/communications`),
    ])
    const launchData = await launchRes.json()
    const commData = await commRes.json()

    setLaunch(launchData)
    setCommunications(commData)

    if (launchData.eventDate) {
      setTasks(generateTasks(new Date(launchData.eventDate), commData))
    }
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterPhase !== 'all' && t.phase !== Number(filterPhase)) return false
      if (filterRole !== 'all' && t.role !== filterRole) return false
      if (filterContent === 'with' && !t.hasContent) return false
      if (filterContent === 'without' && t.hasContent) return false
      return true
    })
  }, [tasks, filterPhase, filterRole, filterContent])

  const selectedCount = tasks.filter((t) => t.selected).length
  const contentTaskCount = tasks.filter((t) => t.hasContent).length

  const toggleTask = (index: number) => {
    setTasks((prev) => prev.map((t, i) => i === index ? { ...t, selected: !t.selected } : t))
  }

  const selectAll = () => setTasks((prev) => prev.map((t) => ({ ...t, selected: true })))
  const deselectAll = () => setTasks((prev) => prev.map((t) => ({ ...t, selected: false })))

  async function handleExport() {
    if (!listId) {
      toast.error('Informe o List ID do ClickUp')
      return
    }

    const selectedTasks = tasks.filter((t) => t.selected)
    if (selectedTasks.length === 0) {
      toast.error('Selecione pelo menos uma tarefa')
      return
    }

    setExporting(true)
    setResults([])

    try {
      const eventDate = launch?.eventDate ? new Date(launch.eventDate as string) : new Date()
      const formattedTasks = selectedTasks.map((t) => ({
        name: `[Fase ${t.phase}] ${t.name}`,
        description: t.description,
        phase: t.phase,
        role: t.role,
        priority: t.priority,
        dueDate: subDays(eventDate, -t.daysBeforeEvent).toISOString(),
      }))

      const res = await fetch('/api/clickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listId,
          tasks: formattedTasks,
          launchName: launch?.name || 'Lancamento',
        }),
      })

      const data = await res.json()
      setResults(data.results || [])
      toast.success(`${data.created} tarefas criadas no ClickUp!`)
    } catch {
      toast.error('Erro ao exportar para o ClickUp')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Config */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Exportar para ClickUp
          </CardTitle>
          <CardDescription>
            Crie tarefas organizadas por fase e funcao no seu workspace ClickUp.
            {contentTaskCount > 0 && (
              <span className="text-success font-medium"> {contentTaskCount} tarefas incluem conteudo aprovado pela IA.</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>List ID do ClickUp *</Label>
              <Input
                placeholder="Ex: 901234567890"
                value={listId}
                onChange={(e) => setListId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Encontre o List ID nas configuracoes da lista no ClickUp
              </p>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleExport} disabled={exporting || !listId} className="gap-2">
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {exporting ? 'Exportando...' : `Exportar ${selectedCount} Tarefas`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Fase:</Label>
          <Select value={filterPhase} onValueChange={setFilterPhase}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {[0, 1, 2, 3, 4].map((p) => (
                <SelectItem key={p} value={String(p)}>Fase {p}: {PHASE_NAMES[p as keyof typeof PHASE_NAMES]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Funcao:</Label>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Conteudo:</Label>
          <Select value={filterContent} onValueChange={setFilterContent}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="with">Com conteudo IA</SelectItem>
              <SelectItem value="without">Sem conteudo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={selectAll}>Selecionar Tudo</Button>
          <Button variant="outline" size="sm" onClick={deselectAll}>Desmarcar Tudo</Button>
        </div>
      </div>

      {/* Task List */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {filteredTasks.map((task, _) => {
              const realIndex = tasks.indexOf(task)
              const eventDate = launch?.eventDate ? new Date(launch.eventDate as string) : new Date()
              const dueDate = subDays(eventDate, -task.daysBeforeEvent)

              return (
                <div key={realIndex} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/30 transition-colors">
                  <Checkbox
                    checked={task.selected}
                    onCheckedChange={() => toggleTask(realIndex)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{task.name}</span>
                      <Badge variant="secondary" className="text-[10px]">Fase {task.phase}</Badge>
                      <Badge variant="outline" className="text-[10px]">{task.role}</Badge>
                      {task.hasContent && (
                        <Badge variant="success" className="text-[10px] gap-1">
                          <FileText className="h-2.5 w-2.5" />
                          Conteudo incluso
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description.split('\n')[0]}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(dueDate, 'dd/MM')}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resultado da Exportacao</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {r.success ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  <span>{r.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
