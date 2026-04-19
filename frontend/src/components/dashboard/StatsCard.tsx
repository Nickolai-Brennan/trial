import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; positive: boolean }
  className?: string
  children?: ReactNode
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="rounded-lg bg-brand-50 p-2">
          <Icon className="h-5 w-5 text-brand-600" />
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {trend && (
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trend.positive ? 'text-green-600' : 'text-red-500'
          )}
        >
          <span>{trend.positive ? '↑' : '↓'}</span>
          <span>
            {Math.abs(trend.value)}% vs last period
          </span>
        </div>
      )}
    </div>
  )
}
