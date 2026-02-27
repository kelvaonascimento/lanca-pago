import Link from 'next/link'
import { Plus, Rocket } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'

export default async function LancamentosPage() {
  const launches = await prisma.launch.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { ticketBatches: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Todos os Lançamentos</h2>
        <Link href="/onboarding">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Lançamento
          </Button>
        </Link>
      </div>

      {launches.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Rocket className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum lançamento criado ainda</p>
            <Link href="/onboarding" className="mt-4">
              <Button>Criar Primeiro Lançamento</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {launches.map((launch) => (
            <Link key={launch.id} href={`/lancamentos/${launch.id}`}>
              <Card className="transition-all hover:border-primary/50 hover:shadow-md cursor-pointer h-full">
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
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Meta</p>
                      <p className="font-medium">{launch.targetTickets} ingressos</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Orçamento</p>
                      <p className="font-medium">{formatCurrency(launch.budget)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CPA Máx</p>
                      <p className="font-medium">{formatCurrency(launch.maxCpa)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fase</p>
                      <p className="font-medium">Fase {launch.phase}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
