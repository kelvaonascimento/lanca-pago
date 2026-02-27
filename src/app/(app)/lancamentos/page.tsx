'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Rocket, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

interface Launch {
  id: string
  name: string
  niche: string
  expert: string
  status: string
  phase: number
  targetTickets: number
  budget: number
  maxCpa: number
}

export default function LancamentosPage() {
  const router = useRouter()
  const [launches, setLaunches] = useState<Launch[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Launch | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch('/api/launches')
      .then((r) => r.json())
      .then((data) => setLaunches(data))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await fetch(`/api/launches/${deleteTarget.id}`, { method: 'DELETE' })
      setLaunches((prev) => prev.filter((l) => l.id !== deleteTarget.id))
      toast.success('Lançamento deletado')
      setDeleteTarget(null)
    } catch {
      toast.error('Erro ao deletar')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" /></div>
  }

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
            <Card key={launch.id} className="transition-all hover:border-primary/50 hover:shadow-md h-full group relative">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setDeleteTarget(launch)
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 cursor-pointer z-10"
                title="Deletar lançamento"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>

              <Link href={`/lancamentos/${launch.id}`} className="block h-full">
                <CardHeader>
                  <div className="flex items-center justify-between pr-6">
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
              </Link>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar lançamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar <strong>{deleteTarget?.name}</strong>? Todos os dados (checklist, cronograma, conteúdos IA) serão removidos permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="gap-1.5">
              {deleting ? 'Deletando...' : <><Trash2 className="h-3.5 w-3.5" /> Deletar</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
