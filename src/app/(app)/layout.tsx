'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const launchId = params?.id as string | undefined
  const [launchName, setLaunchName] = useState<string>('')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (launchId) {
      fetch(`/api/launches/${launchId}`)
        .then((r) => r.json())
        .then((data) => setLaunchName(data.name || ''))
        .catch(() => {})
    } else {
      setLaunchName('')
    }
  }, [launchId])

  return (
    <div className="min-h-screen bg-[#030712] relative">
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-[160px] opacity-60"
          style={{
            top: '-10%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-50"
          style={{
            bottom: '-5%',
            right: '5%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-40"
          style={{
            top: '40%',
            right: '20%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
            animation: 'float 30s ease-in-out infinite',
          }}
        />
      </div>

      <Sidebar launchId={launchId} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className="relative z-10 transition-all duration-300"
        style={{ paddingLeft: collapsed ? 68 : 272 }}
      >
        <Topbar launchName={launchName} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
