'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Rocket, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { NICHES, EVENT_PLATFORMS, type LaunchFormData, type BatchConfig } from '@/types/launch'
import { calculateMaxCpa, calculatePacing, calculateAvgTicket, generateBatches, calculateProjection } from '@/lib/formulas'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { toast } from 'sonner'

const STEPS = [
  { title: 'Sobre o Projeto', description: 'Informações básicas do lançamento' },
  { title: 'Meta & Orçamento', description: 'Defina metas e investimento' },
  { title: 'Produto & Ofertas', description: 'Configure oferta e order bumps' },
  { title: 'Lotes & Escassez', description: 'Estratégia de lotes progressivos' },
  { title: 'Tema & Narrativa', description: 'Big Idea e posicionamento' },
]

const defaultForm: LaunchFormData = {
  name: '',
  niche: '',
  expert: '',
  followers: 0,
  targetTickets: 500,
  budget: 50000,
  saleDays: 15,
  eventDate: '',
  eventDuration: 3,
  eventPlatform: 'zoom',
  mainProduct: { name: '', price: 997 },
  orderBumps: {
    gravacoes: { enabled: true, price: 197, hasCashback: true, cashbackAmount: 197 },
    debriefing: { enabled: false, price: 97 },
    materiais: { enabled: false, price: 47 },
    combo: { enabled: false, price: 297 },
  },
  downsell: { enabled: false, name: '', price: 497 },
  tripwire: { enabled: false, name: '', price: 19.90 },
  batches: [],
  bigIdea: '',
  narrative: '',
  theme: '',
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<LaunchFormData>(defaultForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-generate batches when we reach step 3
  const batches = useMemo(() => {
    if (form.batches.length > 0) return form.batches
    const avgPrice = 97
    return generateBatches(avgPrice, form.targetTickets, 7)
  }, [form.batches, form.targetTickets])

  // Live metrics
  const metrics = useMemo(() => {
    const trafficTickets = Math.round(form.targetTickets * 0.7) // 70% via tráfego
    const cpa = calculateMaxCpa(form.budget, trafficTickets)
    const pacing = calculatePacing(form.targetTickets, form.saleDays)
    const avgTicket = calculateAvgTicket(batches)
    const projection = calculateProjection(
      form.targetTickets,
      avgTicket,
      form.budget,
      form.orderBumps.gravacoes.enabled ? 0.25 : 0,
      form.orderBumps.gravacoes.price,
      0.25,
      form.mainProduct.price,
      form.downsell.enabled ? 0.10 : 0,
      form.downsell.price,
    )
    return { cpa, pacing, avgTicket, projection }
  }, [form, batches])

  const updateForm = (updates: Partial<LaunchFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }))
  }

  const canProceed = () => {
    switch (step) {
      case 0: return form.name && form.niche && form.expert
      case 1: return form.targetTickets > 0 && form.budget > 0 && form.eventDate
      case 2: return form.mainProduct.name && form.mainProduct.price > 0
      case 3: return batches.length > 0
      case 4: return true
      default: return false
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/launches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, batches }),
      })
      if (!res.ok) throw new Error('Erro ao criar lançamento')
      const { id } = await res.json()
      toast.success('Lançamento criado com sucesso!')
      router.push(`/lancamentos/${id}`)
    } catch {
      toast.error('Erro ao criar lançamento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Novo Lançamento</h2>
          <span className="text-sm text-muted-foreground">Passo {step + 1} de {STEPS.length}</span>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} />
        <div className="flex justify-between mt-2">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => i < step && setStep(i)}
              className={`text-xs ${i <= step ? 'text-primary font-medium' : 'text-muted-foreground'} ${i < step ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{STEPS[step].title}</CardTitle>
                  <CardDescription>{STEPS[step].description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {step === 0 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome do Lançamento *</Label>
                        <Input id="name" placeholder="Ex: Imersão Cripto 2026" value={form.name} onChange={(e) => updateForm({ name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="niche">Nicho *</Label>
                        <Select value={form.niche} onValueChange={(v) => updateForm({ niche: v })}>
                          <SelectTrigger><SelectValue placeholder="Selecione o nicho" /></SelectTrigger>
                          <SelectContent>
                            {NICHES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expert">Nome do Expert *</Label>
                        <Input id="expert" placeholder="Ex: João Silva" value={form.expert} onChange={(e) => updateForm({ expert: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="followers">Seguidores no Instagram</Label>
                        <Input id="followers" type="number" placeholder="0" value={form.followers || ''} onChange={(e) => updateForm({ followers: Number(e.target.value) })} />
                        <p className="text-xs text-muted-foreground">Cases com 3.000 seguidores já venderam 500+ ingressos com tráfego pago</p>
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Meta de Ingressos *</Label>
                          <Input type="number" value={form.targetTickets} onChange={(e) => updateForm({ targetTickets: Number(e.target.value) })} />
                          <p className="text-xs text-muted-foreground">Benchmark: 300-5.000 ingressos</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Orçamento Total (R$) *</Label>
                          <Input type="number" value={form.budget} onChange={(e) => updateForm({ budget: Number(e.target.value) })} />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Dias de Venda</Label>
                          <Input type="number" value={form.saleDays} onChange={(e) => updateForm({ saleDays: Number(e.target.value) })} />
                          <p className="text-xs text-muted-foreground">Recomendado: 12-20 dias</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Data do Evento *</Label>
                          <Input type="date" value={form.eventDate} onChange={(e) => updateForm({ eventDate: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Duração do Evento (horas)</Label>
                          <Input type="number" value={form.eventDuration} onChange={(e) => updateForm({ eventDuration: Number(e.target.value) })} />
                          <p className="text-xs text-muted-foreground">Mínimo 3h. Eventos &lt;16h devem evitar sábado.</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Plataforma do Evento</Label>
                          <Select value={form.eventPlatform} onValueChange={(v) => updateForm({ eventPlatform: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {EVENT_PLATFORMS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="space-y-4">
                        <h4 className="font-medium">Produto Principal (High Ticket)</h4>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Nome do Produto *</Label>
                            <Input placeholder="Ex: Mentoria Cripto Avançada" value={form.mainProduct.name} onChange={(e) => updateForm({ mainProduct: { ...form.mainProduct, name: e.target.value } })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Preço (R$) *</Label>
                            <Input type="number" value={form.mainProduct.price} onChange={(e) => updateForm({ mainProduct: { ...form.mainProduct, price: Number(e.target.value) } })} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Order Bumps</h4>
                        <p className="text-xs text-muted-foreground">
                          IMPORTANTE: Use &quot;Acesso em formato de aulas&quot; ao invés de &quot;replay&quot; (6.5% vs 1.1% de conversão)
                        </p>

                        {/* Gravações */}
                        <div className="rounded-lg border p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Acesso em Formato de Aulas</p>
                              <p className="text-xs text-muted-foreground">Gravações do evento (principal order bump)</p>
                            </div>
                            <Switch checked={form.orderBumps.gravacoes.enabled} onCheckedChange={(v) => updateForm({ orderBumps: { ...form.orderBumps, gravacoes: { ...form.orderBumps.gravacoes, enabled: v } } })} />
                          </div>
                          {form.orderBumps.gravacoes.enabled && (
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="space-y-1">
                                <Label className="text-xs">Preço (R$)</Label>
                                <Input type="number" value={form.orderBumps.gravacoes.price} onChange={(e) => updateForm({ orderBumps: { ...form.orderBumps, gravacoes: { ...form.orderBumps.gravacoes, price: Number(e.target.value) } } })} />
                              </div>
                              <div className="flex items-center gap-2 pt-4">
                                <Switch checked={form.orderBumps.gravacoes.hasCashback} onCheckedChange={(v) => updateForm({ orderBumps: { ...form.orderBumps, gravacoes: { ...form.orderBumps.gravacoes, hasCashback: v } } })} />
                                <Label className="text-xs">Cashback no produto principal</Label>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Debriefing */}
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Debriefing</p>
                              <p className="text-xs text-muted-foreground">Sessão extra de perguntas e respostas</p>
                            </div>
                            <Switch checked={form.orderBumps.debriefing.enabled} onCheckedChange={(v) => updateForm({ orderBumps: { ...form.orderBumps, debriefing: { ...form.orderBumps.debriefing, enabled: v } } })} />
                          </div>
                          {form.orderBumps.debriefing.enabled && (
                            <div className="mt-3">
                              <Label className="text-xs">Preço (R$)</Label>
                              <Input type="number" value={form.orderBumps.debriefing.price} onChange={(e) => updateForm({ orderBumps: { ...form.orderBumps, debriefing: { ...form.orderBumps.debriefing, price: Number(e.target.value) } } })} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Downsell */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Downsell</h4>
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Produto de Downsell</p>
                              <p className="text-xs text-muted-foreground">Opção mais acessível para quem não comprar o high ticket</p>
                            </div>
                            <Switch checked={form.downsell.enabled} onCheckedChange={(v) => updateForm({ downsell: { ...form.downsell, enabled: v } })} />
                          </div>
                          {form.downsell.enabled && (
                            <div className="grid gap-3 sm:grid-cols-2 mt-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Nome</Label>
                                <Input value={form.downsell.name} onChange={(e) => updateForm({ downsell: { ...form.downsell, name: e.target.value } })} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Preço (R$)</Label>
                                <Input type="number" value={form.downsell.price} onChange={(e) => updateForm({ downsell: { ...form.downsell, price: Number(e.target.value) } })} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tripwire */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Tripwire (Low Ticket)</h4>
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Tripwire de Qualificação</p>
                              <p className="text-xs text-muted-foreground">R$10-27 — qualifica leads 22x mais. Recomendado!</p>
                            </div>
                            <Switch checked={form.tripwire.enabled} onCheckedChange={(v) => updateForm({ tripwire: { ...form.tripwire, enabled: v } })} />
                          </div>
                          {form.tripwire.enabled && (
                            <div className="grid gap-3 sm:grid-cols-2 mt-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Nome</Label>
                                <Input value={form.tripwire.name} onChange={(e) => updateForm({ tripwire: { ...form.tripwire, name: e.target.value } })} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Preço (R$)</Label>
                                <Input type="number" value={form.tripwire.price} onChange={(e) => updateForm({ tripwire: { ...form.tripwire, price: Number(e.target.value) } })} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Os lotes criam escassez progressiva. O preço aumenta conforme os lotes esgotam.
                        Ajuste os preços e quantidades abaixo.
                      </p>
                      <div className="space-y-4">
                        {batches.map((batch, i) => (
                          <div key={i} className="rounded-lg border p-4">
                            <div className="flex items-center justify-between mb-3">
                              <p className="font-medium">{batch.name}</p>
                              <Badge variant="secondary">
                                {formatCurrency(batch.price * batch.quantity)}
                              </Badge>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-xs">Preço (R$)</Label>
                                <div className="flex items-center gap-3">
                                  <Slider
                                    value={[batch.price]}
                                    min={27}
                                    max={997}
                                    step={10}
                                    onValueChange={([v]) => {
                                      const newBatches = [...batches]
                                      newBatches[i] = { ...newBatches[i], price: v }
                                      updateForm({ batches: newBatches })
                                    }}
                                    className="flex-1"
                                  />
                                  <span className="text-sm font-medium w-20 text-right">{formatCurrency(batch.price)}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Quantidade</Label>
                                <div className="flex items-center gap-3">
                                  <Slider
                                    value={[batch.quantity]}
                                    min={10}
                                    max={500}
                                    step={10}
                                    onValueChange={([v]) => {
                                      const newBatches = [...batches]
                                      newBatches[i] = { ...newBatches[i], quantity: v }
                                      updateForm({ batches: newBatches })
                                    }}
                                    className="flex-1"
                                  />
                                  <span className="text-sm font-medium w-16 text-right">{batch.quantity}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <div className="space-y-2">
                        <Label>Big Idea</Label>
                        <Textarea
                          placeholder="Qual é a grande promessa/transformação do seu evento?"
                          value={form.bigIdea}
                          onChange={(e) => updateForm({ bigIdea: e.target.value })}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">A Big Idea é o conceito central que diferencia seu evento</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Narrativa</Label>
                        <Textarea
                          placeholder="Qual história você vai contar? Qual a jornada do participante?"
                          value={form.narrative}
                          onChange={(e) => updateForm({ narrative: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tema do Evento (opcional)</Label>
                        <Input
                          placeholder="Ex: Black Friday, Ano Novo, Semana da..."
                          value={form.theme}
                          onChange={(e) => updateForm({ theme: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Eventos temáticos facilitam a venda e a narrativa de urgência</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>Criando...</>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Criar Lançamento
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Metrics Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Métricas em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">CPA Máximo</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(metrics.cpa.maxCpa)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pacing Diário</p>
                <p className="text-xl font-bold">{metrics.pacing.pacingTotal} ingressos/dia</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ticket Médio</p>
                <p className="text-xl font-bold">{formatCurrency(metrics.avgTicket)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Projeção de Faturamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.projection.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-sm font-semibold">{formatCurrency(s.totalRevenue)}</p>
                  </div>
                  <Badge variant={s.label === 'Otimista' ? 'success' : s.label === 'Pessimista' ? 'warning' : 'default'}>
                    {s.roas.toFixed(1)}x
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Resumo da Configuração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {form.name && <div className="flex justify-between"><span className="text-muted-foreground">Nome</span><span className="font-medium">{form.name}</span></div>}
              {form.niche && <div className="flex justify-between"><span className="text-muted-foreground">Nicho</span><span className="font-medium">{form.niche}</span></div>}
              {form.targetTickets > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Meta</span><span className="font-medium">{formatNumber(form.targetTickets)} ingressos</span></div>}
              {form.budget > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Orçamento</span><span className="font-medium">{formatCurrency(form.budget)}</span></div>}
              {form.mainProduct.name && <div className="flex justify-between"><span className="text-muted-foreground">Produto</span><span className="font-medium">{formatCurrency(form.mainProduct.price)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Lotes</span><span className="font-medium">{batches.length}</span></div>
              {form.orderBumps.gravacoes.enabled && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gravações</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{formatCurrency(form.orderBumps.gravacoes.price)}</span>
                    {form.orderBumps.gravacoes.hasCashback && <Badge variant="success" className="text-[10px] px-1">CB</Badge>}
                  </div>
                </div>
              )}
              {form.tripwire.enabled && <div className="flex justify-between"><span className="text-muted-foreground">Tripwire</span><span className="font-medium">{formatCurrency(form.tripwire.price)}</span></div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
