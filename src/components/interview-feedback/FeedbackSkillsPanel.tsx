import React from 'react'
import { motion } from 'framer-motion'

export type FeedbackSkill = {
    label: string
    score: number        // 0–100
    prevScore?: number
    comment?: string     // short AI note on this skill
}

type Props = { skills: FeedbackSkill[] }

function delta(score: number, prev?: number) {
    if (prev === undefined) return null
    const d = score - prev
    if (d === 0) return null
    return { value: Math.abs(d), dir: d > 0 ? 'up' : 'down' as const }
}

function barColor(score: number) {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#2563eb'
    return '#f59e0b'
}

function scoreColor(score: number) {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 60) return 'text-blue-600 dark:text-blue-400'
    return 'text-amber-600 dark:text-amber-400'
}

export function FeedbackSkillsPanel({ skills }: Props) {
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
                        Skill Scores
                    </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                    {skills.length} dimensions
                </span>
            </div>

            <div className="px-5 py-5 space-y-5">
                {skills.map((skill, i) => {
                    const d = delta(skill.score, skill.prevScore)
                    const color = barColor(skill.score)

                    return (
                        <motion.div
                            key={skill.label}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.07 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono text-neutral-300 dark:text-neutral-700">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-[12px] font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                                        {skill.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {d && (
                                        <span className={`text-[9px] font-mono ${d.dir === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>
                                            {d.dir === 'up' ? '+' : '−'}{d.value}
                                        </span>
                                    )}
                                    <span className={`text-[13px] font-mono font-semibold tabular-nums ${scoreColor(skill.score)}`}>
                                        {skill.score}
                                        <span className="text-[9px] text-neutral-400 dark:text-neutral-600 ml-0.5">/100</span>
                                    </span>
                                </div>
                            </div>

                            {/* Track + animated fill + dot */}
                            <div className="h-px bg-neutral-100 dark:bg-neutral-800 relative overflow-visible mb-2">
                                <motion.div
                                    className="absolute left-0 top-0 h-full"
                                    style={{ backgroundColor: color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.score}%` }}
                                    transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                                />
                                <motion.div
                                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white dark:border-neutral-950"
                                    style={{ backgroundColor: color }}
                                    initial={{ left: '0%' }}
                                    animate={{ left: `${skill.score}%` }}
                                    transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                                />
                            </div>

                            {/* AI comment */}
                            {skill.comment && (
                                <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 leading-relaxed border-l-2 border-neutral-100 dark:border-neutral-800 pl-2.5">
                                    {skill.comment}
                                </p>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="px-5 pb-4 pt-2 flex items-center gap-4 border-t border-neutral-100 dark:border-neutral-800">
                {[
                    { color: 'bg-emerald-500', label: '≥80 Strong' },
                    { color: 'bg-blue-500', label: '≥60 Good' },
                    { color: 'bg-amber-500', label: '<60 Focus' },
                ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                        <span className={`w-2 h-px ${l.color}`} />
                        <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">{l.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}