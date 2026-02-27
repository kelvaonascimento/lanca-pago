'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { TrendingUp, DollarSign, Target, Layers, BarChart3, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { CurrencyInput } from '@/components/ui/currency-input'
import {
  calculateMaxCpa,
  calculatePacing,
  calculateProjection,
  calculateCashback,
  calculateRoas,
} from '@/lib/formulas'
import { formatCurrency, formatNumber } from '@/lib/utils'

/* ── Design tokens ── */
const colors = {
  pessimista: { border: 'border-amber-500/20', bg: 'bg-amber-500/[0.04]', text: 'text-amber-400', badge: 'warning' as const, icon: ArrowDownRight },
  realista: { border: 'border-violet-500/20', bg: 'bg-violet-500/[0.04]', text: 'text-violet-400', badge: 'default' as const, icon: Minus },
  otimista: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.04]', text: 'text-emerald-400', badge: 'success' as const, icon: ArrowUpRight },
}

const calcs = {
  projecao: { icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10', gradient: 'from-violet-400 to-indigo-400' },
  cpa: { icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/10', gradient: 'from-amber-400 to-orange-400' },
  pacing: { icon: BarChart3, color: 'text-cyan-400', bg: 'bg-cyan-500/10', gradient: 'from-cyan-400 to-blue-400' },
  cashback: { icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', gradient: 'from-emerald-400 to-green-400' },
  roas: { icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-500/10', gradient: 'from-indigo-400 to-violet-400' },
}

/* ── Helpers ── */
function ResultRow({ label, value, bold, color }: { label: string; value: string; bold?: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[13px] text-slate-500">{label}</span>
      <span className={`text-[13px] font-medium tabular-nums ${bold ? 'font-bold text-[15px]' : ''} ${color || 'text-slate-200'}`}>{value}</span>
    </div>
  )
}

function BigNumber({ label, value, gradient, sub }: { label: string; value: string; gradient: string; sub?: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-5xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent tabular-nums`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1.5">{sub}</p>}
    </div>
  )
}

function SectionHeader({ calc, title, desc }: { calc: keyof typeof calcs; title: string; desc: string }) {
  const c = calcs[calc]
  const Icon = c.icon
  return (
    <CardHeader className="pb-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
          <Icon className={`h-4 w-4 ${c.color}`} />
        </div>
        <div>
          <CardTitle className="text-[15px] font-semibold">{title}</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        </div>
      </div>
    </CardHeader>
  )
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function SliderField({ label, value, min, max, step, onChange, color }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; color?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="pt-2 pb-1">
        <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
      </div>
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-600">{min}%</span>
        <span className={`font-semibold ${color || 'text-violet-400'}`}>{value}%</span>
        <span className="text-slate-600">{max}%</span>
      </div>
    </div>
  )
}

export default function CalculadorasPage() {
  const { id } = useParams<{ id: string }>()
  const [launch, setLaunch] = useState<Record<string, unknown> | null>(null)

  const [cpaData, setCpaData] = useState({ budget: 50000, tickets: 350 })
  const [pacingData, setPacingData] = useState({ target: 500, days: 15 })
  const [projData, setProjData] = useState({ tickets: 500, avgTicket: 147, budget: 50000, obRate: 25, obPrice: 197, prodConv: 25, prodPrice: 997, dsConv: 10, dsPrice: 497 })
  const [cashbackData, setCashbackData] = useState({ recPrice: 197, prodPrice: 997, tickets: 1000, baseConv: 25 })
  const [roasData, setRoasData] = useState({ investment: 50000, ticketRev: 73500, obRev: 24625, prodRev: 81506, dsRev: 16141 })

  useEffect(() => {
    if (id) {
      fetch(`/api/launches/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setLaunch(data)
          if (data.budget) setCpaData((p) => ({ ...p, budget: data.budget }))
          if (data.targetTickets) {
            setPacingData((p) => ({ ...p, target: data.targetTickets }))
            setProjData((p) => ({ ...p, tickets: data.targetTickets, budget: data.budget }))
            setCashbackData((p) => ({ ...p, tickets: data.targetTickets }))
            setRoasData((p) => ({ ...p, investment: data.budget }))
          }
          if (data.saleDays) setPacingData((p) => ({ ...p, days: data.saleDays }))
        })
    }
  }, [id])

  const cpaResult = useMemo(() => calculateMaxCpa(cpaData.budget, cpaData.tickets), [cpaData])
  const pacingResult = useMemo(() => calculatePacing(pacingData.target, pacingData.days), [pacingData])
  const projResult = useMemo(() =>
    calculateProjection(projData.tickets, projData.avgTicket, projData.budget, projData.obRate / 100, projData.obPrice, projData.prodConv / 100, projData.prodPrice, projData.dsConv / 100, projData.dsPrice),
    [projData]
  )
  const cashbackResult = useMemo(() => calculateCashback(cashbackData.recPrice, cashbackData.prodPrice, cashbackData.tickets, cashbackData.baseConv / 100), [cashbackData])
  const roasResult = useMemo(() => calculateRoas(roasData.investment, roasData.ticketRev, roasData.obRev, roasData.prodRev, roasData.dsRev), [roasData])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="projecao">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="projecao">Projeção</TabsTrigger>
          <TabsTrigger value="cpa">CPA Máximo</TabsTrigger>
          <TabsTrigger value="pacing">Pacing</TabsTrigger>
          <TabsTrigger value="cashback">Cashback</TabsTrigger>
          <TabsTrigger value="roas">ROAS</TabsTrigger>
        </TabsList>

        {/* ════════════ Projeção ════════════ */}
        <TabsContent value="projecao">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <SectionHeader calc="projecao" title="Projeção de Faturamento" desc="3 cenários: pessimista, realista e otimista" />
              <CardContent className="space-y-5">
                <FieldGroup>
                  <Field label="Meta de Ingressos">
                    <Input type="number" value={projData.tickets} onChange={(e) => setProjData({ ...projData, tickets: Number(e.target.value) })} />
                  </Field>
                  <Field label="Ticket Médio">
                    <CurrencyInput value={projData.avgTicket} onChange={(v) => setProjData({ ...projData, avgTicket: v })} />
                  </Field>
                  <Field label="Orçamento">
                    <CurrencyInput value={projData.budget} onChange={(v) => setProjData({ ...projData, budget: v })} />
                  </Field>
                  <Field label="Produto Principal">
                    <CurrencyInput value={projData.prodPrice} onChange={(v) => setProjData({ ...projData, prodPrice: v })} />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <SliderField label="Conversão Produto" value={projData.prodConv} min={5} max={40} step={1} onChange={(v) => setProjData({ ...projData, prodConv: v })} />
                  <SliderField label="Order Bump Rate" value={projData.obRate} min={0} max={50} step={1} onChange={(v) => setProjData({ ...projData, obRate: v })} />
                </FieldGroup>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {projResult.map((scenario) => {
                const key = scenario.label.toLowerCase() as keyof typeof colors
                const style = colors[key] || colors.realista
                const Icon = style.icon
                return (
                  <Card key={scenario.label} className={`${style.border} ${style.bg}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-3.5 w-3.5 ${style.text}`} />
                          <h4 className="text-[13px] font-semibold uppercase tracking-wide">{scenario.label}</h4>
                        </div>
                        <Badge variant={style.badge} className="text-[11px]">
                          ROAS {scenario.roas.toFixed(1)}x
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 divide-y divide-white/[0.04]">
                        <ResultRow label="Ingressos" value={formatNumber(scenario.tickets)} />
                        <ResultRow label="Receita Ingr." value={formatCurrency(scenario.ticketRevenue)} />
                        <ResultRow label="Order Bumps" value={formatCurrency(scenario.orderBumpRevenue)} />
                        <ResultRow label="Produto" value={formatCurrency(scenario.productRevenue)} />
                        <ResultRow label="Downsell" value={formatCurrency(scenario.downsellRevenue)} />
                        <ResultRow label="Lucro" value={formatCurrency(scenario.profit)} color={scenario.profit > 0 ? 'text-emerald-400' : 'text-red-400'} bold />
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-slate-500 uppercase tracking-wide">Total</span>
                        <span className="text-lg font-bold tabular-nums">{formatCurrency(scenario.totalRevenue)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>

        {/* ════════════ CPA Máximo ════════════ */}
        <TabsContent value="cpa">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <SectionHeader calc="cpa" title="CPA Máximo" desc="Orçamento de vendas ÷ Ingressos via tráfego" />
              <CardContent className="space-y-5">
                <Field label="Orçamento de Vendas">
                  <CurrencyInput value={cpaData.budget} onChange={(v) => setCpaData({ ...cpaData, budget: v })} />
                </Field>
                <p className="text-[11px] text-slate-600 -mt-3">82% do orçamento total vai para vendas diretas</p>
                <Field label="Ingressos via Tráfego">
                  <Input type="number" value={cpaData.tickets} onChange={(e) => setCpaData({ ...cpaData, tickets: Number(e.target.value) })} />
                </Field>
                <p className="text-[11px] text-slate-600 -mt-3">~70% dos ingressos vêm do tráfego pago</p>
              </CardContent>
            </Card>

            <Card className="border-amber-500/15">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BigNumber label="Seu CPA Máximo" value={formatCurrency(cpaResult.maxCpa)} gradient={calcs.cpa.gradient} />
                <p className="text-[11px] text-slate-600 mt-5 text-center max-w-[260px] leading-relaxed">
                  Se o CPA ultrapassar esse valor por 2+ dias, pause os criativos
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-[280px]">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5 text-center">
                    <p className="text-[10px] text-slate-600 uppercase tracking-wide mb-1">CPA Início</p>
                    <p className="font-bold text-sm tabular-nums">R$ 15,00 – 28,00</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5 text-center">
                    <p className="text-[10px] text-slate-600 uppercase tracking-wide mb-1">CPA Meio</p>
                    <p className="font-bold text-sm tabular-nums">R$ 40,00 – 50,00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ════════════ Pacing ════════════ */}
        <TabsContent value="pacing">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <SectionHeader calc="pacing" title="Pacing Diário" desc="Meta de ingressos ÷ Dias de venda" />
              <CardContent className="space-y-5">
                <Field label="Meta de Ingressos">
                  <Input type="number" value={pacingData.target} onChange={(e) => setPacingData({ ...pacingData, target: Number(e.target.value) })} />
                </Field>
                <Field label="Dias de Venda">
                  <Input type="number" value={pacingData.days} onChange={(e) => setPacingData({ ...pacingData, days: Number(e.target.value) })} />
                </Field>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/15">
              <CardContent className="space-y-8 py-10">
                <BigNumber label="Pacing Total" value={String(pacingResult.pacingTotal)} gradient={calcs.pacing.gradient} sub="ingressos/dia" />
                <BigNumber label="Pacing Dias Úteis" value={String(pacingResult.pacingBusiness)} gradient="from-slate-200 to-slate-400" sub="ingressos/dia útil" />
                <div className="text-center rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 mx-6">
                  <p className="text-xs text-slate-500">{pacingResult.totalDays} dias totais · {pacingResult.businessDays} dias úteis</p>
                  <p className="mt-2 text-[11px] text-slate-600">Se pacing 20% abaixo: escalar tráfego ou criar promoção</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ════════════ Cashback ════════════ */}
        <TabsContent value="cashback">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <SectionHeader calc="cashback" title="Simulador de Cashback" desc="Impacto do cashback das gravações na conversão" />
              <CardContent className="space-y-5">
                <FieldGroup>
                  <Field label="Preço Gravações">
                    <CurrencyInput value={cashbackData.recPrice} onChange={(v) => setCashbackData({ ...cashbackData, recPrice: v })} />
                  </Field>
                  <Field label="Preço Produto">
                    <CurrencyInput value={cashbackData.prodPrice} onChange={(v) => setCashbackData({ ...cashbackData, prodPrice: v })} />
                  </Field>
                  <Field label="Total Ingressos">
                    <Input type="number" value={cashbackData.tickets} onChange={(e) => setCashbackData({ ...cashbackData, tickets: Number(e.target.value) })} />
                  </Field>
                </FieldGroup>
                <SliderField label="Conversão Base" value={cashbackData.baseConv} min={5} max={40} step={1} onChange={(v) => setCashbackData({ ...cashbackData, baseConv: v })} color="text-emerald-400" />
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-white/[0.06]">
                  <CardContent className="p-4">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Sem Cashback</h4>
                    <div className="divide-y divide-white/[0.04]">
                      <ResultRow label="Preço efetivo" value={formatCurrency(cashbackResult.withoutCashback.effectivePrice)} />
                      <ResultRow label="Conversão" value={`${cashbackResult.withoutCashback.estimatedConversion.toFixed(1)}%`} />
                      <ResultRow label="Vendas est." value={String(cashbackResult.withoutCashback.estimatedSales)} />
                    </div>
                    <div className="pt-3 mt-1 border-t border-white/10">
                      <ResultRow label="Receita" value={formatCurrency(cashbackResult.withoutCashback.revenue)} bold />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-500/20 bg-emerald-500/[0.03]">
                  <CardContent className="p-4">
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-3">Com Cashback</h4>
                    <div className="divide-y divide-white/[0.04]">
                      <ResultRow label="Preço efetivo" value={formatCurrency(cashbackResult.withCashback.effectivePrice)} />
                      <ResultRow label="Conversão" value={`${cashbackResult.withCashback.estimatedConversion.toFixed(1)}%`} />
                      <ResultRow label="Vendas est." value={String(cashbackResult.withCashback.estimatedSales)} />
                    </div>
                    <div className="pt-3 mt-1 border-t border-white/10">
                      <ResultRow label="Receita" value={formatCurrency(cashbackResult.withCashback.revenue)} bold color="text-emerald-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-emerald-500/15 bg-emerald-500/[0.03]">
                <CardContent className="py-6 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Uplift estimado</p>
                  <p className="text-4xl font-bold text-emerald-400 mt-1 tabular-nums">+{cashbackResult.uplift.toFixed(0)}%</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ════════════ ROAS ════════════ */}
        <TabsContent value="roas">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <SectionHeader calc="roas" title="Composição ROAS" desc="Receita total vs investimento" />
              <CardContent className="space-y-5">
                <Field label="Investimento Total">
                  <CurrencyInput value={roasData.investment} onChange={(v) => setRoasData({ ...roasData, investment: v })} />
                </Field>
                <Field label="Receita Ingressos">
                  <CurrencyInput value={roasData.ticketRev} onChange={(v) => setRoasData({ ...roasData, ticketRev: v })} />
                </Field>
                <Field label="Receita Order Bumps">
                  <CurrencyInput value={roasData.obRev} onChange={(v) => setRoasData({ ...roasData, obRev: v })} />
                </Field>
                <Field label="Receita Produto Principal">
                  <CurrencyInput value={roasData.prodRev} onChange={(v) => setRoasData({ ...roasData, prodRev: v })} />
                </Field>
                <Field label="Receita Downsell">
                  <CurrencyInput value={roasData.dsRev} onChange={(v) => setRoasData({ ...roasData, dsRev: v })} />
                </Field>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/15">
              <CardContent className="space-y-6 py-10">
                <BigNumber
                  label="ROAS Total"
                  value={`${roasResult.roas.toFixed(1)}x`}
                  gradient={roasResult.roas >= 5 ? 'from-emerald-400 to-green-400' : roasResult.roas >= 3 ? 'from-amber-400 to-orange-400' : 'from-red-400 to-rose-400'}
                />
                <div className="mx-6 divide-y divide-white/[0.04]">
                  <ResultRow label="Receita Total" value={formatCurrency(roasResult.totalRevenue)} bold />
                  <ResultRow label="Investimento" value={formatCurrency(roasResult.investment)} />
                  <ResultRow label="Lucro" value={formatCurrency(roasResult.profit)} bold color={roasResult.profit > 0 ? 'text-emerald-400' : 'text-red-400'} />
                  <ResultRow label="Margem" value={`${roasResult.margin.toFixed(1)}%`} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
