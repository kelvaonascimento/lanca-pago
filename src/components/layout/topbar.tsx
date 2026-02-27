'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  LayoutDashboard,
  Rocket,
  ListChecks,
  Calculator,
  Calendar,
  Sparkles,
  BarChart3,
  Upload,
  Settings,
  Target,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

const pageTitles: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  '/dashboard': { label: 'Dashboard', icon: LayoutDashboard },
  '/lancamentos': { label: 'Lançamentos', icon: Rocket },
  '/onboarding': { label: 'Novo Lançamento', icon: Plus },
  '/benchmarks': { label: 'Benchmarks', icon: BarChart3 },
  '/configuracoes': { label: 'Configurações', icon: Settings },
}

const subPageIcons: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  checklist: { label: 'Checklist Operacional', icon: ListChecks },
  calculadoras: { label: 'Calculadoras', icon: Calculator },
  cronograma: { label: 'Cronograma de Comunicação', icon: Calendar },
  conteudo: { label: 'Gerador de Conteúdo IA', icon: Sparkles },
  benchmarks: { label: 'Benchmarks', icon: BarChart3 },
  clickup: { label: 'Exportar para ClickUp', icon: Upload },
  lotes: { label: 'Gestão de Lotes', icon: Target },
}

interface TopbarProps {
  launchName?: string
  collapsed: boolean
  onToggle: () => void
}

export function Topbar({ launchName, collapsed, onToggle }: TopbarProps) {
  const pathname = usePathname()

  const crumbs: { label: string; href?: string; icon?: React.ComponentType<{ className?: string }> }[] = []

  if (pageTitles[pathname]) {
    const p = pageTitles[pathname]
    crumbs.push({ label: p.label, icon: p.icon })
  } else if (pathname.includes('/lancamentos/')) {
    crumbs.push({ label: 'Lançamentos', href: '/lancamentos', icon: Rocket })
    const parts = pathname.split('/')
    const idIndex = parts.indexOf('lancamentos') + 1
    const launchId = parts[idIndex]
    const subPage = parts[idIndex + 1]

    if (launchId) {
      crumbs.push({
        label: launchName || 'Lançamento',
        href: `/lancamentos/${launchId}`,
        icon: Target,
      })
    }

    if (subPage && subPageIcons[subPage]) {
      const s = subPageIcons[subPage]
      crumbs.push({ label: s.label, icon: s.icon })
    } else if (launchId && !subPage) {
      crumbs[crumbs.length - 1] = {
        label: launchName || 'Visão Geral',
        icon: Target,
      }
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-[rgba(3,7,18,0.7)] px-4 backdrop-blur-2xl">
      {/* Sidebar toggle */}
      <button
        onClick={onToggle}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
        title={collapsed ? 'Abrir menu' : 'Fechar menu'}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>

      <div className="h-5 w-px bg-white/10" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          const Icon = crumb.icon
          return (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-600" />}
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {crumb.label}
                </Link>
              ) : (
                <span className={`flex items-center gap-1.5 ${isLast ? 'font-medium text-white' : 'text-slate-400'}`}>
                  {Icon && <Icon className={`h-3.5 w-3.5 ${isLast ? 'text-violet-400' : ''}`} />}
                  {crumb.label}
                </span>
              )}
            </span>
          )
        })}
      </nav>
    </header>
  )
}
