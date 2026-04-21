import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, FileText, Upload, X } from 'lucide-react'

const MAX_PDF_SIZE_MB = 5
const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024

export type InterviewSetupValue = {
    jobDescriptionText: string
    interviewLength: "SHORT" | "REGULAR" | "LONG"
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
    const [isExtractingPdf, setIsExtractingPdf] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [interviewLength, setInterviewLength] = useState<InterviewSetupValue['interviewLength']>(
        value?.interviewLength ?? 'REGULAR'
    )

    const fileUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

    useEffect(() => {
        if (!fileUrl) return
        return () => URL.revokeObjectURL(fileUrl)
    }, [fileUrl])

    useEffect(() => {
        if (value?.interviewLength) {
            setInterviewLength(value.interviewLength)
        }
    }, [value?.interviewLength])

    const handleFileSelection = async (selected: File) => {
        setUploadError(null)

        const isPdf =
            selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf')
        if (!isPdf) {
            setFile(null)
            onChange(null)
            setUploadError('Only PDF files are supported for job descriptions.')
            return
        }

        if (selected.size > MAX_PDF_SIZE_BYTES) {
            setFile(null)
            onChange(null)
            setUploadError(`File is too large. Maximum size is ${MAX_PDF_SIZE_MB}MB.`)
            return
        }

        setIsExtractingPdf(true)
        try {
            // Dynamic import keeps pdfjs out of the SSR bundle (avoids DOMMatrix crash)
            const { pdfjs } = await import('react-pdf')
            pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

            const buffer = await selected.arrayBuffer()
            const loadingTask = pdfjs.getDocument({ data: buffer })
            const pdf = await loadingTask.promise

            let extracted = ''
            for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
                const page = await pdf.getPage(pageIndex)
                const content = await page.getTextContent()
                const pageText = content.items
                    .map((item) => ('str' in item ? item.str : ''))
                    .join(' ')
                    .trim()
                if (pageText) extracted += `${pageText}\n\n`
            }

            const text = extracted.trim()
            if (!text) {
                setFile(null)
                onChange(null)
                setUploadError('Could not extract text from this PDF. Try another file.')
                return
            }

            setFile(selected)
            setPasteText('')
            const next: InterviewSetupValue = {
                jobDescriptionText: text,
                interviewLength,
                source: 'file',
                fileName: selected.name,
            }
            onChange(next)
        } catch (e) {
            console.error('Failed to read file:', e)
            setFile(null)
            onChange(null)
            setUploadError('Failed to read PDF. Please try a different file.')
        } finally {
            setIsExtractingPdf(false)
        }
    }

    const canStart = Boolean(value?.jobDescriptionText && value.jobDescriptionText.trim().length > 0)
    const hasPastedDescription = value?.source === 'paste' && Boolean(value.jobDescriptionText.trim())
    const isPasteLocked = value?.source === 'file' && Boolean(value.jobDescriptionText.trim())
    const isUploadLocked = hasPastedDescription

    const clearUploadedDescription = () => {
        setFile(null)
        setUploadError(null)
        if (value?.source === 'file') onChange(null)
    }

    const handleLengthChange = (length: InterviewSetupValue['interviewLength']) => {
        setInterviewLength(length)
        if (!value?.jobDescriptionText?.trim()) return
        onChange({ ...value, interviewLength: length })
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors duration-300 relative">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute top-0 left-0 h-8 w-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 right-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 right-0 h-8 w-px bg-blue-500" aria-hidden />

            {/* Terminal header */}
            <div className="shrink-0 px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
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

            {/* Scrollable body — all sections are shrink-0 so they never compress */}
            <div className="flex-1 min-h-0 p-5 flex flex-col gap-4 overflow-y-auto">

                {/* 01 — Paste section */}
                <div className="shrink-0 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    {/* Section header */}
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
                    {/* Fixed-height textarea — never grows */}
                    <textarea
                        value={pasteText}
                        disabled={isPasteLocked || isExtractingPdf}
                        onChange={(e) => {
                            const nextText = e.target.value
                            setPasteText(nextText)
                            const trimmed = nextText.trim()
                            onChange(trimmed ? {
                                jobDescriptionText: trimmed,
                                interviewLength,
                                source: 'paste',
                            } : null)
                        }}
                        placeholder="Paste the job description here…"
                        className="w-full h-[180px] min-h-[180px] max-h-[180px] resize-none overflow-y-auto bg-transparent px-4 py-3 text-[12px] font-mono leading-relaxed text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {isPasteLocked && (
                        <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                            <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                                Clear uploaded PDF to switch to paste mode.
                            </p>
                        </div>
                    )}
                    {pasteText && (
                        <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                {pasteText.trim().split(/\s+/).length} words loaded
                            </span>
                        </div>
                    )}
                </div>

                {/* 02 — Dropzone */}
                <div
                    className={[
                        'shrink-0 border-2 border-dashed p-5 transition-colors duration-150 cursor-pointer',
                        isUploadLocked && !isDragging
                            ? 'opacity-60 cursor-not-allowed'
                            : '',
                        isDragging
                            ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
                    ].join(' ')}
                    onDragOver={(e) => {
                        e.preventDefault()
                        if (isUploadLocked || isExtractingPdf) return
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault(); setIsDragging(false)
                        if (isUploadLocked || isExtractingPdf) return
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
                                {value?.source === 'file' && value.fileName && (
                                    <button
                                        type="button"
                                        onClick={clearUploadedDescription}
                                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                                        aria-label="Clear uploaded PDF"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mb-4">
                                PDF only, up to {MAX_PDF_SIZE_MB}MB
                            </p>

                            {isUploadLocked && (
                                <p className="mb-3 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                                    Clear pasted text to switch to upload mode.
                                </p>
                            )}

                            {isExtractingPdf && (
                                <p className="mb-3 text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                    Extracting PDF text...
                                </p>
                            )}

                            {uploadError && (
                                <p className="mb-3 text-[10px] font-mono text-red-500 uppercase tracking-widest">
                                    {uploadError}
                                </p>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                                        disabled={isExtractingPdf || isUploadLocked}
                                        onChange={(e) => {
                                            const f = e.target.files?.[0]
                                            if (f) void handleFileSelection(f)
                                        }}
                                        accept=".pdf,application/pdf"
                                    />
                                    <div className="inline-flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 px-3 py-1.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-150">
                                        <FileText className="h-3 w-3" />
                                        {isExtractingPdf ? 'Reading...' : 'Browse'}
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

                {/* 03 — Interview length */}
                <div className="shrink-0 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                            03 - Interview length
                        </span>
                    </div>
                    <div className="px-3 pt-2.5 pb-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {([
                            { key: 'SHORT', label: 'Short', sub: 'Quick practice' },
                            { key: 'REGULAR', label: 'Regular', sub: 'Balanced flow' },
                            { key: 'LONG', label: 'Long', sub: 'Deep interview' },
                        ] as const).map((option) => {
                            const isSelected = interviewLength === option.key
                            return (
                                <button
                                    key={option.key}
                                    type="button"
                                    onClick={() => handleLengthChange(option.key)}
                                    className={[
                                        'text-left px-3 py-2.5 border transition-colors duration-150',
                                        isSelected
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
                                    ].join(' ')}
                                >
                                    <p className="text-[11px] font-mono font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                                        {option.label}
                                    </p>
                                    <p className="mt-1 text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                                        {option.sub}
                                    </p>
                                </button>
                            )
                        })}
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