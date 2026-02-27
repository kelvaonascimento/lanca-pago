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
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
  collapsed: boolean
  onToggle: () => void
}

function NavLink({ href, icon: Icon, label, isActive, collapsed }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; isActive: boolean; collapsed: boolean }) {
  const content = (
    <Link
      href={href}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
        collapsed && 'justify-center px-0',
        isActive
          ? 'bg-gradient-to-r from-violet-500/20 to-indigo-500/10 text-white shadow-lg shadow-violet-500/10 border border-violet-500/20'
          : 'text-slate-400 hover:bg-white/[0.06] hover:text-white border border-transparent'
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-gradient-to-b from-violet-400 to-indigo-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
      )}
      <Icon className={cn('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-violet-400' : 'group-hover:text-white')} />
      {!collapsed && label}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

export function Sidebar({ launchId, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/10 bg-[rgba(8,12,30,0.85)] backdrop-blur-2xl transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-[var(--sidebar-width)]'
        )}
      >
        {/* Sidebar gradient decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-r-none">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-violet-600/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-20 -left-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-[60px]" />
        </div>

        {/* Logo */}
        <div className={cn('relative z-10 flex h-16 items-center gap-3 border-b border-white/10', collapsed ? 'justify-center px-2' : 'px-5')}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Lança Pago
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn('relative z-10 flex-1 overflow-y-auto py-4', collapsed ? 'px-2' : 'px-3')}>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <NavLink
                  key={item.name}
                  href={item.href}
                  icon={item.icon}
                  label={item.name}
                  isActive={isActive}
                  collapsed={collapsed}
                />
              )
            })}
          </div>

          {/* Launch sub-navigation */}
          {launchId && (
            <div className="mt-6">
              {!collapsed && (
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Lançamento Atual
                </p>
              )}
              {collapsed && <div className="mb-3 mx-2 border-t border-white/10" />}
              <div className="space-y-0.5">
                {launchNavigation.map((item) => {
                  const href = `/lancamentos/${launchId}${item.href}`
                  const isActive = pathname === href
                  return (
                    <NavLink
                      key={item.name}
                      href={href}
                      icon={item.icon}
                      label={item.name}
                      isActive={isActive}
                      collapsed={collapsed}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Bottom: Settings + Toggle */}
        <div className={cn('relative z-10 border-t border-white/10 p-3 space-y-1', collapsed && 'px-2')}>
          <NavLink
            href="/configuracoes"
            icon={Settings}
            label="Configurações"
            isActive={pathname === '/configuracoes'}
            collapsed={collapsed}
          />

          {/* Toggle button */}
          <button
            onClick={onToggle}
            className={cn(
              'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/[0.06] hover:text-white transition-all duration-200 cursor-pointer border border-transparent',
              collapsed && 'justify-center px-0'
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 shrink-0" />
                Fechar menu
              </>
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
