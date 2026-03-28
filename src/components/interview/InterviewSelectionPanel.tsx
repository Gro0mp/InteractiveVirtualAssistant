import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, CornerDownRight, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import type { InterviewSessionResponse } from '../../services/api'

type Props = {
    sessions: InterviewSessionResponse[]
    isLoading?: boolean
    onOpen: (id: number) => void
    onCreateNew: () => void
    onDelete?: (id: number) => void
}

export function InterviewSelectionPanel({ sessions, isLoading, onOpen, onCreateNew, onDelete }: Props) {
    const [query, setQuery] = useState('')

    const getDescription = (s: InterviewSessionResponse) => (s.description?.trim() ? s.description : 'Mock Interview')

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return sessions
        return sessions.filter((s) => getDescription(s).toLowerCase().includes(q))
    }, [sessions, query])

    return (
        <div className="h-full rounded-2xl border border-slate-200/70 bg-white/75 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200/60 flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">Mock Interviews</div>
                    <div className="mt-0.5 text-[13px] text-slate-900/60">
                        Resume a previous session or start a new one.
                    </div>
                </div>

                <Button size="sm" variant="secondary" leftIcon={<Plus className="h-4 w-4" />} onClick={onCreateNew}>
                    New
                </Button>
            </div>

            <div className="px-5 pt-4">
                <div className="rounded-xl border border-slate-200/70 bg-white/60 px-3 py-2">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search interviews…"
                        className="w-full bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
                <AnimatePresence initial={false}>
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            className="h-full grid place-items-center"
                        >
                            <div className="text-[13px] text-slate-900/60">Loading sessions…</div>
                        </motion.div>
                    ) : filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            className="h-full grid place-items-center"
                        >
                            <div className="text-center">
                                <div className="text-[13px] font-semibold text-slate-900">No sessions yet</div>
                                <div className="mt-1 text-[13px] text-slate-900/60">Create one to start practicing.</div>
                                <div className="mt-4 flex justify-center">
                                    <Button variant="secondary" size="md" onClick={onCreateNew}>
                                        Start a new mock interview
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3"
                        >
                            {filtered.map((s) => (
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    whileHover={{ y: -1 }}
                                    className="group rounded-2xl border border-slate-200/70 bg-white/60 hover:bg-white/75 transition-colors shadow-[0_6px_18px_rgba(11,18,32,0.05)]"
                                >
                                    <div className="p-4 flex items-center justify-between gap-4">
                                        <button type="button" className="min-w-0 text-left" onClick={() => onOpen(s.id)}>
                                            <div className="truncate text-[13px] font-semibold text-slate-900">{getDescription(s)}</div>
                                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-900/55">
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {new Date(s.updatedAt || s.createdAt).toLocaleString()}
                                                </span>
                                                <span>•</span>
                                                <span>{s.messages} messages</span>
                                            </div>
                                        </button>

                                        <div className="shrink-0 flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                rightIcon={<CornerDownRight className="h-4 w-4" />}
                                                onClick={() => onOpen(s.id)}
                                            >
                                                Open
                                            </Button>

                                            {onDelete ? (
                                                <button
                                                    type="button"
                                                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/70 bg-white/70 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors"
                                                    aria-label="Delete session"
                                                    onClick={() => onDelete(s.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="shrink-0 border-t border-slate-200/60 px-5 py-4 bg-white/40 flex items-center justify-between gap-3">
                <div className="text-[12px] text-slate-900/50">Sessions are saved in your account.</div>
                <div className="text-[12px] text-slate-900/50">{sessions.length} total</div>
            </div>
        </div>
    )
}
