import React, { useEffect, useMemo, useRef } from 'react'
import type {InterviewMessageHistoryListResponse} from '../../services/api'

type Props = {
    messages: InterviewMessageHistoryListResponse[]
}

export function InterviewMessageList({ messages }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null)

    const ordered = useMemo(() => {
        // createdAt is a numeric timestamp (Date.now()) so subtraction is always valid
        return [...messages].sort((a, b) => (Number(a.createdAt) ?? 0) - (Number(b.createdAt)?? 0))
    }, [messages])

    useEffect(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 30)
    }, [ordered.length])

    return (
        <div className="h-full overflow-y-auto px-5 py-4 space-y-3">
            {ordered.length === 0 ? (
                <div className="h-full grid place-items-center text-[13px] text-slate-500">
                    Start a session by asking the interviewer a question.
                </div>
            ) : (
                ordered.map((m, idx) => <InterviewBubble key={idx} message={m} />)
            )}
            <div ref={bottomRef} />
        </div>
    )
}

function InterviewBubble({ message }: { message: InterviewMessageHistoryListResponse }) {
    const isUser = message.role === 'CANDIDATE'

    return (
        <div className={['flex', isUser ? 'justify-end' : 'justify-start'].join(' ')}>
            <div
                className={[
                    'max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed',
                    'shadow-[0_6px_18px_rgba(11,18,32,0.06)]',
                    isUser
                        ? 'bg-violet-500/10 border border-violet-300/30 text-slate-900 rounded-tr-sm'
                        : 'bg-white/70 border border-slate-200/70 text-slate-700 rounded-tl-sm',
                ].join(' ')}
            >
                {message.content}
            </div>
        </div>
    )
}