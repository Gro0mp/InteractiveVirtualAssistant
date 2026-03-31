import React, { useMemo, useRef, useState } from 'react'
import { Paperclip, Mic, Send } from 'lucide-react'

export function AssistantChatBar({
                              onSend,
                              disabled = false,
                              onAttach,
                              onMic,
                              placeholder = 'Ask IVA anything…',
                          }: {
    onSend: (message: string) => void;
    disabled?: boolean;
    onAttach?: () => void;
    onMic?: () => void;
    placeholder?: string;
}) {
    const [input, setInput] = useState('');
    const canSend = !disabled && input.trim().length > 0;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || disabled) return;
        onSend(text);
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="mx-auto flex w-full max-w-2xl items-stretch gap-0">
                {/* Attach */}
                <button
                    type="button"
                    onClick={onAttach}
                    disabled={disabled}
                    aria-label="Attach file"
                    className={[
                        'flex items-center justify-center w-12 shrink-0',
                        'border border-r-0 border-neutral-300/80 dark:border-neutral-700/80',
                        'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md',
                        'text-neutral-400 dark:text-neutral-500',
                        'hover:text-neutral-700 dark:hover:text-neutral-300',
                        'transition-colors duration-150',
                        'disabled:opacity-40 disabled:pointer-events-none',
                    ].join(' ')}
                >
                    <Paperclip className="w-4 h-4" />
                </button>

                {/* Input */}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={[
                        'flex-1 min-h-[52px] px-4',
                        'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md',
                        'border border-neutral-300/80 dark:border-neutral-700/80',
                        'text-[13px] font-mono text-neutral-900 dark:text-white',
                        'placeholder:text-neutral-400 dark:placeholder:text-neutral-600',
                        'outline-none focus:border-blue-400 dark:focus:border-blue-500',
                        'transition-colors duration-150',
                        disabled ? 'opacity-60 cursor-not-allowed' : '',
                    ].join(' ')}
                />

                {/* Mic */}
                <button
                    type="button"
                    onClick={onMic}
                    disabled={disabled}
                    aria-label="Voice input"
                    className={[
                        'flex items-center justify-center w-12 shrink-0',
                        'border border-l-0 border-neutral-300/80 dark:border-neutral-700/80',
                        'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md',
                        'text-neutral-400 dark:text-neutral-500',
                        'hover:text-neutral-700 dark:hover:text-neutral-300',
                        'transition-colors duration-150',
                        'disabled:opacity-40 disabled:pointer-events-none',
                    ].join(' ')}
                >
                    <Mic className="w-4 h-4" />
                </button>

                {/* Send */}
                <button
                    type="submit"
                    disabled={!canSend}
                    aria-label="Send message"
                    className={[
                        'flex items-center justify-center w-14 shrink-0 ml-px',
                        'border border-neutral-300/80 dark:border-neutral-700/80',
                        'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500',
                        'text-white transition-colors duration-150',
                        'disabled:opacity-35 disabled:bg-neutral-200 dark:disabled:bg-neutral-800',
                        'disabled:text-neutral-400 disabled:pointer-events-none',
                    ].join(' ')}
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </form>
    );
}