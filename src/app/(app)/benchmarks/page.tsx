import { BarChart3, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { CASE_STUDIES } from '@/data/cases'
import { VALIDATED_NICHES } from '@/data/benchmarks'

export default function BenchmarksGlobalPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Cases & Benchmarks</h2>
        <p className="text-muted-foreground mt-1">Referências reais de lançamentos pagos pela metodologia Willian Baldan</p>
      </div>

      {/* Cases */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{CASE_STUDIES.length} Cases Reais</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.map((cs) => (
            <Card key={cs.id} className="hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{cs.name}</CardTitle>
                  {cs.roas > 0 && (
                    <Badge variant={cs.roas >= 10 ? 'success' : cs.roas >= 5 ? 'default' : 'warning'}>
                      {cs.roas.toFixed(1)}x
                    </Badge>
                  )}
                </div>
                <CardDescription>{cs.niche}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {cs.investment > 0 && <div><span className="text-muted-foreground">Investido</span><p className="font-medium">{formatCurrency(cs.investment)}</p></div>}
                  {cs.revenue > 0 && <div><span className="text-muted-foreground">Faturou</span><p className="font-medium text-success">{formatCurrency(cs.revenue)}</p></div>}
                  {cs.tickets > 0 && <div><span className="text-muted-foreground">Ingressos</span><p className="font-medium">{cs.tickets}</p></div>}
                  {cs.conversion > 0 && <div><span className="text-muted-foreground">Conversão</span><p className="font-medium">{cs.conversion}%</p></div>}
                </div>
                {cs.highlights.length > 0 && (
                  <div className="mt-3 pt-3 border-t space-y-1">
                    {cs.highlights.slice(0, 2).map((h, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {h}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Nichos */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{VALIDATED_NICHES.length} Nichos Validados</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {VALIDATED_NICHES.map((n) => (
            <Card key={n.niche}>
              <CardContent className="flex items-center gap-3 p-4">
                <Target className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-sm">{n.niche}</p>
                  <p className="text-xs text-muted-foreground">{n.result}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
