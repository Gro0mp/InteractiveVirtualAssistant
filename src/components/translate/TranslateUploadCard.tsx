import React, { useEffect, useMemo, useState } from 'react'
import { Upload, FileText, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { api } from '../../services/api'

type Props = {
    file: File | null
    onFileChange: (file: File | null) => void
    isWorking?: boolean
}

export function TranslateUploadCard({ file, onFileChange, isWorking }: Props) {
    const [isDragging, setIsDragging] = useState(false)

    const fileUrl = useMemo(() => {
        if (!file) return null
        return URL.createObjectURL(file)
    }, [file])

    useEffect(() => {
        if (!fileUrl) return
        return () => URL.revokeObjectURL(fileUrl)
    }, [fileUrl])

    const isPdf = file?.type === 'application/pdf' || file?.name.toLowerCase().endsWith('.pdf')
    const isImage = !!file && (file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(file.name))

    const handleFileSelection = (selectedFile: File) => {
        // Don’t auto-translate on upload; just set it so the page can run translate on demand.
        onFileChange(selectedFile)
        detectTextInImage(selectedFile)
    }

    const detectTextInImage = async (file: File) => {
        const response = await api.translateDocument(file);
        console.log("OCR result:", response);
    }

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200/60 px-5 py-4">
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">Document</div>
                    <div className="mt-0.5 text-[13px] text-slate-900/60">
                        Upload a file to preview and translate.
                    </div>
                </div>

                {file ? (
                    <button
                        type="button"
                        onClick={() => onFileChange(null)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-[13px] font-semibold text-slate-700 shadow-sm hover:bg-white"
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </button>
                ) : null}
            </div>

            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-5"
                    >
                        <div
                            className={[
                                'relative rounded-2xl border-2 border-dashed p-10 transition-colors',
                                'flex min-h-[260px] flex-col items-center justify-center text-center',
                                isDragging
                                    ? 'border-slate-400 bg-slate-50/60'
                                    : 'border-slate-300 bg-white/40 hover:bg-white/60',
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
                                if (dropped) handleFileSelection(dropped)
                            }}
                        >
                            {isWorking ? (
                                <div className="text-center">
                                    <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-slate-600" />
                                    <div className="text-sm font-semibold text-slate-900">Working…</div>
                                    <div className="mt-1 text-[13px] text-slate-900/60">Please wait while we process your file.</div>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-cyan-100 text-cyan-700">
                                        <Upload className="h-7 w-7" />
                                    </div>
                                    <div className="text-base font-semibold text-slate-900">Drop your file here</div>
                                    <div className="mt-1 text-[13px] text-slate-900/60">
                                        PDF, DOCX, TXT, PNG, or JPG.
                                    </div>

                                    <div className="mt-6 relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0]
                                                if (f) handleFileSelection(f)
                                            }}
                                            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,image/*"
                                        />
                                        <Button size="lg" variant={'secondary'}>
                                            Browse Files
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-5"
                    >
                        <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900/5">
                                {isImage ? (
                                    <ImageIcon className="h-5 w-5 text-slate-600" />
                                ) : (
                                    <FileText className="h-5 w-5 text-slate-600" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-slate-900">{file.name}</div>
                                <div className="mt-0.5 text-[13px] text-slate-900/60">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
                            {isPdf && fileUrl ? (
                                <iframe title="PDF preview" src={fileUrl} className="h-[62vh] w-full" />
                            ) : isImage && fileUrl ? (
                                <div className="p-4">
                                    <img
                                        src={fileUrl}
                                        alt={file.name}
                                        className="mx-auto max-h-[62vh] w-auto rounded-xl border border-slate-200 object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="p-6 text-[13px] text-slate-900/60">
                                    Preview is available for PDFs and images. You uploaded{' '}
                                    <span className="font-mono text-slate-900">{file.type || 'unknown'}</span>.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
