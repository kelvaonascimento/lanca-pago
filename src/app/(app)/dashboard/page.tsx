import Link from 'next/link'
import { Rocket, Plus, BarChart3, Target, TrendingUp, DollarSign, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const launches = await prisma.launch.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      ticketBatches: true,
      _count: {
        select: {
          steps: { where: { status: 'completed' } },
        },
      },
    },
  })

  const activeLaunch = launches.find((l) => l.status === 'active')
  const totalLaunches = launches.length

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-600/10 via-card to-indigo-600/5 p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Gerencie seus lançamentos pagos com a metodologia Willian Baldan
            </p>
          </div>
          <Link href="/onboarding">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Lançamento
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      {totalLaunches > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:border-violet-500/20 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Lançamentos</CardTitle>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                  <Rocket className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalLaunches}</div>
              </CardContent>
            </Card>

            {activeLaunch && (
              <>
                <Card className="group hover:border-emerald-500/20 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Ingressos Vendidos</CardTitle>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                      <Target className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {activeLaunch.totalSold}
                      <span className="text-base font-normal text-muted-foreground">/{activeLaunch.targetTickets}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="group hover:border-amber-500/20 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento</CardTitle>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                      <DollarSign className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(activeLaunch.totalRevenue)}
                    </div>
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
                    <div className="text-3xl font-bold">
                      {activeLaunch.totalAdSpend > 0
                        ? (activeLaunch.totalRevenue / activeLaunch.totalAdSpend).toFixed(1) + 'x'
                        : '—'}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Launches List */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">Seus Lançamentos</h3>
              <Link href="/lancamentos" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {launches.map((launch) => (
                <Link key={launch.id} href={`/lancamentos/${launch.id}`}>
                  <Card className="group transition-all duration-300 hover:border-white/[0.12] hover:shadow-xl hover:shadow-violet-500/5 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{launch.name}</CardTitle>
                        <Badge variant={launch.status === 'active' ? 'default' : launch.status === 'completed' ? 'success' : 'secondary'}>
                          {launch.status === 'active' ? 'Ativo' : launch.status === 'completed' ? 'Concluído' : 'Rascunho'}
                        </Badge>
                      </div>
                      <CardDescription>{launch.niche} &middot; {launch.expert}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Meta: {launch.targetTickets} ingressos
                        </span>
                        <span className="text-muted-foreground">
                          Fase {launch.phase}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <Card className="border-dashed border-white/[0.1] overflow-hidden">
          <CardContent className="relative flex flex-col items-center justify-center py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] to-transparent pointer-events-none" />
            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 mb-6 shadow-lg shadow-violet-500/10">
                <Rocket className="h-7 w-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">Crie seu primeiro lançamento</h3>
              <p className="text-muted-foreground text-center max-w-md mb-8">
                Configure tudo do zero: oferta, lotes, cronograma e estratégia.
                O sistema calcula métricas, gera conteúdo e organiza as tarefas da equipe.
              </p>
              <div className="flex justify-center">
                <Link href="/onboarding">
                  <Button size="lg" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Criar Lançamento
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/onboarding">
          <Card className="group transition-all duration-300 hover:border-violet-500/20 cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Novo Lançamento</p>
                <p className="text-sm text-muted-foreground">Wizard em 5 passos</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/benchmarks">
          <Card className="group transition-all duration-300 hover:border-emerald-500/20 cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Benchmarks</p>
                <p className="text-sm text-muted-foreground">Cases e referências</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Card className="group transition-all duration-300 hover:border-amber-500/20 cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Calculadoras</p>
              <p className="text-sm text-muted-foreground">CPA, ROAS, Projeção</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
