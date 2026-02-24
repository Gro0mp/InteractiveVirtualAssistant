// `src/components/documents/DocumentUploadArea.tsx`

import React, { useEffect, useMemo, useState } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { api } from '../../services/api'

type CurrentUser = { id: number; username: string; email: string }

export function DocumentUploadArea() {
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

    useEffect(() => {
        let mounted = true
        api.getCurrentUser()
            .then((u) => {
                if (mounted) setCurrentUser(u)
            })
            .catch(() => {
                if (mounted) setCurrentUser(null)
            })
        return () => {
            mounted = false
        }
    }, [])

    const userId = currentUser?.id != null ? String(currentUser.id) : undefined

    const fileUrl = useMemo(() => {
        if (!file) return null
        return URL.createObjectURL(file)
    }, [file])

    useEffect(() => {
        if (!fileUrl) return
        return () => URL.revokeObjectURL(fileUrl)
    }, [fileUrl])

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) handleFileSelection(droppedFile)
    }

    const handleSaveDocument = async (selectedFile: File) => {
        console.log(`Uploading with userId:`, userId)
        await api.uploadDocument(selectedFile, userId)
    }

    const handleFileSelection = async (selectedFile: File) => {
        setIsUploading(true)
        try {
            await handleSaveDocument(selectedFile)
            alert('Document uploaded successfully!')
            setFile(selectedFile)
        } catch {
            alert('Failed to upload document. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }

    const clearFile = () => setFile(null)

    const isPdf = file?.type === 'application/pdf' || file?.name.toLowerCase().endsWith('.pdf')

    return (
        <div className="h-full flex flex-col bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden relative">
            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`flex-1 flex flex-col items-center justify-center p-8 transition-colors ${isDragging ? 'bg-violet-50 border-violet-300' : 'bg-white'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div
                            className={`w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 transition-colors ${isDragging ? 'border-violet-400 bg-violet-50/50' : 'border-slate-300 hover:border-violet-300 hover:bg-slate-50'}`}
                        >
                            {isUploading ? (
                                <div className="text-center">
                                    <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
                                    <p className="text-lg font-medium text-slate-900">Uploading document...</p>
                                    <p className="text-sm text-slate-500 mt-1">Please wait while we process your file\.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mb-6">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload your document</h3>
                                    <p className="text-slate-500 text-center max-w-sm mb-8">
                                        Drag and drop your file here, or click to browse. Supports PDF, DOCX, and TXT files.
                                    </p>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) handleFileSelection(e.target.files[0])
                                            }}
                                            accept=".pdf,.docx,.txt"
                                        />
                                        <Button size="lg">Browse Files</Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 bg-slate-100 p-4 sm:p-6 lg:p-8 overflow-y-auto flex justify-center"
                    >
                        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg min-h-[800px] p-6 sm:p-10 relative">
                            <button
                                onClick={clearFile}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                aria-label="Remove file"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6 pb-4 border-b border-slate-100 flex items-center">
                                <FileText className="w-8 h-8 text-violet-600 mr-4" />
                                <div className="min-w-0">
                                    <h2 className="text-2xl font-bold text-slate-900 truncate">{file.name}</h2>
                                    <p className="text-sm text-slate-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • Last modified {new Date(file.lastModified).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {isPdf && fileUrl ? (
                                <div className="w-full">
                                    <iframe
                                        title="PDF preview"
                                        src={fileUrl}
                                        className="w-full h-[75vh] rounded-md border border-slate-200"
                                    />
                                </div>
                            ) : (
                                <div className="text-slate-600">
                                    <p className="font-medium text-slate-900 mb-2">Preview not available</p>
                                    <p className="text-sm">
                                        Only PDF preview is wired up right now. You uploaded a <span className="font-mono">{file.type || 'unknown'}</span> file.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
