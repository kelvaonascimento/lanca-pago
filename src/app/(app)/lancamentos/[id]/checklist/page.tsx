'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Check, Circle, Loader2, ChevronDown, ChevronRight, Lightbulb, AlertTriangle, CheckCircle2, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { PHASE_NAMES, PHASE_COLORS } from '@/types/launch'
import { toast } from 'sonner'

interface StepData {
  id: string
  stepKey: string
  phase: number
  order: number
  status: string
  notes: string
  items: { id: string; label: string; completed: boolean; order: number }[]
}

interface StepDefinition {
  key: string
  phase: number
  order: number
  title: string
  description: string
  howTo: string
  benchmark: string
  tip: string
  commonError: string
  items: string[]
}

const phaseGradients: Record<number, string> = {
  0: 'from-violet-500 to-indigo-500',
  1: 'from-cyan-500 to-blue-500',
  2: 'from-amber-500 to-orange-500',
  3: 'from-emerald-500 to-green-500',
  4: 'from-rose-500 to-pink-500',
}

const phaseBorderColors: Record<number, string> = {
  0: 'border-l-violet-500',
  1: 'border-l-cyan-500',
  2: 'border-l-amber-500',
  3: 'border-l-emerald-500',
  4: 'border-l-rose-500',
}

function pctBadgeVariant(pct: number) {
  if (pct >= 80) return 'success' as const
  if (pct >= 40) return 'warning' as const
  return 'destructive' as const
}

