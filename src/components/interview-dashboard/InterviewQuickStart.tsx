import React from 'react'
import { ArrowRight, Clock3, CornerDownRight } from 'lucide-react'
import { Button } from '../ui/Button'

type QuickStartRecentSession = {
    id: number
    title: string
    createdAtLabel: string
    status: string
}

type Props = {
    lastSessionTitle?: string
    lastSessionId?: number
    recentSessions?: QuickStartRecentSession[]
    onNewSession: () => void
    onResumeSession?: (id: number) => void
}

export function InterviewQuickStart({
                                        lastSessionTitle,
                                        lastSessionId,
                                        recentSessions,
                                        onNewSession,
                                        onResumeSession,
                                    }: Props) {
    const sessionsToShow = recentSessions?.slice(0, 3) ?? []

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

            <div className="flex-1 px-5 py-4 flex flex-col gap-3">
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

                <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

                {/* Recent activity keeps this panel informative even before more charts load. */}
                <div className="space-y-2">
                    <p className="text-[9px] font-mono font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                        Recent activity
                    </p>

                    {sessionsToShow.length > 0 ? (
                        <div className="space-y-1.5">
                            {sessionsToShow.map((session) => (
                                <button
                                    key={session.id}
                                    type="button"
                                    onClick={() => onResumeSession?.(session.id)}
                                    className="w-full rounded-md border border-neutral-200/80 dark:border-neutral-800 px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                                >
                                    <p className="text-[11px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 truncate">
                                        {session.title}
                                    </p>
                                    <div className="mt-1 flex items-center justify-between gap-2 text-[9px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
                                        <span className="inline-flex items-center gap-1">
                                            <Clock3 className="h-3 w-3" />
                                            {session.createdAtLabel}
                                        </span>
                                        <span>{session.status}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2">
                            Start your first mock interview to see activity here.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}