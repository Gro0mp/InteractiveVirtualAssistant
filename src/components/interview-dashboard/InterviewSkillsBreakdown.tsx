import React from 'react'
import { motion } from 'framer-motion'

export type Skill = {
    label: string
    score: number        // 0–100
    prevScore?: number   // previous session score for delta
}

type Props = {
    skills: Skill[]
}

function delta(score: number, prev?: number) {
    if (prev === undefined) return null
    const d = score - prev
    if (d === 0) return null
    return { value: Math.abs(d), dir: d > 0 ? 'up' : 'down' }
}

export function InterviewSkillsBreakdown({ skills }: Props) {
    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden transition-colors duration-300">
            {/* Corner accents */}
            <span className="absolute top-0 right-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute top-0 right-0 h-8 w-px bg-blue-500" aria-hidden />

            {/* Header */}
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-3">
                <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                    Skill Breakdown
                </span>
                <span className="ml-auto text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                    Latest session
                </span>
            </div>

            <div className="px-5 py-4 space-y-4">
                {skills.map((skill, i) => {
                    const d = delta(skill.score, skill.prevScore)
                    const scoreColor =
                        skill.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                            skill.score >= 60 ? 'text-blue-600 dark:text-blue-400' :
                                'text-amber-600 dark:text-amber-400'

                    const barColor =
                        skill.score >= 80 ? '#10b981' :
                            skill.score >= 60 ? '#2563eb' :
                                '#f59e0b'

                    return (
                        <div key={skill.label}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono text-neutral-300 dark:text-neutral-700">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300">
                                        {skill.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {d && (
                                        <span className={[
                                            'text-[9px] font-mono',
                                            d.dir === 'up' ? 'text-emerald-500' : 'text-red-400'
                                        ].join(' ')}>
                                            {d.dir === 'up' ? '+' : '-'}{d.value}
                                        </span>
                                    )}
                                    <span className={`text-[11px] font-mono font-semibold ${scoreColor}`}>
                                        {skill.score}
                                    </span>
                                </div>
                            </div>
                            {/* Track */}
                            <div className="h-px bg-neutral-100 dark:bg-neutral-800 relative overflow-visible">
                                <motion.div
                                    className="absolute left-0 top-0 h-full"
                                    style={{ backgroundColor: barColor }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.score}%` }}
                                    transition={{ duration: 0.9, delay: i * 0.1, ease: 'easeOut' }}
                                />
                                {/* Score dot */}
                                <motion.div
                                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white dark:border-neutral-950"
                                    style={{ backgroundColor: barColor }}
                                    initial={{ left: 0 }}
                                    animate={{ left: `${skill.score}%` }}
                                    transition={{ duration: 0.9, delay: i * 0.1, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="px-5 pb-4 pt-1 flex items-center gap-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-px bg-emerald-500" />
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">≥80 Strong</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-px bg-blue-500" />
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">≥60 Good</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-px bg-amber-500" />
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">&lt;60 Focus</span>
                </div>
            </div>
        </div>
    )
}