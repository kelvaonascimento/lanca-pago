'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Rocket,
  ListChecks,
  Calculator,
  Calendar,
  BarChart3,
  Sparkles,
  Upload,
  Settings,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Lançamentos', href: '/lancamentos', icon: Rocket },
]

const launchNavigation = [
  { name: 'Visão Geral', href: '', icon: Target },
  { name: 'Checklist', href: '/checklist', icon: ListChecks },
  { name: 'Calculadoras', href: '/calculadoras', icon: Calculator },
  { name: 'Cronograma', href: '/cronograma', icon: Calendar },
  { name: 'Conteúdo IA', href: '/conteudo', icon: Sparkles },
  { name: 'Benchmarks', href: '/benchmarks', icon: BarChart3 },
  { name: 'ClickUp', href: '/clickup', icon: Upload },
]

interface SidebarProps {
  launchId?: string
}

export function Sidebar({ launchId }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[var(--sidebar-width)] flex-col border-r border-white/10 bg-[rgba(8,12,30,0.85)] backdrop-blur-2xl">
      {/* Sidebar gradient decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-r-none">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-violet-600/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 -left-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-[60px]" />
      </div>

      {/* Logo */}
      <div className="relative flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Lança Pago
        </span>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-violet-500/20 to-indigo-500/10 text-white shadow-lg shadow-violet-500/10 border border-violet-500/20'
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-white border border-transparent'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-gradient-to-b from-violet-400 to-indigo-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                )}
                <item.icon className={cn('h-4 w-4 transition-colors', isActive ? 'text-violet-400' : 'group-hover:text-white')} />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Launch sub-navigation */}
        {launchId && (
          <div className="mt-6">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Lançamento Atual
            </p>
            <div className="space-y-0.5">
              {launchNavigation.map((item) => {
                const href = `/lancamentos/${launchId}${item.href}`
                const isActive = pathname === href
                return (
                  <Link
                    key={item.name}
                    href={href}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-violet-500/15 to-transparent text-white font-medium border border-violet-500/15'
                        : 'text-slate-400 hover:bg-white/[0.06] hover:text-white border border-transparent'
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-violet-400 to-indigo-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                    )}
                    <item.icon className={cn('h-4 w-4 transition-colors', isActive ? 'text-violet-400' : 'group-hover:text-white')} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Settings */}
      <div className="relative border-t border-white/10 p-3">
        <Link
          href="/configuracoes"
          className={cn(
            'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
            pathname === '/configuracoes'
              ? 'bg-gradient-to-r from-violet-500/15 to-transparent text-white font-medium border border-violet-500/15'
              : 'text-slate-400 hover:bg-white/[0.06] hover:text-white border border-transparent'
          )}
        >
          <Settings className={cn('h-4 w-4 transition-colors', pathname === '/configuracoes' ? 'text-violet-400' : 'group-hover:text-white')} />
          Configurações
        </Link>
      </div>
    </aside>
  )
}
