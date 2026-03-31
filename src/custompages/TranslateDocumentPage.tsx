import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '../components/DashboardLayout'
import { TranslateUploadCard } from '../components/translate/TranslateUploadCard'
import { TranslateOptionsCard } from '../components/translate/TranslateOptionsCard'
import { TranslateResultCard } from '../components/translate/TranslateResultCard'

export type TranslateLanguage = {
    code: string
    label: string
}

const LANGUAGES: TranslateLanguage[] = [
    { code: 'auto', label: 'Auto-detect' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'zh', label: 'Chinese (Simplified)' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
]

export function TranslateDocumentPage() {
    const [file, setFile] = useState<File | null>(null)
    const [sourceLang, setSourceLang] = useState(LANGUAGES[0])
    const [targetLang, setTargetLang] = useState(LANGUAGES[1])

    const [isWorking, setIsWorking] = useState(false)
    const [translatedText, setTranslatedText] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    return (
        <DashboardLayout>
            <div className="relative min-h-screen bg-white text-slate-950 font-[Manrope]">
                {/* subtle background wash to match Dashboard */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_0%,rgba(43,109,255,0.10),transparent_60%),radial-gradient(900px_620px_at_80%_10%,rgba(109,224,255,0.12),transparent_55%)]" />
                </div>

                <div className="mx-auto max-w-[1280px] px-5 pb-14 pt-7">
                    <div className="mb-6">
                        <motion.h1
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold tracking-[-0.02em]"
                        >
                            Translate Documents
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="mt-1.5 text-[13px] leading-snug text-slate-900/60"
                        >
                            Upload a document, preview it, and generate a translated version.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                        {/* Left column */}
                        <div className="flex flex-col gap-4">
                            <TranslateUploadCard
                                file={file}
                                onFileChange={(next: File | null) => {
                                    setFile(next)
                                    setTranslatedText('')
                                    setStatus('')
                                }}
                                isWorking={isWorking}
                            />

                            <TranslateResultCard
                                file={file}
                                isWorking={isWorking}
                                status={status}
                                translatedText={translatedText}
                                onClear={() => {
                                    setTranslatedText('')
                                    setStatus('')
                                }}
                            />
                        </div>

                        {/* Right column */}
                        <aside className="flex flex-col gap-4">
                            <TranslateOptionsCard
                                languages={LANGUAGES}
                                source={sourceLang}
                                target={targetLang}
                                onSourceChange={setSourceLang}
                                onTargetChange={setTargetLang}
                                file={file}
                                isWorking={isWorking}
                                onTranslate={async () => {
                                    if (!file || isWorking) return

                                    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(file.name)
                                    if (isImage) {
                                        setTranslatedText('')
                                        setStatus('Image translation isn’t wired yet on the backend. Add OCR (e.g., Tesseract/Google Vision) and we can enable this.')
                                        return
                                    }

                                    setIsWorking(true)
                                    setStatus('Uploading + translating…')
                                    try {
                                        const { api } = await import('../services/api')
                                        const result = await api.translateDocument(file)
                                        setTranslatedText(result.toString)
                                        setStatus('Translation complete')
                                    } catch (e) {
                                        setStatus(e instanceof Error ? e.message : 'Failed to translate')
                                    } finally {
                                        setIsWorking(false)
                                    }
                                }}
                            />

                            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur">
                                <div className="text-sm font-semibold text-slate-900">Tip</div>
                                <div className="mt-1 text-[13px] leading-snug text-slate-900/60">
                                    If your PDF doesn’t preview, try downloading it first and re-uploading. Some PDFs block browser embedding.
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
