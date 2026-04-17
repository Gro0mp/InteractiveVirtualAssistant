import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export type TranscriptEntry = {
    question: string     // INTERVIEWER message
    answer: string       // CANDIDATE message
    quality?: 'strong' | 'fair' | 'weak'   // optional per-answer rating
    hint?: string        // optional AI coaching note for this answer
}

type Props = { entries: TranscriptEntry[] }

const qualityConfig = {
    strong: { label: 'Strong', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900' },
    fair:   { label: 'Fair',   dot: 'bg-amber-500',   text: 'text-amber-600 dark:text-amber-400',     border: 'border-amber-200 dark:border-amber-900' },
    weak:   { label: 'Weak',   dot: 'bg-red-400',     text: 'text-red-500 dark:text-red-400',         border: 'border-red-200 dark:border-red-900' },
}

function TranscriptRow({ entry, index }: { entry: TranscriptEntry; index: number }) {
    const [open, setOpen] = useState(false)
    const cfg = entry.quality ? qualityConfig[entry.quality] : null

    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0"
        >
            {/* Question row — always visible */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-start gap-4 px-5 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors duration-150 text-left group"
            >
                {/* Q number */}
                <span className="text-[9px] font-mono text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400 dark:group-hover:text-neutral-600 mt-0.5 shrink-0">
                    Q{String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-mono font-semibold text-neutral-800 dark:text-neutral-200 leading-snug">
                        {entry.question}
                    </p>
                    {!open && (
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mt-1 truncate">
                            {entry.answer}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                    {cfg && (
                        <span className={`inline-flex items-center gap-1 border px-1.5 py-0.5 ${cfg.border}`}>
                            <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                            <span className={`text-[8px] font-mono font-semibold uppercase tracking-widest ${cfg.text}`}>
                                {cfg.label}
                            </span>
                        </span>
                    )}
                    <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {/* Expanded answer + hint */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-4 pl-14 space-y-3">
                            {/* Answer bubble */}
                            <div className="border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 px-4 py-3">
                                <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-1.5">
                                    Your answer
                                </p>
                                <p className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    {entry.answer}
                                </p>
                            </div>

                            {/* AI hint */}
                            {entry.hint && (
                                <div className="border-l-2 border-blue-200 dark:border-blue-900 pl-3">
                                    <p className="text-[9px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">
                                        Coach note
                                    </p>
                                    <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-500 leading-relaxed">
                                        {entry.hint}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function FeedbackTranscript({ entries }: Props) {
    const [allOpen, setAllOpen] = useState(false)

    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden transition-colors duration-300">
            {/* Corner accents */}
            <span className="absolute top-0 right-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute top-0 right-0 h-8 w-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 left-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 left-0 h-8 w-px bg-blue-500" aria-hidden />

            {/* Header */}
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                        Full Transcript
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">{entries.length} exchanges</span>
                    <button
                        type="button"
                        onClick={() => setAllOpen(o => !o)}
                        className="text-[9px] font-mono text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 uppercase tracking-widest transition-colors"
                    >
                        {allOpen ? 'Collapse all' : 'Expand all'}
                    </button>
                </div>
            </div>

            {/* Column headers */}
            <div className="flex items-center gap-4 px-5 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                <span className="w-8 shrink-0" />
                <span className="flex-1 text-[9px] font-mono font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">Question</span>
                <span className="text-[9px] font-mono font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">Rating</span>
                <span className="w-6 shrink-0" />
            </div>

            <div>
                {entries.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">No transcript available</p>
                    </div>
                ) : (
                    entries.map((entry, i) => (
                        <TranscriptRowControlled key={i} entry={entry} index={i} forceOpen={allOpen} />
                    ))
                )}
            </div>
        </div>
    )
}

// Controlled version that respects forceOpen
function TranscriptRowControlled({ entry, index, forceOpen }: { entry: TranscriptEntry; index: number; forceOpen: boolean }) {
    const [localOpen, setLocalOpen] = useState(false)
    const open = forceOpen || localOpen
    const cfg = entry.quality ? qualityConfig[entry.quality] : null

    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="border-b border-neutral-100 dark:border-neutral-800/60 last:border-0"
        >
            <button
                type="button"
                onClick={() => setLocalOpen(o => !o)}
                className="w-full flex items-start gap-4 px-5 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors duration-150 text-left group"
            >
                <span className="text-[9px] font-mono text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400 dark:group-hover:text-neutral-600 mt-0.5 shrink-0 w-8">
                    Q{String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-mono font-semibold text-neutral-800 dark:text-neutral-200 leading-snug">
                        {entry.question}
                    </p>
                    {!open && (
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mt-1 truncate">
                            {entry.answer}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                    {cfg && (
                        <span className={`inline-flex items-center gap-1 border px-1.5 py-0.5 ${cfg.border}`}>
                            <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                            <span className={`text-[8px] font-mono font-semibold uppercase tracking-widest ${cfg.text}`}>
                                {cfg.label}
                            </span>
                        </span>
                    )}
                    <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-4 pl-[3.25rem] space-y-3">
                            <div className="border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 px-4 py-3">
                                <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-1.5">
                                    Your answer
                                </p>
                                <p className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    {entry.answer}
                                </p>
                            </div>
                            {entry.hint && (
                                <div className="border-l-2 border-blue-200 dark:border-blue-900 pl-3">
                                    <p className="text-[9px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">
                                        Coach note
                                    </p>
                                    <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-500 leading-relaxed">
                                        {entry.hint}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}