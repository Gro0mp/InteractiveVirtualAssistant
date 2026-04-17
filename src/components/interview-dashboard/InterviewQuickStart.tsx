import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CornerDownRight } from 'lucide-react'
import { Button } from '../ui/Button'

type Props = {
    lastSessionTitle?: string
    lastSessionId?: number
    onNewSession: () => void
    onResumeSession?: (id: number) => void
    completedThisWeek: number
    weeklyGoal: number
}

export function InterviewQuickStart({
                                        lastSessionTitle,
                                        lastSessionId,
                                        onNewSession,
                                        onResumeSession,
                                        completedThisWeek,
                                        weeklyGoal,
                                    }: Props) {
    const weekProgress = Math.min(100, Math.round((completedThisWeek / weeklyGoal) * 100))

    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden transition-colors duration-300 h-full flex flex-col">
            {/* Blue top bar */}
            <div className="h-px bg-blue-500 w-full" />

            {/* Header */}
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-3">
                <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                    Quick Actions
                </span>
            </div>

            <div className="flex-1 px-5 py-5 flex flex-col gap-4">
                {/* Weekly goal progress */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                            Weekly Goal
                        </span>
                        <span className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400">
                            {completedThisWeek} / {weeklyGoal} sessions
                        </span>
                    </div>
                    <div className="h-px bg-neutral-100 dark:bg-neutral-800 relative">
                        <motion.div
                            className="absolute left-0 top-0 h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${weekProgress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </div>
                    <div className="mt-1.5 flex justify-between">
                        <span className="text-[9px] font-mono text-neutral-300 dark:text-neutral-700">0</span>
                        <span className={[
                            'text-[9px] font-mono',
                            weekProgress >= 100 ? 'text-emerald-500' : 'text-neutral-400 dark:text-neutral-600'
                        ].join(' ')}>
                            {weekProgress >= 100 ? '✓ Goal reached!' : `${weekProgress}%`}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

                {/* Action buttons */}
                <div className="flex flex-col gap-2">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={onNewSession}
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                        className="w-full justify-between"
                    >
                        Start new interview
                    </Button>

                    {lastSessionTitle && lastSessionId && onResumeSession && (
                        <button
                            type="button"
                            onClick={() => onResumeSession(lastSessionId)}
                            className="w-full flex items-center justify-between px-4 py-2.5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors duration-150 group"
                        >
                            <div className="text-left min-w-0">
                                <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-0.5">Resume last</p>
                                <p className="text-[11px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 truncate group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                                    {lastSessionTitle}
                                </p>
                            </div>
                            <CornerDownRight className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600 group-hover:text-blue-500 shrink-0 ml-3 transition-colors" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}