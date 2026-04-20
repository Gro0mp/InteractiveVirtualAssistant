import React, {useMemo, useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import {Clock, CornerDownRight, Plus, Trash2} from 'lucide-react'
import {Button} from '../ui/Button'
import type {InterviewSessionResponse} from '../../services/api'

type Props = {
    sessions: InterviewSessionResponse[]
    isLoading?: boolean
    onOpen: (id: number) => void
    onCreateNew: () => void
    onDelete?: (id: number) => void
    onOpenFeedback?: (id: number) => void
}

export function InterviewSelectionPanel({sessions, isLoading, onOpen, onCreateNew, onDelete, onOpenFeedback}: Props) {
    const [query, setQuery] = useState('')

    const getTitle = (s: InterviewSessionResponse) =>
        s.title?.trim() ? s.title : 'Mock Interview'

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return sessions
        return sessions.filter((s) => getTitle(s).toLowerCase().includes(q))
    }, [sessions, query])

    return (
        <div
            className="h-full flex flex-col bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors duration-300 relative">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-8 h-px bg-blue-500" aria-hidden/>
            <span className="absolute top-0 left-0 h-8 w-px bg-blue-500" aria-hidden/>
            <span className="absolute bottom-0 right-0 w-8 h-px bg-blue-500" aria-hidden/>
            <span className="absolute bottom-0 right-0 h-8 w-px bg-blue-500" aria-hidden/>

            {/* Header */}
            <div
                className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700"/>
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700"/>
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700"/>
                    </div>
                    <div>
                        <p className="text-[9px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-mono">
                            Mock Interviews
                        </p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono mt-0.5">
                            Resume a session or start a new one
                        </p>
                    </div>
                </div>

                <Button size="sm" variant="outline" onClick={onCreateNew} leftIcon={<Plus className="h-3 w-3"/>}>
                    New
                </Button>
            </div>

            {/* Search */}
            <div className="px-5 pt-4 pb-2">
                <div
                    className="border border-neutral-200 dark:border-neutral-800 flex items-center gap-2 px-3 py-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
                    <span
                        className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest shrink-0">
                        {'/>'}
                    </span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search sessions…"
                        className="flex-1 bg-transparent text-[12px] font-mono text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 outline-none"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
                <AnimatePresence initial={false}>
                    {isLoading ? (
                        <motion.div key="loading" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                    className="h-full grid place-items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"/>
                                <span
                                    className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">Loading sessions…</span>
                            </div>
                        </motion.div>
                    ) : filtered.length === 0 ? (
                        <motion.div key="empty" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                    className="h-full grid place-items-center">
                            <div className="text-center">
                                <p className="text-[10px] font-mono font-semibold text-neutral-900 dark:text-white mb-1 uppercase tracking-wider">No
                                    sessions yet</p>
                                <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mb-5">Create
                                    one to start practicing.</p>
                                <Button variant="outline" size="sm" onClick={onCreateNew}
                                        leftIcon={<Plus className="h-3 w-3"/>}>
                                    Start mock interview
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="list" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                    className="space-y-px mt-1">
                            {filtered.map((s, i) => (
                                <motion.div
                                    key={s.id}
                                    initial={{opacity: 0, y: 4}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0}}
                                    transition={{delay: i * 0.04}}
                                    className="group border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors duration-150"
                                >
                                    <div className="p-4 flex items-center justify-between gap-4">
                                        <button type="button" className="min-w-0 text-left flex-1"
                                                onClick={() => onOpen(s.id)}>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span
                                                    className="text-[9px] font-mono text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400 dark:group-hover:text-neutral-600 transition-colors">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <div
                                                    className="truncate text-[12px] font-mono font-semibold text-neutral-900 dark:text-white">
                                                    {getTitle(s)}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <span
                                                    className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
                                                    <Clock className="h-3 w-3"/>
                                                    {new Date(s.createdAt).toLocaleString()}
                                                </span>
                                                <span
                                                    className="text-neutral-300 dark:text-neutral-800 text-[10px]">·</span>
                                                <span
                                                    className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">{s.questionsAnswered / s.totalQuestions} msgs</span>
                                            </div>
                                        </button>

                                        <div className="shrink-0 flex items-center gap-1">
                                            {s.status === 'COMPLETED' && onOpenFeedback && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onOpenFeedback(s.id)} // Call the specific feedback handler
                                                    rightIcon={<CornerDownRight className="h-3 w-3"/>}
                                                >
                                                    Feedback
                                                </Button>
                                            )}

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onOpen(s.id)}
                                                rightIcon={<CornerDownRight className="h-3 w-3"/>}
                                            >
                                                Open
                                            </Button>

                                            {onDelete && (
                                                <button
                                                    type="button"
                                                    aria-label="Delete session"
                                                    onClick={() => onDelete(s.id)}
                                                    className="w-8 h-8 grid place-items-center border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors duration-150"
                                                >
                                                    <Trash2 className="h-3 w-3"/>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div
                className="shrink-0 border-t border-neutral-100 dark:border-neutral-800 px-5 py-3 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
                <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                    Saved to account
                </p>
                <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">{sessions.length} total</p>
            </div>
        </div>
    )
}