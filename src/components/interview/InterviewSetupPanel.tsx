import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {ChevronLeft, FileText, Upload, X} from 'lucide-react'
import { Button } from '../ui/Button'

export type InterviewSetupValue = {
    jobDescriptionText: string
    source: 'paste' | 'file'
    fileName?: string
}

type Props = {
    value: InterviewSetupValue | null
    onChange: (value: InterviewSetupValue | null) => void
    onStart: (value: InterviewSetupValue) => void
    isStarting?: boolean
    onBack?: () => void
}

export function InterviewSetupPanel({ value, onChange, onStart, isStarting, onBack }: Props) {
    const [isDragging, setIsDragging] = useState(false)
    const [pasteText, setPasteText] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const fileUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

    useEffect(() => {
        if (!fileUrl) return
        return () => URL.revokeObjectURL(fileUrl)
    }, [fileUrl])

    const handleFileSelection = async (selected: File) => {
        setFile(selected)
        setPasteText('')

        try {
            const text = await selected.text()
            const next: InterviewSetupValue = {
                jobDescriptionText: (text || '').trim(),
                source: 'file',
                fileName: selected.name,
            }
            onChange(next.jobDescriptionText ? next : null)
        } catch (e) {
            console.error('Failed to read file:', e)
            onChange(null)
        }
    }

    const canStart = Boolean(value?.jobDescriptionText && value.jobDescriptionText.trim().length > 0)

    return (
        <div className="h-full rounded-2xl border border-slate-200/70 bg-white/75 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200/60">
                <div className="text-sm font-semibold text-slate-900">Mock Interview Setup</div>
                <div className="mt-0.5 text-[13px] text-slate-900/60">
                    Paste the job description or drop a file. We’ll tailor questions to it.
                </div>
            </div>

            <div className="flex-1 min-h-0 p-5 grid gap-4">
                {/* Paste */}
                <div className="rounded-2xl border border-slate-200/70 bg-white/70 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200/60 flex items-center justify-between">
                        <div className="text-[13px] font-semibold text-slate-900">Paste job description</div>
                        {pasteText ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setPasteText('')
                                    if (value?.source === 'paste') onChange(null)
                                }}
                                className="text-slate-400 hover:text-slate-600"
                                aria-label="Clear pasted text"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        ) : null}
                    </div>
                    <textarea
                        value={pasteText}
                        onChange={(e) => {
                            const nextText = e.target.value
                            setPasteText(nextText)
                            setFile(null)
                            const trimmed = nextText.trim()
                            onChange(
                                trimmed
                                    ? {
                                          jobDescriptionText: trimmed,
                                          source: 'paste',
                                      }
                                    : null
                            )
                        }}
                        placeholder="Paste the job description here…"
                        className="w-full h-[220px] resize-none bg-transparent px-4 py-3 text-[13px] leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none"
                    />
                </div>

                {/* Dropzone */}
                <div
                    className={[
                        'rounded-2xl border-2 border-dashed p-6 transition-colors',
                        'bg-white/50',
                        isDragging ? 'border-slate-400' : 'border-slate-300 hover:border-slate-400',
                    ].join(' ')}
                    onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault()
                        setIsDragging(false)
                        const dropped = e.dataTransfer.files?.[0]
                        if (dropped) void handleFileSelection(dropped)
                    }}
                >
                    <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-100 text-cyan-700">
                            <Upload className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-slate-900">Drop a file</div>
                            <div className="mt-0.5 text-[13px] text-slate-900/60">
                                TXT, MD, or DOC copied as text. (PDF parsing can be added next.)
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="file"
                                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const f = e.target.files?.[0]
                                    if (f) void handleFileSelection(f)
                                }}
                                accept=".txt,.md,.doc,.docx,text/plain,text/markdown"
                            />
                            <Button variant="outline" size="sm" leftIcon={<FileText className="h-4 w-4" />}>Browse</Button>
                        </div>

                        <AnimatePresence mode="wait">
                            {value?.source === 'file' && value.fileName ? (
                                <motion.div
                                    key={value.fileName}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    className="min-w-0 truncate text-[13px] text-slate-900/60"
                                    title={value.fileName}
                                >
                                    Using: <span className="font-medium text-slate-800">{value.fileName}</span>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="shrink-0 border-t border-slate-200/60 px-5 py-4 bg-white/40 flex items-center justify-between gap-3">
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-[13px] text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                    </button>
                )}
                <div className="text-[12px] text-slate-900/50">
                    {canStart ? 'Ready to start.' : 'Add a job description to begin.'}
                </div>
                <Button
                    variant="secondary"
                    size="md"
                    isLoading={Boolean(isStarting)}
                    disabled={!canStart || Boolean(isStarting)}
                    onClick={() => {
                        if (!value) return
                        onStart(value)
                    }}
                >
                    Start interview
                </Button>
            </div>
        </div>
    )
}
