import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Send } from 'lucide-react'
import type { InterviewMessageHistoryListResponse } from '../../services/api'

type Props = {
    isOpen: boolean
    onClose: () => void
    messages: InterviewMessageHistoryListResponse[]
    onSend: (text: string) => void
    disabled?: boolean
    isCompleted?: boolean
}

function MessageBubble({ message }: { message: InterviewMessageHistoryListResponse }) {
    const isUser = message.role === 'CANDIDATE'
    return (
        <div className={['flex flex-col gap-1', isUser ? 'items-end' : 'items-start'].join(' ')}>
            <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest px-1">
                {isUser ? 'You' : 'Interviewer'}
            </span>
            <div className={[
                'max-w-[85%] px-3 py-2.5 text-[11.5px] font-mono leading-relaxed border',
                isUser
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-200',
            ].join(' ')}>
                {/* Question label for interviewer */}
                {!isUser && (
                    <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-neutral-700/60">
                        <span className="w-1 h-1 bg-blue-500 rounded-full" />
                        <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">Interviewer</span>
                    </div>
                )}
                {message.content}
            </div>
        </div>
    )
}

export function SessionChatDrawer({
                                      isOpen,
                                      onClose,
                                      messages,
                                      onSend,
                                      disabled,
                                      isCompleted,
                                  }: Props) {
    const [input, setInput] = useState('')
    const bottomRef = useRef<HTMLDivElement>(null)
    const canSend = !disabled && input.trim().length > 0

    const ordered = useMemo(() =>
        [...messages].sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ), [messages]
    )

    useEffect(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }, [ordered.length, isOpen])

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault()
        const text = input.trim()
        if (!text || disabled) return
        onSend(text)
        setInput('')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 340, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="h-full flex flex-col bg-neutral-950 border-l border-neutral-800 shrink-0 overflow-hidden"
                    style={{ minWidth: 0 }}
                >
                    {/* Drawer header */}
                    <div className="h-12 shrink-0 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                            </div>
                            <span className="text-[9px] font-mono font-semibold text-neutral-400 uppercase tracking-widest">
                                In-Session Chat
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-neutral-600 hover:text-neutral-300 transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Message list */}
                    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
                        {ordered.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                    <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                    <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                </div>
                                <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest text-center">
                                    Interview will appear here
                                </p>
                            </div>
                        ) : (
                            ordered.map((m, i) => <MessageBubble key={i} message={m} />)
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Completed banner */}
                    {isCompleted && (
                        <div className="shrink-0 px-4 py-2.5 bg-emerald-950/40 border-t border-emerald-900/60">
                            <div className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                                    Interview complete
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <form
                        onSubmit={handleSubmit}
                        className="shrink-0 border-t border-neutral-800 bg-neutral-900 flex items-stretch"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={Boolean(disabled)}
                            placeholder={
                                isCompleted
                                    ? 'Interview complete…'
                                    : disabled
                                        ? 'Waiting for interviewer…'
                                        : 'Type your answer…'
                            }
                            className="flex-1 bg-transparent px-4 py-3 text-[12px] font-mono text-neutral-100 placeholder:text-neutral-600 outline-none disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!canSend}
                            className="w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white transition-colors duration-150 border-l border-neutral-800"
                            aria-label="Send"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    )
}