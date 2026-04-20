'use client'

import React, {Suspense, useEffect, useState} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {DashboardLayout} from '../components/DashboardLayout'
import {InterviewScene} from '../components/interview/InterviewScene'
import {InterviewSetupPanel} from '../components/interview/InterviewSetupPanel'
import {InterviewSelectionPanel} from '../components/interview/InterviewSelectionPanel'
import {ResumeUploader} from '../components/interview/ResumeUploader'
import type {InterviewSetupValue} from '../components/interview/InterviewSetupPanel'
import type {InterviewSessionResponse} from '../services/api'
import {api} from '../services/api'
import {useAuth} from '../context/AuthContext'

type View = 'selection' | 'setup'

export function InterviewPage() {
    const params = useParams<{ sessionId?: string }>()
    const router = useRouter()
    const {user} = useAuth()

    const [view, setView] = useState<View>(() =>
        params?.sessionId === 'new' ? 'setup' : 'selection'
    )

    // ── Session list ──────────────────────────────────────────────────────────
    const [sessions, setSessions] = useState<InterviewSessionResponse[]>([])
    const [isLoadingSessions, setIsLoadingSessions] = useState(false)

    const loadSessions = async () => {
        if (!user?.id) return
        setIsLoadingSessions(true)
        try {
            setSessions(await api.getInterviewSessions())
        } catch (e) {
            console.error('Failed to load sessions:', e)
        } finally {
            setIsLoadingSessions(false)
        }
    }

    useEffect(() => {
        if (view === 'selection') void loadSessions()
    }, [view, user?.id])

    // ── Setup state ───────────────────────────────────────────────────────────
    const [setup, setSetup] = useState<InterviewSetupValue | null>(null)
    const [isSending, setIsSending] = useState(false)
    const [animation, setAnimation] = useState<string | null>(null)

    // Resume selection state — lifted here so InterviewPage can pass resume text
    // into createInterviewSession alongside the job description
    const [resumeText, setResumeText] = useState<string | null>(null)
    const [resumeFileName, setResumeFileName] = useState<string | undefined>(undefined)

    const [resumeS3Key, setResumeS3Key]    = useState<string | null>(null)

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleCreateNew = () => {
        setSetup(null)
        setResumeText(null)
        setResumeFileName(undefined)
        setResumeS3Key(null)
        setView('setup')
        window.history.replaceState(null, '', '/interview/new')
    }

    const handleOpenSession = (sessionId: number) => {
        router.push(`/interview/${sessionId}`)
    }

    const handleBack = () => {
        setView('selection')
        window.history.replaceState(null, '', '/interview')
    }

    const handleOpenFeedback = (sessionId: number) => {
        router.push(`/interview/${sessionId}/feedback`)
    }

    const handleDeleteSession = async (sessionId: number) => {
        try {
            await api.deleteInterviewSession(sessionId)
            await loadSessions()
        } catch (e) {
            console.error('Failed to delete session:', e)
        }
    }

    const handleStart = async (nextSetup: InterviewSetupValue) => {
        if (!user?.id || isSending) return
        setIsSending(true)
        setAnimation('Thinking')
        try {
            // The job description is stored as-is. The resume is stored separately
            // via resumeS3Key so the backend can scope RAG retrieval to exactly
            // that document's chunks during the interview.
            const session = await api.createInterviewSession(
                nextSetup.jobDescriptionText,
                nextSetup.interviewLength ?? 'REGULAR',
                resumeS3Key ?? undefined
            )
            router.push(`/interview/${session.id}`)
        } catch (err) {
            if (err instanceof Error && err.message === 'LIMIT_EXCEEDED') {
                alert('You have reached your interview limit. Upgrade your plan to create more.')
            } else {
                console.error('Failed to start interview:', err)
            }
        } finally {
            setAnimation(null)
            setIsSending(false)
        }
    }

    // ── Left panel ────────────────────────────────────────────────────────────
    // Selection view → 3D assistant as before
    // Setup view     → ResumeUploader so the user can attach their CV
    const leftPanel = () => {
        if (view === 'setup') {
            return (
                <ResumeUploader
                    selectedFileName={resumeFileName}
                    onResumeSelected={(text, fileName, s3Key) => {
                        setResumeText(text)
                        setResumeFileName(fileName)
                        setResumeS3Key(s3Key ?? null)
                    }}
                    onResumeCleared={() => {
                        setResumeText(null)
                        setResumeFileName(undefined)
                        setResumeS3Key(null)
                    }}
                />
            )
        }
        return (
            <Suspense fallback={null}>
                <InterviewScene animationName={animation ?? undefined}/>
            </Suspense>
        )
    }

    // ── Right panel ───────────────────────────────────────────────────────────
    const rightPanel = () => {
        if (view === 'setup') {
            return (
                <InterviewSetupPanel
                    value={setup}
                    onChangeAction={setSetup}
                    onStartAction={handleStart}
                    onBackAction={handleBack}
                    isStarting={isSending}
                />
            )
        }
        return (
            <InterviewSelectionPanel
                sessions={sessions}
                isLoading={isLoadingSessions}
                onCreateNew={handleCreateNew}
                onOpen={handleOpenSession}
                onDelete={handleDeleteSession}
                onOpenFeedback={handleOpenFeedback}
            />
        )
    }

    return (
        <DashboardLayout>
            <div
                className="relative -m-4 sm:-m-6 lg:-m-8 h-[calc(100vh-3.5rem)] font-mono overflow-hidden bg-neutral-50 dark:bg-[#0A0A0A]">
                {/* Grid texture */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.025] pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <defs>
                        <pattern id="interview-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#interview-grid)"
                          className="text-neutral-900 dark:text-white"/>
                </svg>

                {/* Blue ambient glow */}
                <div
                    className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-96 bg-blue-400/6 dark:bg-blue-600/10 blur-[120px] pointer-events-none"
                    aria-hidden
                />

                {/* Section label */}
                <div className="absolute top-5 left-6 flex items-center gap-2 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/>
                    <span
                        className="text-[9px] font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                        Mock Interview — IVA
                    </span>
                </div>

                <div className="h-full w-full px-4 sm:px-6 lg:px-8 pt-12 pb-4">
                    <div className="mx-auto max-w-[1400px] h-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4">
                        {/* Left */}
                        <div className="min-h-0">
                            {leftPanel()}
                        </div>

                        {/* Right */}
                        <div className="min-h-0">
                            {rightPanel()}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}