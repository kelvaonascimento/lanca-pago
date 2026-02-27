'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/lancamentos': 'Lançamentos',
  '/onboarding': 'Novo Lançamento',
  '/benchmarks': 'Benchmarks',
  '/configuracoes': 'Configurações',
}

const subPageTitles: Record<string, string> = {
  checklist: 'Checklist Operacional',
  calculadoras: 'Calculadoras',
  cronograma: 'Cronograma de Comunicação',
  conteudo: 'Gerador de Conteúdo IA',
  benchmarks: 'Benchmarks',
  clickup: 'Exportar para ClickUp',
  lotes: 'Gestão de Lotes',
}

interface TopbarProps {
  launchName?: string
}

export function Topbar({ launchName }: TopbarProps) {
  const pathname = usePathname()

  const crumbs: { label: string; href?: string }[] = []

  if (pageTitles[pathname]) {
    crumbs.push({ label: pageTitles[pathname] })
  } else if (pathname.includes('/lancamentos/')) {
    crumbs.push({ label: 'Lançamentos', href: '/lancamentos' })
    const parts = pathname.split('/')
    const idIndex = parts.indexOf('lancamentos') + 1
    const launchId = parts[idIndex]
    const subPage = parts[idIndex + 1]

    if (launchId) {
      crumbs.push({
        label: launchName || 'Lançamento',
        href: `/lancamentos/${launchId}`,
      })
    }

    if (subPage && subPageTitles[subPage]) {
      crumbs.push({ label: subPageTitles[subPage] })
    } else if (launchId && !subPage) {
      crumbs[crumbs.length - 1] = {
        label: launchName || 'Visão Geral',
      }
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-white/10 bg-[rgba(3,7,18,0.7)] px-6 backdrop-blur-2xl">
      <nav className="flex items-center gap-2 text-sm">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-600" />}
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-white' : 'text-slate-400'}>
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
