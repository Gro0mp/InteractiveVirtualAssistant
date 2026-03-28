import React from 'react'
import type {InterviewMessageHistoryListResponse} from '../../services/api'
import { AssistantChatBar } from '../assistant/AssistantChatBar'
import { InterviewMessageList } from './InterviewMessageList'
import { ArrowLeft } from 'lucide-react'

type Props = {
    title: string
    subtitle?: string
    messages: InterviewMessageHistoryListResponse[]
    onSend: (text: string) => void
    disabled?: boolean
    onBack?: () => void
    isCompleted?: boolean
}

export function InterviewChatPanel({ title, subtitle, messages, onSend, disabled, onBack, isCompleted }: Props) {
    return (
        <div className="h-full rounded-2xl border border-slate-200/70 bg-white/75 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200/60 flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    {subtitle ? (
                        <div className="mt-0.5 text-[13px] text-slate-900/60">{subtitle}</div>
                    ) : null}
                </div>

                {onBack ? (
                    <button
                        type="button"
                        onClick={onBack}
                        className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-[12.5px] font-semibold text-slate-700 hover:bg-white/85 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>
                ) : null}
            </div>

            <div className="flex-1 min-h-0">
                <InterviewMessageList messages={messages} />
            </div>

            {isCompleted && (
                <div className="shrink-0 px-5 py-3 bg-emerald-50 border-t border-emerald-200 text-[13px] text-emerald-700 font-medium text-center">
                    Interview complete — see the feedback above.
                </div>
            )}

            <div className="shrink-0 border-t border-slate-200/60 bg-white/40">
                <AssistantChatBar
                    onSend={onSend}
                    disabled={Boolean(disabled)}
                    placeholder="Type your answer…"
                />
            </div>
        </div>
    )
}