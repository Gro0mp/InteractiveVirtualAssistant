import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '../ui/Button'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  audioData?: string // Base64-encoded audio data for assistant messages
  createdAt?: number
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={['flex w-full', isUser ? 'justify-end' : 'justify-start'].join(' ')}>
      <div
        className={[
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm',
          isUser
            ? 'bg-slate-900 text-white shadow-[0_10px_30px_rgba(2,6,23,0.22)]'
            : 'bg-white text-slate-900 border border-slate-200/70',
        ].join(' ')}
      >
        {message.content}
      </div>
    </div>
  )
}

export function AssistantChatPanel({
  messages,
  onSend,
  placeholder = 'Ask me anything…',
  disabled,
}: {
  messages: Message[]
  onSend: (text: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  const [draft, setDraft] = useState('')
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const canSend = useMemo(() => !disabled && draft.trim().length > 0, [disabled, draft])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length])

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
  }

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white/80 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur">
      <header className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3">
        <div>
          <div className="text-sm font-extrabold tracking-[-0.01em] text-slate-900">Assistant</div>
          <div className="mt-0.5 text-[12px] text-slate-500">Chat, plan, and automate.</div>
        </div>
      </header>

      <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-4 text-[13px] text-slate-600">
            <div className="font-semibold text-slate-900">Try:</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>“Draft a polite follow-up email.”</li>
              <li>“Create an invoice for 10 hours of consulting.”</li>
              <li>“Summarize this PDF once I upload it.”</li>
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {messages.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200/60 p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (canSend) handleSend()
              }
            }}
            rows={2}
            placeholder={placeholder}
            className="min-h-[44px] max-h-28 flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            disabled={disabled}
          />
          <Button
            type="button"
            size="md"
            className="h-[44px] rounded-xl"
            disabled={!canSend}
            onClick={handleSend}
            rightIcon={<Send className="h-4 w-4" />}
          >
            Send
          </Button>
        </div>
        <div className="mt-2 text-[11px] text-slate-500">Press Enter to send · Shift+Enter for a new line</div>
      </div>
    </section>
  )
}
