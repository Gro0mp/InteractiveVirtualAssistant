import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export type Tip = {
    category: string
    headline: string
    body: string
}

type Props = {
    tips: Tip[]
}

export function InterviewTipCard({ tips }: Props) {
    const [index, setIndex] = useState(0)
    const tip = tips[index]

    const next = () => setIndex((i) => (i + 1) % tips.length)

    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden transition-colors duration-300 h-full flex flex-col">
            {/* Blue top accent bar */}
            <div className="h-px bg-blue-500 w-full" />

            {/* Header */}
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                        Coaching Tip
                    </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">
                    {index + 1} / {tips.length}
                </span>
            </div>

            <div className="flex-1 px-5 py-5">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="inline-flex items-center gap-1.5 border border-blue-200 dark:border-blue-900 px-2 py-0.5 mb-3">
                            <span className="w-1 h-1 rounded-full bg-blue-500" />
                            <span className="text-[9px] font-mono font-medium text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                {tip.category}
                            </span>
                        </div>
                        <p className="text-[13px] font-mono font-semibold text-neutral-900 dark:text-white mb-2 leading-snug">
                            {tip.headline}
                        </p>
                        <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-500 leading-relaxed">
                            {tip.body}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dot nav + next */}
            <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
                <div className="flex gap-1.5">
                    {tips.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setIndex(i)}
                            className={[
                                'w-1 h-1 rounded-full transition-colors duration-150',
                                i === index ? 'bg-blue-500' : 'bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600'
                            ].join(' ')}
                            aria-label={`Tip ${i + 1}`}
                        />
                    ))}
                </div>
                <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-1 text-[9px] font-mono text-neutral-400 dark:text-neutral-600 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest transition-colors duration-150"
                >
                    Next tip <ChevronRight className="h-3 w-3" />
                </button>
            </div>
        </div>
    )
}