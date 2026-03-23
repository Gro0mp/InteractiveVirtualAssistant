import React from 'react'
import { FileDown, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'

type Props = {
    file: File | null
    isWorking: boolean
    status?: string
    translatedText?: string
    onClear: () => void
}

export function TranslateResultCard({ file, isWorking, status, translatedText, onClear }: Props) {
    const hasResult = Boolean(translatedText && translatedText.trim().length > 0)

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200/60 px-5 py-4">
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">Translation</div>
                    <div className="mt-0.5 text-[13px] text-slate-900/60">
                        {status || (file ? 'Run translation to see output here.' : 'Upload a file to begin.')}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {hasResult ? (
                        <>
                            <Button
                                variant={'secondary'}
                                size={'sm'}
                                onClick={() => {
                                    const blob = new Blob([translatedText as string], { type: 'text/plain;charset=utf-8' })
                                    const url = URL.createObjectURL(blob)
                                    const a = document.createElement('a')
                                    a.href = url
                                    a.download = 'translation.txt'
                                    a.click()
                                    URL.revokeObjectURL(url)
                                }}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <FileDown className="h-4 w-4" />
                                    Download
                                </span>
                            </Button>
                            <Button variant={'secondary'} size={'sm'} onClick={onClear}>
                                <span className="inline-flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    Clear
                                </span>
                            </Button>
                        </>
                    ) : null}
                </div>
            </div>

            <div className="p-5">
                {isWorking ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[13px] text-slate-900/60">
                        Translating…
                    </div>
                ) : hasResult ? (
                    <textarea
                        value={translatedText}
                        readOnly
                        className="h-[240px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-[13px] leading-relaxed text-slate-900 outline-none"
                    />
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[13px] text-slate-900/60">
                        No translation yet.
                    </div>
                )}
            </div>
        </div>
    )
}
