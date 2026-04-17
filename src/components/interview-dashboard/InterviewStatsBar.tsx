import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export type Stat = {
    label: string
    value: string | number
    sub?: string
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
    tag?: string
}

type Props = {
    stats: Stat[]
}

export function InterviewStatsBar({ stats }: Props) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-neutral-200 dark:border-neutral-800 divide-x divide-y lg:divide-y-0 divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950 transition-colors duration-300">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className="relative px-5 py-4 group hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors duration-150"
                >
                    {/* Blue left accent on first item only */}
                    {i === 0 && (
                        <span className="absolute left-0 top-3 bottom-3 w-px bg-blue-500" aria-hidden />
                    )}

                    <p className="text-[9px] font-mono font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-2">
                        {stat.label}
                    </p>

                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-mono font-semibold text-neutral-900 dark:text-white leading-none">
                            {stat.value}
                        </span>
                        {stat.tag && (
                            <span className="mb-0.5 text-[9px] font-mono text-neutral-400 dark:text-neutral-600">
                                {stat.tag}
                            </span>
                        )}
                    </div>

                    {(stat.sub || stat.trend) && (
                        <div className="mt-2 flex items-center gap-1.5">
                            {stat.trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                            {stat.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-400" />}
                            {stat.trend === 'neutral' && <Minus className="h-3 w-3 text-neutral-400" />}
                            <span className={[
                                'text-[10px] font-mono',
                                stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
                                    stat.trend === 'down' ? 'text-red-500 dark:text-red-400' :
                                        'text-neutral-400 dark:text-neutral-600'
                            ].join(' ')}>
                                {stat.trendValue && <>{stat.trendValue} · </>}
                                {stat.sub}
                            </span>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    )
}