import React from 'react'
import { motion } from 'framer-motion'

export type ActivityDay = {
    date: string   // ISO date string
    count: number  // sessions that day (0–4+)
}

type Props = {
    days: ActivityDay[]  // last 12 weeks (84 days) ordered oldest→newest
}

function intensity(count: number): string {
    if (count === 0) return 'bg-neutral-100 dark:bg-neutral-900'
    if (count === 1) return 'bg-blue-200 dark:bg-blue-900/60'
    if (count === 2) return 'bg-blue-400 dark:bg-blue-700'
    if (count === 3) return 'bg-blue-600 dark:bg-blue-500'
    return 'bg-blue-700 dark:bg-blue-400'
}

const WEEK_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun']
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function InterviewActivityHeatmap({ days }: Props) {
    // Chunk days into weeks (cols)
    const weeks: ActivityDay[][] = []
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7))
    }

    // Find which weeks have month transitions for labels
    const monthLabels: (string | null)[] = weeks.map((week, wi) => {
        if (wi === 0) return null
        const first = week[0]
        if (!first) return null
        const d = new Date(first.date)
        const prev = weeks[wi - 1][0]
        if (!prev) return null
        const pd = new Date(prev.date)
        if (d.getMonth() !== pd.getMonth()) return MONTH_LABELS[d.getMonth()]
        return null
    })

    const totalSessions = days.reduce((sum, d) => sum + d.count, 0)
    const activeDays = days.filter(d => d.count > 0).length

    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden transition-colors duration-300">
            {/* Corner accents */}
            <span className="absolute top-0 right-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute top-0 right-0 h-8 w-px bg-blue-500" aria-hidden />

            {/* Header */}
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                        Activity
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">
                        {totalSessions} sessions · {activeDays} days
                    </span>
                </div>
            </div>

            <div className="px-5 py-4 overflow-x-auto">
                <div className="flex gap-3">
                    {/* Day labels */}
                    <div className="flex flex-col justify-around pt-5 gap-0.5 shrink-0">
                        {WEEK_LABELS.map((label, i) => (
                            <div key={i} className="h-3 flex items-center">
                                <span className="text-[8px] font-mono text-neutral-300 dark:text-neutral-700 w-5 text-right">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="flex flex-col">
                        {/* Month labels row */}
                        <div className="flex gap-0.5 mb-1 h-4">
                            {weeks.map((_, wi) => (
                                <div key={wi} className="w-3 shrink-0">
                                    {monthLabels[wi] && (
                                        <span className="text-[8px] font-mono text-neutral-400 dark:text-neutral-600">
                                            {monthLabels[wi]}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Cells */}
                        <div className="flex gap-0.5">
                            {weeks.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-0.5">
                                    {week.map((day, di) => (
                                        <motion.div
                                            key={day.date}
                                            title={`${day.date}: ${day.count} session${day.count !== 1 ? 's' : ''}`}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.2, delay: (wi * 7 + di) * 0.003 }}
                                            className={`w-3 h-3 shrink-0 transition-colors duration-150 cursor-default hover:ring-1 hover:ring-blue-400 hover:ring-offset-1 dark:hover:ring-offset-neutral-950 ${intensity(day.count)}`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-3 flex items-center gap-2 justify-end">
                    <span className="text-[8px] font-mono text-neutral-400 dark:text-neutral-600">Less</span>
                    {[0, 1, 2, 3, 4].map(n => (
                        <div key={n} className={`w-3 h-3 ${intensity(n)}`} />
                    ))}
                    <span className="text-[8px] font-mono text-neutral-400 dark:text-neutral-600">More</span>
                </div>
            </div>
        </div>
    )
}