import React from 'react'
import { motion } from 'framer-motion'
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceLine,
    CartesianGrid,
} from 'recharts'

export type ScorePoint = {
    sessionTitle: string   // e.g. "S01"
    overallScore: number     // 0–100
    completedAt: string      // display date
}

type Props = {
    data: ScorePoint[]
    averageScore: number
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
    if (!active || !payload?.length) return null
    const d = payload[0].payload as ScorePoint
    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3 py-2 font-mono">
            <p className="text-[9px] text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-1">{d.completedAt}</p>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                {d.overallScore}
                <span className="text-[10px] text-neutral-400 dark:text-neutral-600 ml-1">/ 100</span>
            </p>
        </div>
    )
}

export function InterviewScoreChart({ data, averageScore }: Props) {
    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden transition-colors duration-300">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute top-0 left-0 h-8 w-px bg-blue-500" aria-hidden />

            {/* Header */}
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                        Score Trend
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                        avg {averageScore}
                    </span>
                </div>
            </div>

            <div className="px-2 py-4 h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -20 }}>
                        <CartesianGrid
                            strokeDasharray="2 4"
                            stroke="currentColor"
                            className="text-neutral-100 dark:text-neutral-900"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="session"
                            tick={{ fontFamily: 'monospace', fontSize: 9, fill: 'currentColor' }}
                            className="text-neutral-400 dark:text-neutral-600"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fontFamily: 'monospace', fontSize: 9, fill: 'currentColor' }}
                            className="text-neutral-400 dark:text-neutral-600"
                            axisLine={false}
                            tickLine={false}
                            ticks={[0, 25, 50, 75, 100]}
                        />
                        <ReferenceLine
                            y={averageScore}
                            stroke="#3b82f6"
                            strokeDasharray="4 3"
                            strokeWidth={1}
                            strokeOpacity={0.5}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 3' }} />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#2563eb"
                            strokeWidth={1.5}
                            dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }}
                            activeDot={{ r: 4, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}