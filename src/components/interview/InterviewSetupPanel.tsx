import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, FileText, Upload, X } from 'lucide-react'
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
        <div className="h-full flex flex-col bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors duration-300 relative">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute top-0 left-0 h-8 w-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 right-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 right-0 h-8 w-px bg-blue-500" aria-hidden />

            {/* Terminal header */}
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <div className="flex items-center gap-3 mb-1">
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="ml-1 text-[9px] font-mono text-neutral-400 dark:text-neutral-600 tracking-widest uppercase">
                        Setup — Mock Interview
                    </span>
                </div>
                <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 pl-8">
                    Paste a job description and we'll tailor questions to it
                </p>
            </div>

            <div className="flex-1 min-h-0 p-5 flex flex-col gap-4 overflow-y-auto">
                {/* Paste section */}
                <div className="border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-blue-500" />
                            <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                                01 — Paste job description
                            </span>
                        </div>
                        {pasteText && (
                            <button
                                type="button"
                                onClick={() => {
                                    setPasteText('')
                                    if (value?.source === 'paste') onChange(null)
                                }}
                                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                                aria-label="Clear pasted text"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                    <textarea
                        value={pasteText}
                        onChange={(e) => {
                            const nextText = e.target.value
                            setPasteText(nextText)
                            setFile(null)
                            const trimmed = nextText.trim()
                            onChange(trimmed ? { jobDescriptionText: trimmed, source: 'paste' } : null)
                        }}
                        placeholder="Paste the job description here…"
                        className="w-full h-[200px] resize-none bg-transparent px-4 py-3 text-[12px] font-mono leading-relaxed text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 outline-none"
                    />
                    {pasteText && (
                        <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                {pasteText.trim().split(/\s+/).length} words loaded
                            </span>
                        </div>
                    )}
                </div>

                {/* Dropzone */}
                <div
                    className={[
                        'border-2 border-dashed p-5 transition-colors duration-150 cursor-pointer',
                        isDragging
                            ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
                    ].join(' ')}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault(); setIsDragging(false)
                        const dropped = e.dataTransfer.files?.[0]
                        if (dropped) void handleFileSelection(dropped)
                    }}
                >
                    <div className="flex items-start gap-4">
                        <div className="w-9 h-9 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
                            <Upload className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-1 h-1 rounded-full bg-blue-500" />
                                <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                                    02 — Drop a file
                                </span>
                            </div>
                            <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mb-4">
                                TXT, MD, or DOC — reads as plain text
                            </p>

                            <div className="flex items-center gap-3">
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
                                    <div className="inline-flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 px-3 py-1.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-150">
                                        <FileText className="h-3 w-3" />
                                        Browse
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {value?.source === 'file' && value.fileName && (
                                        <motion.span
                                            key={value.fileName}
                                            initial={{ opacity: 0, x: -4 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -4 }}
                                            className="min-w-0 truncate text-[10px] font-mono text-neutral-400 dark:text-neutral-600"
                                            title={value.fileName}
                                        >
                                            <span className="text-emerald-600 dark:text-emerald-400">✓</span> {value.fileName}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 px-5 py-4 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between gap-3">
                {onBack ? (
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors uppercase tracking-wider"
                    >
                        <ChevronLeft className="h-3 w-3" />
                        Back
                    </button>
                ) : <div />}

                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                        {canStart ? (
                            <span className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                Ready
                            </span>
                        ) : 'Add a description to begin'}
                    </span>

                    <button
                        type="button"
                        disabled={!canStart || Boolean(isStarting)}
                        onClick={() => { if (!value) return; onStart(value) }}
                        className={[
                            'inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono font-semibold uppercase tracking-widest border transition-colors duration-150',
                            canStart && !isStarting
                                ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700 hover:border-blue-600'
                                : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed',
                        ].join(' ')}
                    >
                        {isStarting ? (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                Starting…
                            </>
                        ) : 'Start Interview'}
                    </button>
                </div>
            </div>
        </div>
    )
}