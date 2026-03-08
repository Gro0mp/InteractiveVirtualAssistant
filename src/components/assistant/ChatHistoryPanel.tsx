import React, { useEffect, useRef, useState } from 'react'
import { MessageSquare, X, ChevronDown } from 'lucide-react'
import type { Message } from '../../services/api.ts'

interface ChatHistoryPanelProps {
    messages: Message[]
}

export function ChatHistoryPanel({ messages }: ChatHistoryPanelProps) {
    const [isOpen, setIsOpen] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const unreadCount = messages.length

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 50)
        }
    }, [messages, isOpen])

    return (
        <div
            className="absolute bottom-6 right-6 z-20 pointer-events-auto flex flex-col items-end gap-3"
            style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
        >
            {/* Expanded chat panel — grows upward from the bubble */}
            <div
                style={{
                    maxHeight: isOpen ? '420px' : '0px',
                    opacity: isOpen ? 1 : 0,
                    width: isOpen ? '340px' : '200px',
                    overflow: 'hidden',
                    transition: isOpen
                        ? 'max-height 420ms cubic-bezier(0.34,1.56,0.64,1), opacity 280ms ease, width 300ms cubic-bezier(0.34,1.56,0.64,1)'
                        : 'max-height 280ms cubic-bezier(0.4,0,1,1), opacity 200ms ease, width 250ms ease',
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transformOrigin: 'bottom right',
                }}
            >
                <div
                    className={[
                        'rounded-2xl overflow-hidden',
                        'bg-white/25 backdrop-blur-3xl',
                        'border border-white/50',
                        'shadow-[0_8px_48px_rgba(15,23,42,0.13),inset_0_1px_0_rgba(255,255,255,0.65)]',
                    ].join(' ')}
                >
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/30">
                        <span className="text-[13px] font-semibold text-slate-700 tracking-wide">
                            Chat History
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="grid h-6 w-6 place-items-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/40 transition-all"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        className="overflow-y-auto px-3 py-3 space-y-2.5"
                        style={{
                            maxHeight: '340px',
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(148,163,184,0.3) transparent',
                        }}
                    >
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <MessageSquare className="h-6 w-6 text-slate-300" strokeWidth={1.5} />
                                <p className="text-[12px] text-slate-400">No messages yet</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <MessageBubble key={i} message={msg} />
                            ))
                        )}
                        <div ref={bottomRef} />
                    </div>
                </div>
            </div>

            {/* The floating bubble toggle */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={[
                    'relative flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full',
                    'bg-white/30 backdrop-blur-2xl',
                    'border border-white/55',
                    'shadow-[0_4px_28px_rgba(15,23,42,0.10),inset_0_1px_0_rgba(255,255,255,0.7)]',
                    'ring-1 ring-black/[0.04]',
                    'transition-all duration-200 hover:bg-white/45 hover:shadow-[0_6px_36px_rgba(15,23,42,0.14)] active:scale-[0.97]',
                    'cursor-pointer select-none',
                ].join(' ')}
            >
                {/* Icon */}
                <MessageSquare className="h-4 w-4 text-slate-600 shrink-0" strokeWidth={1.75} />

                {/* Label */}
                <span className="text-[13px] font-medium text-slate-700 whitespace-nowrap">
                    Chat History
                </span>

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span
                        className={[
                            'inline-flex items-center justify-center',
                            'h-4 min-w-4 px-1 rounded-full',
                            'bg-violet-400/30 border border-violet-300/40',
                            'text-[10px] font-bold text-violet-700 tabular-nums',
                        ].join(' ')}
                    >
                        {unreadCount}
                    </span>
                )}

                {/* Chevron */}
                <ChevronDown
                    className="h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                />
            </button>
        </div>
    )
}

function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === 'user'

    return (
        <div className={['flex gap-2', isUser ? 'flex-row-reverse' : 'flex-row'].join(' ')}>
            {/* Avatar */}
            <div
                className={[
                    'mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center',
                    'text-[9px] font-bold',
                    isUser
                        ? 'bg-violet-300/40 border border-violet-300/50 text-violet-700'
                        : 'bg-slate-200/60 border border-slate-200/80 text-slate-500',
                ].join(' ')}
            >
                {isUser ? 'U' : 'A'}
            </div>

            {/* Text bubble */}
            <div
                className={[
                    'max-w-[80%] px-3 py-2 rounded-2xl text-[12.5px] leading-relaxed',
                    isUser
                        ? 'rounded-tr-sm bg-violet-400/15 border border-violet-300/25 text-slate-800'
                        : 'rounded-tl-sm bg-white/35 border border-white/50 text-slate-700',
                    'shadow-[0_1px_8px_rgba(15,23,42,0.05)]',
                ].join(' ')}
            >
                {message.content}
            </div>
        </div>
    )
}