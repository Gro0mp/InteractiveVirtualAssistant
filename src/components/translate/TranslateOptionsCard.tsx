import React from 'react'
import { ArrowRight, Languages } from 'lucide-react'
import { Button } from '../ui/Button'

export type TranslateLanguage = {
    code: string
    label: string
}

type Props = {
    languages: TranslateLanguage[]
    source: TranslateLanguage
    target: TranslateLanguage
    onSourceChange: (lang: TranslateLanguage) => void
    onTargetChange: (lang: TranslateLanguage) => void

    file: File | null
    isWorking: boolean
    onTranslate: () => void | Promise<void>
}

export function TranslateOptionsCard({
    languages,
    source,
    target,
    onSourceChange,
    onTargetChange,
    file,
    isWorking,
    onTranslate,
}: Props) {
    const disabled = !file || isWorking

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Languages className="h-4 w-4 text-cyan-700" />
                        Translation Settings
                    </div>
                    <div className="mt-1 text-[13px] text-slate-900/60">
                        Pick languages. (Backend params can be added later.)
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
                <label className="grid gap-1">
                    <span className="text-[12px] font-medium text-slate-700">From</span>
                    <select
                        value={source.code}
                        onChange={(e) => {
                            const next = languages.find((l) => l.code === e.target.value)
                            if (next) onSourceChange(next)
                        }}
                        className="h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-[13px] text-slate-900 outline-none focus:ring-2 focus:ring-cyan-200"
                    >
                        {languages.map((l) => (
                            <option key={l.code} value={l.code}>
                                {l.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="grid gap-1">
                    <span className="text-[12px] font-medium text-slate-700">To</span>
                    <select
                        value={target.code}
                        onChange={(e) => {
                            const next = languages.find((l) => l.code === e.target.value)
                            if (next) onTargetChange(next)
                        }}
                        className="h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-[13px] text-slate-900 outline-none focus:ring-2 focus:ring-cyan-200"
                    >
                        {languages
                            .filter((l) => l.code !== 'auto')
                            .map((l) => (
                                <option key={l.code} value={l.code}>
                                    {l.label}
                                </option>
                            ))}
                    </select>
                </label>
            </div>

            <div className="mt-5">
                <Button
                    size="lg"
                    variant={disabled ? 'secondary' : 'primary'}
                    onClick={onTranslate as any}
                    disabled={disabled}
                    className="w-full"
                >
                    <span className="inline-flex items-center justify-center gap-2">
                        Translate
                        <ArrowRight className="h-4 w-4" />
                    </span>
                </Button>
                <div className="mt-2 text-[12px] text-slate-900/50">
                    {file ? 'Ready when you are.' : 'Upload a document to enable translation.'}
                </div>
            </div>
        </div>
    )
}
