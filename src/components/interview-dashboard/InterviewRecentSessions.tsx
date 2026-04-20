import React from 'react'
import { motion } from 'framer-motion'
import { CornerDownRight, Trash2, Clock } from 'lucide-react'
import { Button } from '../ui/Button'
import type { InterviewSessionResponse, InterviewFeedbackResponse } from "../../services/api"

type Props = {
    sessions: InterviewSessionResponse[]
    feedbackHistory: InterviewFeedbackResponse[]
    onOpen: (id: number) => void
    onComplete?: (id: number) => void
    onViewFeedback?: (id: number) => void
    onDelete?: (id: number) => void
}

const statusConfig = {
    COMPLETED: {
        label: 'Completed',
        dot: 'bg-emerald-500',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-900'
    },
    'IN_PROGRESS': {
        label: 'In Progress',
        dot: 'bg-blue-500 animate-pulse',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-900'
    },
}

function ScoreBadge({ score }: { score?: number }) {
    if (score === undefined) return <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">—</span>
    const color =
        score >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
            score >= 60 ? 'text-amber-600 dark:text-amber-400' :
                'text-red-600 dark:text-red-400'
    return (
        <span className={`text-[12px] font-mono font-bold ${color}`}>
            {score}<span className="text-[9px] opacity-50 font-normal">/100</span>
        </span>
    )
}

export function InterviewRecentSessions({ sessions, feedbackHistory, onOpen, onViewFeedback, onDelete }: Props) {
    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors duration-300 relative">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-4 h-px bg-blue-500 z-10" aria-hidden />
            <span className="absolute top-0 left-0 h-4 w-px bg-blue-500 z-10" aria-hidden />

            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <h2 className="text-[11px] font-mono font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-widest">
                        Recent Sessions
                    </h2>
                </div>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {sessions.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                        <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                            No recent mock interviews. Start one above!
                        </p>
                    </div>
                ) : sessions.map((s, i) => {
                    const cfg = statusConfig[s.status as keyof typeof statusConfig] || statusConfig.IN_PROGRESS
                    const isCompleted = s.status === 'COMPLETED'
                    const progress = 8 > 0 ? Math.round((s.questionsAnswered / s.totalQuestions) * 100) : 0

                    // Match the feedback score to this session
                    const sessionFeedback = feedbackHistory?.find(f => f.sessionId === s.id)
                    const score = sessionFeedback?.overallScore

                    return (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                        >
                            {/* Left side: Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                        {s.title || 'Mock Interview'}
                                    </h3>
                                    {isCompleted && (
                                        <span className="shrink-0 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 uppercase tracking-wider rounded-sm">
                                            Done
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500 dark:text-neutral-500 uppercase tracking-wider">
                                    <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                                    <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                    <span>{s.questionsAnswered / s.totalQuestions} Messages</span>
                                </div>
                            </div>

                            {/* Right side: Status, Score, Actions (ADDED shrink-0) */}
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 shrink-0">
                                {/* Status */}
                                <div className="flex items-center gap-4 w-32 sm:w-40 shrink-0">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                {cfg.label}
                                            </span>
                                            {!isCompleted && (
                                                <span className="text-[9px] font-mono text-neutral-400">{progress}%</span>
                                            )}
                                        </div>
                                        {!isCompleted && (
                                            <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden rounded-full">
                                                <div
                                                    className="h-full bg-blue-500 transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="w-16 flex flex-col items-end sm:items-start shrink-0">
                                    <span className="text-[8px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-0.5">
                                        Score
                                    </span>
                                    <ScoreBadge score={score} />
                                </div>

                                {/* Actions (ADDED shrink-0) */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onOpen(s.id)}
                                        rightIcon={<CornerDownRight className="h-3 w-3" />}
                                    >
                                        Open
                                    </Button>
                                    {isCompleted && onViewFeedback && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onViewFeedback(s.id)}
                                        >
                                            Feedback
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <button
                                            type="button"
                                            aria-label="Delete"
                                            onClick={() => onDelete(s.id)}
                                            className="w-8 h-8 grid place-items-center border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900 transition-colors duration-150"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}