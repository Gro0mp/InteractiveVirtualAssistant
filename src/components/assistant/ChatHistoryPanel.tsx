import type {ChatHistoryListResponse} from "../../services/api.ts";
import React, {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ChevronDown, MessageSquare, X} from "lucide-react";

export function ChatHistoryPanel({ messages }: { messages: ChatHistoryListResponse[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const bottomRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        }
    }, [messages, isOpen]);

    return (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto flex flex-col items-end gap-2">
            {/* Expanded panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className={[
                            'w-[340px] overflow-hidden',
                            'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md',
                            'border border-neutral-200 dark:border-neutral-800',
                            'shadow-[0_4px_24px_rgba(15,23,42,0.10)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)]',
                        ].join(' ')}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-mono">
                                    Chat History
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            className="overflow-y-auto px-3 py-3 space-y-2.5"
                            style={{ maxHeight: '340px', scrollbarWidth: 'thin' }}
                        >
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <MessageSquare className="h-5 w-5 text-neutral-300 dark:text-neutral-700" strokeWidth={1.5} />
                                    <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600">No messages yet</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isUser = msg.role === 'USER';
                                    return (
                                        <div key={i} className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={[
                                                'mt-0.5 h-5 w-5 shrink-0 flex items-center justify-center',
                                                'border text-[9px] font-semibold font-mono',
                                                isUser
                                                    ? 'border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                                                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900',
                                            ].join(' ')}>
                                                {isUser ? 'U' : 'A'}
                                            </div>
                                            <div className={[
                                                'max-w-[80%] px-3 py-2 text-[12px] leading-relaxed border',
                                                isUser
                                                    ? 'border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/40 text-neutral-800 dark:text-neutral-200'
                                                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300',
                                            ].join(' ')}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={bottomRef} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={[
                    'flex items-center gap-2.5 px-4 py-2.5',
                    'border border-neutral-300/80 dark:border-neutral-700/80',
                    'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md',
                    'shadow-[0_2px_8px_rgba(15,23,42,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]',
                    'hover:border-blue-400 dark:hover:border-blue-500',
                    'transition-all duration-150 cursor-pointer select-none',
                ].join(' ')}
            >
                <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-neutral-400 shrink-0" strokeWidth={1.75} />
                <span className="text-[11px] font-mono font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-widest whitespace-nowrap">
                    History
                </span>
                {messages.length > 0 && (
                    <span className="inline-flex items-center justify-center h-4 min-w-[1rem] px-1 border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/50 text-[9px] font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                        {messages.length}
                    </span>
                )}
                <ChevronDown
                    className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600 shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                />
            </button>
        </div>
    );
}