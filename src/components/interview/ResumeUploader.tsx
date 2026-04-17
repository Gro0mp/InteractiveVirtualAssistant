import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload, FileText, Check, Plus, AlertCircle,
    ExternalLink, X, Eye, EyeOff, Trash2,
} from 'lucide-react'
import { api } from '../../services/api'
import type { UserDocument } from '../../services/api'

type Props = {
    // s3Key added so InterviewPage can store which resume is tied to the session
    onResumeSelected: (resumeText: string, fileName: string, s3Key?: string) => void
    onResumeCleared: () => void
    selectedFileName?: string
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

// ── Inline PDF viewer ─────────────────────────────────────────────────────────

function PdfViewer({ url, fileName, onClose }: { url: string; fileName: string; onClose: () => void }) {
    const [iframeError, setIframeError] = useState(false)
    const [isLoading,   setIsLoading]   = useState(true)
    const isPdf = fileName.toLowerCase().endsWith('.pdf')

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 440, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border border-t-0 border-blue-400 dark:border-blue-600"
        >
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest truncate">
                        Preview — {fileName}
                    </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-3">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in new tab"
                        className="w-6 h-6 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                    >
                        <ExternalLink className="h-2.5 w-2.5 text-neutral-400 dark:text-neutral-600" />
                    </a>
                    <button
                        type="button"
                        onClick={onClose}
                        title="Close preview"
                        className="w-6 h-6 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                        <X className="h-2.5 w-2.5 text-neutral-400 dark:text-neutral-600" />
                    </button>
                </div>
            </div>

            <div className="relative bg-neutral-100 dark:bg-neutral-900/80" style={{ height: 403 }}>
                {isLoading && !iframeError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
                        <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                            Loading…
                        </span>
                    </div>
                )}

                {!iframeError && isPdf ? (
                    <iframe
                        src={`${url}#view=FitH&toolbar=0`}
                        title={`Preview: ${fileName}`}
                        className="w-full h-full border-0 block"
                        onLoad={() => setIsLoading(false)}
                        onError={() => { setIframeError(true); setIsLoading(false) }}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
                        <div className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
                        </div>
                        <div>
                            <p className="text-[11px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                {iframeError ? 'Preview blocked by browser' : 'Preview unavailable'}
                            </p>
                            <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mb-4">
                                {iframeError
                                    ? 'Your browser prevented inline rendering of this file.'
                                    : 'This file type cannot be previewed inline.'}
                            </p>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-[10px] font-mono text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                            >
                                <ExternalLink className="h-3 w-3" />
                                Open in new tab
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ResumeUploader({ onResumeSelected, onResumeCleared, selectedFileName }: Props) {
    const [documents, setDocuments]         = useState<UserDocument[]>([])
    const [isLoadingDocs, setIsLoadingDocs] = useState(true)
    const [selectedId, setSelectedId]       = useState<number | null>(null)
    const [previewId, setPreviewId]         = useState<number | null>(null)
    // ID of the document currently showing a delete confirmation prompt
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
    // IDs of documents currently being deleted (spinner state)
    const [deletingIds, setDeletingIds]     = useState<Set<number>>(new Set())
    const [uploadState, setUploadState]     = useState<UploadState>('idle')
    const [uploadError, setUploadError]     = useState<string | null>(null)
    const [isDragging, setIsDragging]       = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const load = async () => {
            setIsLoadingDocs(true)
            try { setDocuments(await api.getUserDocuments()) }
            catch (e) { console.error('Failed to load documents:', e) }
            finally { setIsLoadingDocs(false) }
        }
        void load()
    }, [])

    // ── Upload ────────────────────────────────────────────────────────────────

    const handleFileUpload = async (file: File) => {
        setUploadState('uploading')
        setUploadError(null)
        try {
            let clientText = ''
            try { clientText = await file.text() } catch { /* PDF binary — not fatal */ }

            await api.uploadDocument(file)

            const docs = await api.getUserDocuments()
            setDocuments(docs)

            const newest = docs[0]
            if (newest) {
                setSelectedId(newest.id)
                setPreviewId(newest.id)
                onResumeSelected(clientText.trim() || newest.name, newest.name, newest.s3Key)
            }

            setUploadState('success')
            setTimeout(() => setUploadState('idle'), 2000)
        } catch (e: any) {
            setUploadError(e?.message ?? 'Upload failed. Please try again.')
            setUploadState('error')
        }
    }

    // ── Select ────────────────────────────────────────────────────────────────

    const handleSelectExisting = (doc: UserDocument) => {
        if (selectedId === doc.id) {
            setSelectedId(null)
            onResumeCleared()
            return
        }
        setSelectedId(doc.id)
        onResumeSelected(doc.content ?? doc.name, doc.name, doc.s3Key)
    }

    // ── Preview ───────────────────────────────────────────────────────────────

    const handleTogglePreview = (e: React.MouseEvent, docId: number) => {
        e.stopPropagation()
        setPreviewId(prev => prev === docId ? null : docId)
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    // Two-step: first click shows confirmation inline, second click deletes.
    // Clicking anywhere else (or the × button) cancels.

    const handleDeleteClick = (e: React.MouseEvent, docId: number) => {
        e.stopPropagation()
        setConfirmDeleteId(docId)
    }

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setConfirmDeleteId(null)
    }

    const handleConfirmDelete = async (e: React.MouseEvent, doc: UserDocument) => {
        e.stopPropagation()
        setConfirmDeleteId(null)
        setDeletingIds(prev => new Set(prev).add(doc.id))

        try {
            await api.deleteDocument(doc.s3Key)

            // If the deleted document was selected, clear the selection
            if (selectedId === doc.id) {
                setSelectedId(null)
                onResumeCleared()
            }
            // Close preview if it was open for this doc
            if (previewId === doc.id) setPreviewId(null)

            // Reload the list
            setDocuments(await api.getUserDocuments())
        } catch (e: any) {
            console.error('Failed to delete document:', e)
        } finally {
            setDeletingIds(prev => {
                const next = new Set(prev)
                next.delete(doc.id)
                return next
            })
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) void handleFileUpload(file)
    }

    const hasDocuments = documents.length > 0

    return (
        // Dismiss any pending delete confirmation when clicking outside a row
        <div
            className="h-full flex flex-col bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors duration-300 relative"
            onClick={() => setConfirmDeleteId(null)}
        >
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-8 h-px bg-blue-500 z-10" aria-hidden />
            <span className="absolute top-0 left-0 h-8 w-px bg-blue-500 z-10" aria-hidden />
            <span className="absolute bottom-0 right-0 w-8 h-px bg-blue-500 z-10" aria-hidden />
            <span className="absolute bottom-0 right-0 h-8 w-px bg-blue-500 z-10" aria-hidden />

            {/* Terminal header */}
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <div>
                        <p className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                            Resume
                        </p>
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mt-0.5">
                            Select or upload a resume to personalise your interview
                        </p>
                    </div>
                </div>
                {selectedFileName && (
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                            Selected
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 p-5">

                {/* ── Existing resumes ── */}
                {isLoadingDocs ? (
                    <div className="flex items-center gap-2 py-2">
                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                            Loading resumes…
                        </span>
                    </div>
                ) : hasDocuments ? (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1 h-1 rounded-full bg-blue-500" />
                            <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                                01 — Your resumes
                            </span>
                        </div>

                        <div className="flex flex-col gap-px">
                            {documents.map((doc, i) => {
                                const isSelected     = selectedId      === doc.id
                                const isPreviewOpen  = previewId       === doc.id
                                const isConfirming   = confirmDeleteId === doc.id
                                const isDeleting     = deletingIds.has(doc.id)
                                const hasPreview     = Boolean(doc.viewUrl)

                                return (
                                    <motion.div
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 3 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        transition={{ delay: i * 0.05 }}
                                        layout
                                    >
                                        {/* ── Document row ── */}
                                        <div
                                            className={[
                                                'flex items-center gap-3 px-4 py-3 border transition-colors duration-150',
                                                isDeleting
                                                    ? 'border-neutral-200 dark:border-neutral-800 opacity-50 pointer-events-none'
                                                    : isConfirming
                                                        ? 'border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10'
                                                        : isSelected
                                                            ? 'border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/20'
                                                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900',
                                                isPreviewOpen ? 'border-b-0' : '',
                                            ].join(' ')}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* Select area */}
                                            <button
                                                type="button"
                                                onClick={() => !isConfirming && handleSelectExisting(doc)}
                                                className="flex items-center gap-3 flex-1 min-w-0 text-left"
                                                disabled={isDeleting}
                                            >
                                                <div className={[
                                                    'w-8 h-8 border flex items-center justify-center shrink-0 transition-colors',
                                                    isDeleting
                                                        ? 'border-neutral-200 dark:border-neutral-800'
                                                        : isConfirming
                                                            ? 'border-red-300 dark:border-red-800 bg-red-100/50 dark:bg-red-900/20'
                                                            : isSelected
                                                                ? 'border-blue-300 dark:border-blue-700 bg-blue-100/50 dark:bg-blue-900/30'
                                                                : 'border-neutral-200 dark:border-neutral-800',
                                                ].join(' ')}>
                                                    {isDeleting ? (
                                                        <span className="w-3 h-3 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <FileText className={`h-3.5 w-3.5 ${
                                                            isConfirming ? 'text-red-500 dark:text-red-400'
                                                                : isSelected ? 'text-blue-600 dark:text-blue-400'
                                                                    : 'text-neutral-400 dark:text-neutral-600'
                                                        }`} />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-[12px] font-mono font-semibold truncate ${
                                                        isConfirming ? 'text-red-600 dark:text-red-400'
                                                            : isSelected ? 'text-blue-700 dark:text-blue-300'
                                                                : 'text-neutral-800 dark:text-neutral-200'
                                                    }`}>
                                                        {doc.name}
                                                    </p>
                                                    {doc.uploadedAt && !isConfirming && (
                                                        <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 mt-0.5">
                                                            {new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                                                                month: 'short', day: 'numeric', year: 'numeric',
                                                            })}
                                                        </p>
                                                    )}
                                                    {isConfirming && (
                                                        <p className="text-[9px] font-mono text-red-500 dark:text-red-400 mt-0.5">
                                                            Permanently deleted from S3 and vector store
                                                        </p>
                                                    )}
                                                </div>
                                            </button>

                                            {/* Right actions */}
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <AnimatePresence mode="wait">
                                                    {isConfirming ? (
                                                        /* ── Confirm / cancel buttons ── */
                                                        <motion.div
                                                            key="confirm"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleCancelDelete(e)}
                                                                className="h-6 px-2 border border-neutral-200 dark:border-neutral-800 text-[9px] font-mono text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors uppercase tracking-widest"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleConfirmDelete(e, doc)}
                                                                className="h-6 px-2 border border-red-400 dark:border-red-700 bg-red-500 text-white text-[9px] font-mono hover:bg-red-600 transition-colors uppercase tracking-widest"
                                                            >
                                                                Delete
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="actions"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex items-center gap-1.5"
                                                        >
                                                            {/* Preview toggle */}
                                                            {hasPreview && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => handleTogglePreview(e, doc.id)}
                                                                    title={isPreviewOpen ? 'Close preview' : 'Preview document'}
                                                                    className={[
                                                                        'w-7 h-7 border flex items-center justify-center transition-colors',
                                                                        isPreviewOpen
                                                                            ? 'border-blue-400 dark:border-blue-600 bg-blue-100/50 dark:bg-blue-950/30'
                                                                            : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20',
                                                                    ].join(' ')}
                                                                >
                                                                    {isPreviewOpen
                                                                        ? <EyeOff className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                                                                        : <Eye    className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />
                                                                    }
                                                                </button>
                                                            )}

                                                            {/* Delete button — first click shows confirmation */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleDeleteClick(e, doc.id)}
                                                                title="Delete document"
                                                                className="w-7 h-7 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                                            >
                                                                <Trash2 className="h-3 w-3 text-neutral-400 dark:text-neutral-600" />
                                                            </button>

                                                            {/* Selected checkmark */}
                                                            <AnimatePresence>
                                                                {isSelected && (
                                                                    <motion.div
                                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        exit={{ scale: 0.5, opacity: 0 }}
                                                                        className="w-5 h-5 bg-blue-600 flex items-center justify-center"
                                                                    >
                                                                        <Check className="h-3 w-3 text-white" />
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* ── Inline PDF viewer ── */}
                                        <AnimatePresence>
                                            {isPreviewOpen && doc.viewUrl && (
                                                <PdfViewer
                                                    key={`preview-${doc.id}`}
                                                    url={doc.viewUrl}
                                                    fileName={doc.name}
                                                    onClose={() => setPreviewId(null)}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 px-4 py-3">
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
                            No resumes on file yet — upload one below.
                        </p>
                    </div>
                )}

                {/* ── Upload new resume ── */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                            {hasDocuments ? '02 — Upload new resume' : '01 — Upload a resume'}
                        </span>
                    </div>

                    <div
                        className={[
                            'border-2 border-dashed p-6 transition-colors duration-150',
                            isDragging
                                ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                : uploadState === 'success'
                                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10'
                                    : uploadState === 'error'
                                        ? 'border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10'
                                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
                        ].join(' ')}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        <AnimatePresence mode="wait">
                            {uploadState === 'uploading' ? (
                                <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="flex flex-col items-center gap-3"
                                >
                                    <div className="w-8 h-8 border border-blue-300 dark:border-blue-700 flex items-center justify-center">
                                        <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                    <p className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest">Uploading…</p>
                                </motion.div>
                            ) : uploadState === 'success' ? (
                                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                            className="flex flex-col items-center gap-3"
                                >
                                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center">
                                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Uploaded & selected</p>
                                </motion.div>
                            ) : uploadState === 'error' ? (
                                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="flex flex-col items-center gap-3"
                                >
                                    <div className="w-8 h-8 bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 flex items-center justify-center">
                                        <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                                    </div>
                                    <p className="text-[10px] font-mono text-red-500 dark:text-red-400 text-center">{uploadError}</p>
                                    <button
                                        type="button"
                                        onClick={() => { setUploadState('idle'); setUploadError(null) }}
                                        className="text-[9px] font-mono text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 uppercase tracking-widest underline transition-colors"
                                    >
                                        Try again
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="flex items-start gap-4"
                                >
                                    <div className="w-9 h-9 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
                                        <Upload className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Drop your resume here</p>
                                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mb-3">PDF, DOCX, or TXT — read as plain text</p>
                                        <div className="relative inline-block">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                                                accept=".txt,.md,.doc,.docx,.pdf,text/plain,application/pdf"
                                                onChange={(e) => {
                                                    const f = e.target.files?.[0]
                                                    if (f) void handleFileUpload(f)
                                                    e.target.value = ''
                                                }}
                                            />
                                            <div className="inline-flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 px-3 py-1.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-150">
                                                <Plus className="h-3 w-3" />
                                                Browse files
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-neutral-100 dark:border-neutral-800 px-5 py-3 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
                <p className="text-[9px] font-mono uppercase tracking-widest">
                    {selectedFileName ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3 w-3" />
                            {selectedFileName}
                        </span>
                    ) : (
                        <span className="text-neutral-400 dark:text-neutral-600">No resume selected — optional</span>
                    )}
                </p>
                {selectedFileName && (
                    <button
                        type="button"
                        onClick={() => { setSelectedId(null); setPreviewId(null); onResumeCleared() }}
                        className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 hover:text-red-500 dark:hover:text-red-400 uppercase tracking-widest transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    )
}