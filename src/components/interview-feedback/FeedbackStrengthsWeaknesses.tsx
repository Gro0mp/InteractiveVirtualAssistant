import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle } from 'lucide-react'

export type FeedbackPoint = {
    title: string
    detail: string
}

type Props = {
    strengths: FeedbackPoint[]
    improvements: FeedbackPoint[]
    summary?: string   // overall AI narrative paragraph
}

export function FeedbackStrengthsWeaknesses({ strengths, improvements, summary }: Props) {
    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden transition-colors duration-300">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute top-0 left-0 h-8 w-px bg-blue-500" aria-hidden />

            {/* Header */}
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-3">
                <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                    Analysis
                </span>
            </div>

            {/* Summary paragraph */}
            {summary && (
                <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="text-[12px] font-mono text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {summary}
                    </p>
                </div>
            )}

            {/* Two-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-100 dark:divide-neutral-800">
                {/* Strengths */}
                <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center">
                            <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-[9px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                            Strengths
                        </span>
                        <span className="text-[9px] font-mono text-neutral-300 dark:text-neutral-700 ml-auto">
                            {strengths.length} noted
                        </span>
                    </div>

                    <div className="space-y-3">
                        {strengths.map((point, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.08 }}
                                className="border-l-2 border-emerald-200 dark:border-emerald-900 pl-3"
                            >
                                <p className="text-[11px] font-mono font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
                                    {point.title}
                                </p>
                                <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-500 leading-relaxed">
                                    {point.detail}
                                </p>
                            </motion.div>
                        ))}
                        {strengths.length === 0 && (
                            <p className="text-[10px] font-mono text-neutral-300 dark:text-neutral-700">No strengths recorded.</p>
                        )}
                    </div>
                </div>

                {/* Improvements */}
                <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 border border-amber-200 dark:border-amber-900 flex items-center justify-center">
                            <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-[9px] font-mono font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                            To Improve
                        </span>
                        <span className="text-[9px] font-mono text-neutral-300 dark:text-neutral-700 ml-auto">
                            {improvements.length} noted
                        </span>
                    </div>

                    <div className="space-y-3">
                        {improvements.map((point, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.08 }}
                                className="border-l-2 border-amber-200 dark:border-amber-900 pl-3"
                            >
                                <p className="text-[11px] font-mono font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
                                    {point.title}
                                </p>
                                <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-500 leading-relaxed">
                                    {point.detail}
                                </p>
                            </motion.div>
                        ))}
                        {improvements.length === 0 && (
                            <p className="text-[10px] font-mono text-neutral-300 dark:text-neutral-700">Nothing flagged.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}