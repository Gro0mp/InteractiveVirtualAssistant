import React from 'react'
import { Sparkles, FileText, Send, Wand2, Link2 } from 'lucide-react'
import { Button } from '../ui/Button'

export function AssistantToolsPanel({
  connected,
  onAction,
}: {
  connected?: boolean
  onAction?: (action: string) => void
}) {
  const fire = (action: string) => onAction?.(action)

  return (
    <aside className="flex h-full flex-col gap-3.5">
      <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-3.5 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold tracking-[-0.01em] text-slate-900">Tools</div>
            <div className="mt-0.5 text-[12px] text-slate-500">One-click actions</div>
          </div>
          <div
            className={[
              'rounded-full px-2 py-1 text-[11px] font-semibold',
              connected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600',
            ].join(' ')}
          >
            {connected ? 'Connected' : 'Offline'}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2">
          <Button variant="outline" className="justify-start" onClick={() => fire('summarize') } leftIcon={<Sparkles className="h-4 w-4" />}>
            Summarize conversation
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => fire('draft-email') } leftIcon={<Send className="h-4 w-4" />}>
            Draft an email
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => fire('invoice') } leftIcon={<FileText className="h-4 w-4" />}>
            Generate invoice outline
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => fire('polish') } leftIcon={<Wand2 className="h-4 w-4" />}>
            Polish last reply
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-3.5 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur">
        <div className="text-sm font-extrabold tracking-[-0.01em] text-slate-900">Context</div>
        <div className="mt-1 text-[12px] text-slate-500">What the assistant can access</div>

        <div className="mt-3 space-y-2 text-[13px]">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="flex items-center gap-2 text-slate-700">
              <Link2 className="h-4 w-4 text-slate-400" />
              <span className="font-semibold">Docs</span>
            </div>
            <span className="text-slate-500">Not connected</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="flex items-center gap-2 text-slate-700">
              <Link2 className="h-4 w-4 text-slate-400" />
              <span className="font-semibold">Email</span>
            </div>
            <span className="text-slate-500">Not connected</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="flex items-center gap-2 text-slate-700">
              <Link2 className="h-4 w-4 text-slate-400" />
              <span className="font-semibold">Calendar</span>
            </div>
            <span className="text-slate-500">Not connected</span>
          </div>
        </div>
      </section>
    </aside>
  )
}
