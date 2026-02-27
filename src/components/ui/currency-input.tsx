'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  className?: string
  placeholder?: string
}

export function CurrencyInput({ value, onChange, className, placeholder }: CurrencyInputProps) {
  const [focused, setFocused] = useState(false)
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!focused) {
      setDisplay(value > 0 ? formatNumber(value) : '')
    }
  }, [value, focused])

  function formatNumber(val: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val)
  }

  function handleFocus() {
    setFocused(true)
    setDisplay(value > 0 ? String(value) : '')
  }

  function handleBlur() {
    setFocused(false)
    const parsed = parseFloat(display.replace(/\./g, '').replace(',', '.')) || 0
    onChange(parsed)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDisplay(e.target.value)
  }

  return (
    <div className={cn(
      'flex items-center h-10 rounded-xl border border-white/10 bg-white/[0.05] transition-all',
      focused && 'border-violet-500/50 ring-2 ring-violet-500/20 bg-white/[0.08]',
      className
    )}>
      <span className="pl-3.5 text-sm text-slate-500 select-none font-medium">R$</span>
      <input
        type="text"
        inputMode="decimal"
        value={display}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder || '0'}
        className="flex-1 h-full bg-transparent px-2 text-sm text-white placeholder:text-slate-600 focus:outline-none"
      />
    </div>
  )
}
