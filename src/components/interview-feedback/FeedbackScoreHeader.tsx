import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MessageSquare, Clock } from 'lucide-react'

export type FeedbackMeta = {
    sessionTitle: string
    date: string
    duration?: string
    totalQuestions: number
    answeredQuestions: number
    overallScore: number        // 0–100
    previousScore?: number
    status: 'COMPLETED' | 'IN_PROGRESS'
}

type Props = { meta: FeedbackMeta }

// Animated score counter
function CountUp({ target, duration = 1400 }: { target: number; duration?: number }) {
    const [display, setDisplay] = useState(0)

    useEffect(() => {
        const start = performance.now()
        const frame = (now: number) => {
            const pct = Math.min((now - start) / duration, 1)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - pct, 3)
            setDisplay(Math.round(eased * target))
            if (pct < 1) requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)
    }, [target, duration])

    return <>{display}</>
}

function scoreLabel(score: number): { label: string; color: string; border: string; dot: string } {
    if (score >= 85) return { label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900', dot: 'bg-emerald-500' }
    if (score >= 70) return { label: 'Good', color: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-900', dot: 'bg-blue-500' }
    if (score >= 55) return { label: 'Fair', color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900', dot: 'bg-amber-500' }
    return { label: 'Needs Work', color: 'text-red-500 dark:text-red-400', border: 'border-red-200 dark:border-red-900', dot: 'bg-red-500' }
}

export function FeedbackScoreHeader({ meta }: Props) {
    const label = scoreLabel(meta.overallScore)
    const delta = meta.previousScore !== undefined ? meta.overallScore - meta.previousScore : null
    const pct = Math.round((meta.answeredQuestions / Math.max(meta.totalQuestions, 1)) * 100)

    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden transition-colors duration-300">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute top-0 left-0 h-8 w-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 right-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 right-0 h-8 w-px bg-blue-500" aria-hidden />

            {/* Terminal header */}
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                        Interview Report
                    </span>
                </div>
                <div className={`inline-flex items-center gap-1.5 border px-2 py-0.5 ${label.border}`}>
                    <span className={`w-1 h-1 rounded-full ${label.dot}`} />
                    <span className={`text-[9px] font-mono font-semibold uppercase tracking-widest ${label.color}`}>
                        {label.label}
                    </span>
                </div>
            </div>

            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
                {/* Score block */}
                <div className="flex items-center gap-5">
                    {/* Score circle (CSS-only ring) */}
                    <div className="relative w-24 h-24 shrink-0">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
                            {/* Track */}
                            <circle
                                cx="48" cy="48" r="40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-neutral-100 dark:text-neutral-800"
                            />
                            {/* Progress */}
                            <motion.circle
                                cx="48" cy="48" r="40"
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="4"
                                strokeLinecap="square"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - meta.overallScore / 100) }}
                                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-mono font-semibold text-neutral-900 dark:text-white leading-none">
                                <CountUp target={meta.overallScore} />
                            </span>
                            <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 mt-0.5">/100</span>
                        </div>
                    </div>

                    {/* Score meta */}
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight font-mono mb-1 leading-snug">
                            {meta.sessionTitle}
                        </h2>
                        {delta !== null && (
                            <motion.div
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center gap-1.5 mb-2"
                            >
                                <span className={`text-[10px] font-mono font-semibold ${delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                                    {delta >= 0 ? `+${delta}` : delta} vs last session
                                </span>
                            </motion.div>
                        )}
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
                                <Calendar className="h-3 w-3" />
                                {meta.date}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
                                <MessageSquare className="h-3 w-3" />
                                {meta.answeredQuestions} / {meta.totalQuestions} questions
                            </span>
                            {meta.duration && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
                                    <Clock className="h-3 w-3" />
                                    {meta.duration}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Completion bar */}
                <div className="md:border-l md:border-neutral-100 md:dark:border-neutral-800 md:pl-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                            Session Completion
                        </span>
                        <span className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400">{pct}%</span>
                    </div>
                    <div className="h-px bg-neutral-100 dark:bg-neutral-800 relative mb-4">
                        <motion.div
                            className="absolute left-0 top-0 h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        />
                    </div>

                    {/* Score band legend */}
                    <div className="grid grid-cols-4 gap-px bg-neutral-100 dark:bg-neutral-800">
                        {[
                            { range: '0–54', label: 'Needs Work', color: 'bg-red-500/20 dark:bg-red-500/10', active: meta.overallScore < 55 },
                            { range: '55–69', label: 'Fair', color: 'bg-amber-500/20 dark:bg-amber-500/10', active: meta.overallScore >= 55 && meta.overallScore < 70 },
                            { range: '70–84', label: 'Good', color: 'bg-blue-500/20 dark:bg-blue-500/10', active: meta.overallScore >= 70 && meta.overallScore < 85 },
                            { range: '85+', label: 'Excellent', color: 'bg-emerald-500/20 dark:bg-emerald-500/10', active: meta.overallScore >= 85 },
                        ].map(band => (
                            <div key={band.range} className={`px-2 py-2 text-center ${band.active ? band.color : 'bg-white dark:bg-neutral-950'}`}>
                                <p className={`text-[9px] font-mono font-semibold uppercase tracking-widest ${band.active ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-300 dark:text-neutral-700'}`}>
                                    {band.label}
                                </p>
                                <p className={`text-[8px] font-mono ${band.active ? 'text-neutral-500 dark:text-neutral-400' : 'text-neutral-300 dark:text-neutral-700'}`}>
                                    {band.range}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}