import React, { useMemo, useRef, useState } from 'react'
import { Paperclip, Mic, Send } from 'lucide-react'

export function AssistantChatBar({
                                     onSend,
                                     placeholder = 'What do you want to know?',
                                     disabled = false,
                                     onAttach,
                                     onMic,
                                 }: {
    onSend: (message: string) => void
    placeholder?: string
    disabled?: boolean
    onAttach?: () => void
    onMic?: () => void
}) {
    const [input, setInput] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const canSend = useMemo(() => !disabled && input.trim().length > 0, [disabled, input])

    // Fixed: was React.SubmitEvent which doesn't exist in React's type system
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (disabled) return

        const text = input.trim()
        if (!text) return
        onSend(text)
        setInput('')
    }

    return (
        <form onSubmit={handleSubmit} className="w-full px-4 py-1">
            <div className="mx-auto flex w-full max-w-4xl items-center gap-3">
                {/* Liquid-glass pill */}
                <div
                    className={[
                        'relative flex w-full items-center gap-2 rounded-full px-3 py-2',
                        'overflow-hidden isolate',
                        'bg-white/40 backdrop-blur-2xl',
                        'border border-white/60',
                        'shadow-[0_4px_32px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]',
                        'ring-1 ring-black/[0.04]',
                        'transition focus-within:ring-2 focus-within:ring-violet-300/60',
                        disabled ? 'opacity-60' : '',
                    ].join(' ')}
                    onPointerDown={(e) => {
                        if (disabled) return
                        const t = e.target as HTMLElement
                        if (t.closest('button, a, input, textarea, select, [role="button"]')) return
                        e.preventDefault()
                        inputRef.current?.focus()
                    }}
                >
                    {/* Specular highlights */}
                    <div className="pointer-events-none absolute inset-0 rounded-full iva-glass-sheen-a" />
                    <div className="pointer-events-none absolute inset-0 rounded-full iva-glass-sheen-b" />

                    <button
                        type="button"
                        onClick={onAttach}
                        aria-label="Attach"
                        disabled={disabled}
                        className="relative z-10 grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-white/50 hover:text-slate-700 disabled:opacity-40"
                    >
                        <Paperclip className="h-5 w-5" />
                    </button>

                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="relative z-10 min-w-0 flex-1 bg-transparent px-1 py-1 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none"
                    />

                    <button
                        type="button"
                        onClick={onMic}
                        aria-label="Voice input"
                        disabled={disabled}
                        className="relative z-10 grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-white/50 hover:text-slate-700 disabled:opacity-40"
                    >
                        <Mic className="h-5 w-5" />
                    </button>
                </div>

                {/* Liquid-glass send button */}
                <button
                    type="submit"
                    disabled={!canSend}
                    aria-label="Send"
                    className={[
                        'relative grid h-11 w-11 shrink-0 place-items-center rounded-full overflow-hidden',
                        'bg-white/40 backdrop-blur-2xl',
                        'border border-white/60',
                        'shadow-[0_4px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]',
                        'ring-1 ring-black/[0.04]',
                        'transition',
                        'hover:bg-white/55 hover:shadow-[0_6px_32px_rgba(15,23,42,0.12)]',
                        'focus:outline-none focus:ring-2 focus:ring-violet-300/60',
                        'disabled:opacity-35 disabled:pointer-events-none',
                        'cursor-pointer disabled:cursor-not-allowed',
                    ].join(' ')}
                >
                    <span className="pointer-events-none absolute inset-0 rounded-full iva-glass-sheen-a" />
                    <Send className="relative z-10 h-5 w-5 text-slate-700" />
                </button>
            </div>
        </form>
    )
}