import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Target, DollarSign, TrendingUp, ListChecks, Calculator, Calendar, Sparkles, BarChart3, Upload, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { PHASE_NAMES } from '@/types/launch'

const moduleColors = [
  { bg: 'bg-violet-500/10', text: 'text-violet-400', hover: 'hover:border-violet-500/20' },
  { bg: 'bg-indigo-500/10', text: 'text-indigo-400', hover: 'hover:border-indigo-500/20' },
  { bg: 'bg-cyan-500/10', text: 'text-cyan-400', hover: 'hover:border-cyan-500/20' },
  { bg: 'bg-amber-500/10', text: 'text-amber-400', hover: 'hover:border-amber-500/20' },
  { bg: 'bg-emerald-500/10', text: 'text-emerald-400', hover: 'hover:border-emerald-500/20' },
  { bg: 'bg-rose-500/10', text: 'text-rose-400', hover: 'hover:border-rose-500/20' },
]

export default async function LaunchOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const launch = await prisma.launch.findUnique({
    where: { id },
    include: {
      ticketBatches: { orderBy: { order: 'asc' } },
      products: true,
      orderBumps: true,
      steps: true,
    },
  })

  if (!launch) notFound()

  const completedSteps = launch.steps.filter((s) => s.status === 'completed').length
  const totalSteps = launch.steps.length
  const stepProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  const activeBatch = launch.ticketBatches.find((b) => b.status === 'active')
  const totalBatchRevenue = launch.ticketBatches.reduce((sum, b) => sum + b.sold * b.price, 0)
  const roas = launch.totalAdSpend > 0 ? launch.totalRevenue / launch.totalAdSpend : 0
  const cpaStatus = launch.currentCpa > 0 && launch.currentCpa > launch.maxCpa ? 'danger' : 'ok'

  const quickLinks = [
    { name: 'Checklist', href: `/lancamentos/${id}/checklist`, icon: ListChecks, description: `${completedSteps}/${totalSteps} passos` },
    { name: 'Calculadoras', href: `/lancamentos/${id}/calculadoras`, icon: Calculator, description: 'CPA, ROAS, Projeção' },
    { name: 'Cronograma', href: `/lancamentos/${id}/cronograma`, icon: Calendar, description: '44 dias de comunicação' },
    { name: 'Conteúdo IA', href: `/lancamentos/${id}/conteudo`, icon: Sparkles, description: '6 tipos de conteúdo' },
    { name: 'Benchmarks', href: `/lancamentos/${id}/benchmarks`, icon: BarChart3, description: 'Cases e referências' },
    { name: 'ClickUp', href: `/lancamentos/${id}/clickup`, icon: Upload, description: 'Exportar tarefas' },
  ]

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:border-emerald-500/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingressos</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Target className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {launch.totalSold}
              <span className="text-base font-normal text-muted-foreground"> / {launch.targetTickets}</span>
            </div>
            <Progress value={(launch.totalSold / launch.targetTickets) * 100} className="mt-3" indicatorClassName="from-emerald-500 to-emerald-400" />
          </CardContent>
        </Card>

        <Card className="group hover:border-amber-500/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CPA Atual</CardTitle>
            {cpaStatus === 'danger' ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="h-4 w-4" />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${cpaStatus === 'danger' ? 'text-red-400' : ''}`}>
              {launch.currentCpa > 0 ? formatCurrency(launch.currentCpa) : '—'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Máximo: {formatCurrency(launch.maxCpa)}</p>
          </CardContent>
        </Card>

        <Card className="group hover:border-violet-500/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(launch.totalRevenue || totalBatchRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Investido: {formatCurrency(launch.totalAdSpend)}</p>
          </CardContent>
        </Card>

        <Card className="group hover:border-indigo-500/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ROAS</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{roas > 0 ? `${roas.toFixed(1)}x` : '—'}</div>
            <p className="text-xs text-muted-foreground mt-1">Meta: 5x+</p>
          </CardContent>
        </Card>
      </div>

      {/* Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progresso por Fase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {([0, 1, 2, 3, 4] as const).map((phase) => {
              const phaseSteps = launch.steps.filter((s) => s.phase === phase)
              const phaseCompleted = phaseSteps.filter((s) => s.status === 'completed').length
              const phasePct = phaseSteps.length > 0 ? (phaseCompleted / phaseSteps.length) * 100 : 0
              const isActive = launch.phase === phase

              return (
                <div key={phase} className={`flex-1 ${isActive ? '' : 'opacity-40'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">Fase {phase}</span>
                    <span className="text-xs text-muted-foreground">{phaseCompleted}/{phaseSteps.length}</span>
                  </div>
                  <Progress
                    value={phasePct}
                    className="h-1.5"
                    indicatorClassName={isActive ? 'from-violet-500 to-indigo-500' : 'from-muted-foreground to-muted-foreground !bg-none bg-muted-foreground'}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">{PHASE_NAMES[phase]}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Batches */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Lotes de Ingresso</CardTitle>
            {activeBatch && <Badge>Lote Ativo: {activeBatch.name}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {launch.ticketBatches.map((batch) => (
              <div
                key={batch.id}
                className={`rounded-xl border p-4 transition-all ${
                  batch.status === 'active'
                    ? 'border-violet-500/30 bg-violet-500/[0.04]'
                    : batch.status === 'sold_out'
                    ? 'opacity-40 border-white/[0.04]'
                    : 'border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{batch.name}</span>
                  <Badge variant={batch.status === 'active' ? 'default' : batch.status === 'sold_out' ? 'destructive' : 'secondary'} className="text-[10px]">
                    {batch.status === 'active' ? 'Ativo' : batch.status === 'sold_out' ? 'Esgotado' : 'Próximo'}
                  </Badge>
                </div>
                <p className="text-lg font-bold">{formatCurrency(batch.price)}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{batch.sold}/{batch.quantity} vendidos</span>
                  <span className="text-xs text-muted-foreground">{formatCurrency(batch.sold * batch.price)}</span>
                </div>
                <Progress value={(batch.sold / batch.quantity) * 100} className="mt-2 h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Módulos</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link, i) => {
            const color = moduleColors[i % moduleColors.length]
            return (
              <Link key={link.name} href={link.href}>
                <Card className={`group transition-all duration-300 ${color.hover} cursor-pointer h-full`}>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color.bg} ${color.text} group-hover:scale-105 transition-transform`}>
                      <link.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{link.name}</p>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