export default function ChecklistPage() {
  const { id } = useParams<{ id: string }>()
  const [steps, setSteps] = useState<StepData[]>([])
  const [definitions, setDefinitions] = useState<StepDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([0]))
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())

  useEffect(() => { loadData() }, [id])

  async function loadData() {
    try {
      const [launchRes, defRes] = await Promise.all([
        fetch(`/api/launches/${id}`),
        fetch('/api/steps'),
      ])
      const launch = await launchRes.json()
      const defs = await defRes.json()

      setSteps(launch.steps || [])
      setDefinitions(defs)

      if ((!launch.steps || launch.steps.length === 0) && defs.length > 0) {
        await fetch(`/api/launches/${id}/steps`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ steps: defs }),
        })
        const reRes = await fetch(`/api/launches/${id}`)
        const reLaunch = await reRes.json()
        setSteps(reLaunch.steps || [])
      }
    } catch {
      toast.error('Erro ao carregar checklist')
    } finally {
      setLoading(false)
    }
  }

  async function toggleStep(stepId: string, currentStatus: string) {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    try {
      await fetch(`/api/launches/${id}/steps`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, status: newStatus }),
      })
      setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, status: newStatus } : s))
    } catch { toast.error('Erro ao atualizar passo') }
  }

  async function toggleItem(itemId: string, completed: boolean) {
    try {
      await fetch(`/api/launches/${id}/steps`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, completed: !completed }),
      })
      setSteps((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.map((i) => i.id === itemId ? { ...i, completed: !completed } : i),
        }))
      )
    } catch { toast.error('Erro ao atualizar item') }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-violet-400" /></div>
  }

  const phases = [0, 1, 2, 3, 4]
  const totalCompleted = steps.filter((s) => s.status === 'completed').length
  const totalSteps = steps.length
  const globalPct = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/10 via-white/[0.02] to-indigo-600/5 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
                {globalPct === 100 ? (
                  <Trophy className="h-6 w-6 text-amber-400" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-violet-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">Progresso Geral</h3>
                <p className="text-sm text-slate-400">{totalCompleted} de {totalSteps} passos concluídos</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{globalPct}%</span>
            </div>
          </div>
          <Progress value={globalPct} className="h-3" />
          {/* Phase mini-progress */}
          <div className="flex gap-2 mt-4">
            {phases.map((phase) => {
              const phaseSteps = steps.filter((s) => s.phase === phase)
              const phaseCompleted = phaseSteps.filter((s) => s.status === 'completed').length
              const phasePct = phaseSteps.length > 0 ? Math.round((phaseCompleted / phaseSteps.length) * 100) : 0
              return (
                <div key={phase} className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-500">F{phase}</span>
                    <span className="text-[10px] text-slate-500">{phasePct}%</span>
                  </div>
                  <Progress value={phasePct} className="h-1" indicatorClassName={`bg-gradient-to-r ${phaseGradients[phase]}`} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Phases */}
      {phases.map((phase) => {
        const phaseSteps = steps.filter((s) => s.phase === phase)
        const phaseDefs = definitions.filter((d) => d.phase === phase)
        const phaseCompleted = phaseSteps.filter((s) => s.status === 'completed').length
        const phasePct = phaseSteps.length > 0 ? Math.round((phaseCompleted / phaseSteps.length) * 100) : 0
        const isExpanded = expandedPhases.has(phase)

        return (
          <Card key={phase} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => {
                setExpandedPhases((prev) => {
                  const next = new Set(prev)
                  next.has(phase) ? next.delete(phase) : next.add(phase)
                  return next
                })
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                  <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${phaseGradients[phase]}`} />
                  <CardTitle className="text-base">
                    Fase {phase}: {PHASE_NAMES[phase as keyof typeof PHASE_NAMES]}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{phasePct}%</span>
                  <Badge variant={pctBadgeVariant(phasePct)}>
                    {phaseCompleted}/{phaseSteps.length}
                  </Badge>
                </div>
              </div>
              <Progress value={phasePct} className="h-1.5 mt-3" indicatorClassName={`bg-gradient-to-r ${phaseGradients[phase]}`} />
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-3 pt-0">
                {phaseSteps.map((step) => {
                  const def = phaseDefs.find((d) => d.key === step.stepKey) || definitions.find((d) => d.key === step.stepKey)
                  const isStepExpanded = expandedSteps.has(step.stepKey)
                  const itemsDone = step.items.filter((i) => i.completed).length
                  const itemsTotal = step.items.length
                  const itemsPct = itemsTotal > 0 ? Math.round((itemsDone / itemsTotal) * 100) : 0

                  return (
                    <div key={step.id} className={`rounded-xl border-l-[3px] ${phaseBorderColors[phase]} border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]`}>
                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleStep(step.id, step.status)} className="mt-0.5 cursor-pointer shrink-0">
                          {step.status === 'completed' ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 hover:border-white/40 transition-colors">
                              <Circle className="h-3 w-3 text-slate-500" />
                            </div>
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                setExpandedSteps((prev) => {
                                  const next = new Set(prev)
                                  next.has(step.stepKey) ? next.delete(step.stepKey) : next.add(step.stepKey)
                                  return next
                                })
                              }}
                              className="text-left cursor-pointer min-w-0 flex-1"
                            >
                              <p className={`font-medium ${step.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
                                {def?.title || step.stepKey}
                              </p>
                              {def?.description && <p className="text-sm text-slate-500 mt-0.5 truncate">{def.description}</p>}
                            </button>
                            {itemsTotal > 0 && (
                              <Badge variant={pctBadgeVariant(itemsPct)} className="text-[10px] shrink-0">
                                {itemsDone}/{itemsTotal} ({itemsPct}%)
                              </Badge>
                            )}
                          </div>

                          {isStepExpanded && def && (
                            <div className="mt-4 space-y-3 text-sm">
                              {def.howTo && (
                                <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                                  <p className="font-medium text-slate-300 mb-1">Como Fazer</p>
                                  <p className="text-slate-400 leading-relaxed">{def.howTo}</p>
                                </div>
                              )}
                              {def.benchmark && (
                                <div className="rounded-xl bg-violet-500/[0.04] border border-violet-500/10 p-3.5">
                                  <p className="font-medium text-violet-300 mb-1">Benchmark</p>
                                  <p className="text-slate-400 leading-relaxed">{def.benchmark}</p>
                                </div>
                              )}
                              {def.tip && (
                                <div className="rounded-xl bg-amber-500/[0.04] border border-amber-500/10 p-3.5 flex gap-3">
                                  <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-amber-300 mb-1">Dica do Willian</p>
                                    <p className="text-slate-400 leading-relaxed">{def.tip}</p>
                                  </div>
                                </div>
                              )}
                              {def.commonError && (
                                <div className="rounded-xl bg-red-500/[0.04] border border-red-500/10 p-3.5 flex gap-3">
                                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-red-300 mb-1">Erro Comum</p>
                                    <p className="text-slate-400 leading-relaxed">{def.commonError}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {step.items.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {step.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-2.5 group">
                                  <Checkbox checked={item.completed} onCheckedChange={() => toggleItem(item.id, item.completed)} />
                                  <span className={`text-sm transition-colors ${item.completed ? 'line-through text-slate-600' : 'text-slate-300 group-hover:text-white'}`}>{item.label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
