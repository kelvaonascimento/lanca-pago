import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-violet-400/30 bg-violet-500/15 text-violet-300',
        secondary: 'border-white/10 bg-white/[0.06] text-slate-300',
        destructive: 'border-red-400/30 bg-red-500/15 text-red-300',
        success: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300',
        warning: 'border-amber-400/30 bg-amber-500/15 text-amber-300',
        outline: 'border-white/15 text-slate-200',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
