import React from 'react'
import { LogOut, Wifi } from 'lucide-react'
import { SessionTimer } from './SessionTimer'

type Props = {
    sessionTitle: string
    questionProgress: { answered: number; total: number } | null
    isRunning: boolean
    isCompleted: boolean
    onLeave: () => void
}

export function SessionStatusBar({
                                     sessionTitle,
                                     questionProgress,
                                     isRunning,
                                     isCompleted,
                                     onLeave,
                                 }: Props) {
    return (
        <div className="h-12 shrink-0 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between px-4 gap-4 z-20">
            {/* Left — branding + title */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-2 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] font-mono font-semibold text-neutral-400 uppercase tracking-widest">
                        IVA
                    </span>
                </div>
                <span className="text-neutral-700 text-[10px]">/</span>
                <p className="text-[11px] font-mono font-semibold text-neutral-200 truncate">
                    {sessionTitle}
                </p>
            </div>

            {/* Centre — question progress + timer */}
            <div className="flex items-center gap-4 shrink-0">
                {questionProgress && (
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                            Q
                        </span>
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: questionProgress.total }).map((_, i) => (
                                <div
                                    key={i}
                                    className={[
                                        'w-3 h-1 transition-colors duration-300',
                                        i < questionProgress.answered
                                            ? 'bg-blue-500'
                                            : i === questionProgress.answered
                                                ? 'bg-blue-500/40 animate-pulse'
                                                : 'bg-neutral-800',
                                    ].join(' ')}
                                />
                            ))}
                        </div>
                        <span className="text-[9px] font-mono text-neutral-500">
                            {questionProgress.answered}/{questionProgress.total}
                        </span>
                    </div>
                )}

                {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 border border-emerald-700/60 px-2 py-0.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-mono font-semibold text-emerald-400 uppercase tracking-widest">
                            Complete
                        </span>
                    </span>
                ) : (
                    <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-red-500 animate-pulse' : 'bg-neutral-600'}`} />
                        <SessionTimer
                            running={isRunning}
                            className="text-[11px] text-neutral-300"
                        />
                    </div>
                )}
            </div>

            {/* Right — connection status + leave */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                    <Wifi className="h-3 w-3 text-emerald-500" />
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest hidden sm:block">
                        Connected
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onLeave}
                    className="inline-flex items-center gap-1.5 border border-red-900/60 bg-red-950/40 hover:bg-red-900/50 hover:border-red-700 px-3 py-1.5 text-[10px] font-mono font-semibold text-red-400 hover:text-red-300 uppercase tracking-widest transition-colors duration-150"
                >
                    <LogOut className="h-3 w-3" />
                    Leave
                </button>
            </div>
        </div>
    )
}