'use client'

import React, {useEffect, useState} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {motion} from 'framer-motion'
import {DashboardLayout} from '../components/DashboardLayout'
import {FeedbackActionBar} from '../components/interview-feedback/FeedbackActionBar'
import {FeedbackScoreHeader} from '../components/interview-feedback/FeedbackScoreHeader'
import {FeedbackSkillsPanel} from '../components/interview-feedback/FeedbackSkillsPanel'
import {FeedbackStrengthsWeaknesses} from '../components/interview-feedback/FeedbackStrengthsWeaknesses'
import {FeedbackTranscript} from '../components/interview-feedback/FeedbackTranscript'
import {api} from '../services/api'
import type {
    InterviewSessionResponse,
    InterviewMessageHistoryListResponse,
    InterviewFeedbackResponse,
} from '../services/api'
import type {FeedbackMeta} from '../components/interview-feedback/FeedbackScoreHeader'
import type {FeedbackSkill} from '../components/interview-feedback/FeedbackSkillsPanel'
import type {FeedbackPoint} from '../components/interview-feedback/FeedbackStrengthsWeaknesses'
import type {TranscriptEntry} from '../components/interview-feedback/FeedbackTranscript'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Pairs alternating INTERVIEWER / CANDIDATE messages into transcript entries
function buildTranscript(messages: InterviewMessageHistoryListResponse[]): TranscriptEntry[] {
    const entries: TranscriptEntry[] = []
    const sorted = [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    for (let i = 0; i < sorted.length - 1; i++) {
        const msg = sorted[i]
        const next = sorted[i + 1]
        if (msg.role === 'INTERVIEWER' && next.role === 'CANDIDATE') {
            entries.push({question: msg.content, answer: next.content})
            i++ // skip the paired answer
        }
    }
    return entries
}

// The backend returns strengths/improvements as plain string[] — each item is a
// full sentence. FeedbackStrengthsWeaknesses expects { title, detail }, so we split
// on the first " — " or ": " separator if present, otherwise the whole string is
// the title and detail is left empty.
function toFeedbackPoints(items: string[]): FeedbackPoint[] {
    return items.map(item => {
        const dashIdx = item.indexOf(' — ')
        const colonIdx = item.indexOf(': ')
        const splitAt = dashIdx !== -1 ? dashIdx : colonIdx
        if (splitAt !== -1) {
            return {
                title: item.slice(0, splitAt),
                detail: item.slice(splitAt + (dashIdx !== -1 ? 3 : 2)),
            }
        }
        return {title: item, detail: ''}
    })
}

// Maps the five skill fields from the feedback response into FeedbackSkill[]
function buildSkills(f: InterviewFeedbackResponse): FeedbackSkill[] {
    return [
        {label: 'Communication', score: f.communicationScore, comment: f.communicationFeedback},
        {label: 'Technical Depth', score: f.technicalDepthScore, comment: f.technicalDepthFeedback},
        {label: 'Confidence', score: f.confidenceScore, comment: f.confidenceFeedback},
        {label: 'Clarity', score: f.clarityScore, comment: f.clarityFeedback},
        {label: 'Problem Solving', score: f.problemSolvingScore, comment: f.problemSolvingFeedback},
    ]
}

// Zero-score placeholder skills shown while feedback is still generating
const EMPTY_SKILLS: FeedbackSkill[] = [
    {label: 'Communication', score: 0},
    {label: 'Technical Depth', score: 0},
    {label: 'Confidence', score: 0},
    {label: 'Clarity', score: 0},
    {label: 'Problem Solving', score: 0},
]

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonPanel({rows = 3}: { rows?: number }) {
    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
            <div
                className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <div className="h-2 w-24 bg-neutral-200 dark:bg-neutral-800 animate-pulse"/>
            </div>
            <div className="px-5 py-5 space-y-4">
                {Array.from({length: rows}).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div
                            className="h-2 bg-neutral-100 dark:bg-neutral-800 animate-pulse"
                            style={{width: `${60 + i * 10}%`}}
                        />
                        <div className="h-px bg-neutral-100 dark:bg-neutral-800 animate-pulse"/>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function InterviewFeedbackPage() {
    const router = useRouter()
    const params = useParams<{ sessionId: string }>()
    const sessionId = Number(params?.sessionId)

    const [session, setSession] = useState<InterviewSessionResponse | null>(null)
    const [messages, setMessages] = useState<InterviewMessageHistoryListResponse[]>([])
    const [feedback, setFeedback] = useState<InterviewFeedbackResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    // true when the session is complete but the AI feedback job hasn't finished yet
    const [feedbackPending, setFeedbackPending] = useState(false)

    // ── Initial load ──────────────────────────────────────────────────────────

    useEffect(() => {
        if (!sessionId || !Number.isFinite(sessionId)) {
            setError('Invalid session ID.')
            setIsLoading(false)
            return
        }

        const load = async () => {
            setIsLoading(true)
            setError(null)
            try {
                // Session list + messages always load together
                const [sessionsData, messagesData] = await Promise.all([
                    api.getInterviewSessions(),
                    api.getInterviewMessages(sessionId),
                ])
                setSession(sessionsData.find(s => s.id === sessionId) ?? null)
                setMessages(messagesData)

                // Feedback is generated asynchronously by the backend after the
                // last message is saved. It may not be ready immediately.
                try {
                    const feedbackData = await api.getInterviewSessionFeedback(sessionId)
                    setFeedback(feedbackData)
                } catch (feedbackErr: any) {
                    if (feedbackErr?.message === 'FEEDBACK_NOT_FOUND') {
                        // Generation still in progress — poll for it
                        setFeedbackPending(true)
                    } else {
                        // Non-fatal — transcript and session info still render
                        console.error('Feedback fetch failed:', feedbackErr)
                    }
                }
            } catch (e: any) {
                setError(e?.message ?? 'Failed to load session.')
            } finally {
                setIsLoading(false)
            }
        }

        void load()
    }, [sessionId])

    // ── Poll until feedback arrives ───────────────────────────────────────────
    // The backend generates feedback in a virtual thread immediately after the last
    // message, but the AI call itself takes a few seconds. We poll every 3s for up
    // to 30s (10 attempts), then give up gracefully.

    useEffect(() => {
        if (!feedbackPending || feedback) return

        const POLL_MS = 3000
        const MAX_POLLS = 10
        let polls = 0

        const id = setInterval(async () => {
            polls++
            try {
                const feedbackData = await api.getInterviewSessionFeedback(sessionId)
                setFeedback(feedbackData)
                setFeedbackPending(false)
                clearInterval(id)
            } catch (e: any) {
                if (e?.message !== 'FEEDBACK_NOT_FOUND' || polls >= MAX_POLLS) {
                    setFeedbackPending(false)
                    clearInterval(id)
                }
            }
        }, POLL_MS)

        return () => clearInterval(id)
    }, [feedbackPending, feedback, sessionId])

    // ── Derived data ──────────────────────────────────────────────────────────

    const transcript = buildTranscript(messages)
    const candidateMessages = messages.filter(m => m.role === 'CANDIDATE')
    const totalQuestions = messages.filter(m => m.role === 'INTERVIEWER').length

    const skills: FeedbackSkill[] = feedback ? buildSkills(feedback) : EMPTY_SKILLS
    const strengths: FeedbackPoint[] = feedback ? toFeedbackPoints(feedback.strengths) : []
    const improvements: FeedbackPoint[] = feedback ? toFeedbackPoints(feedback.improvements) : []

    const meta: FeedbackMeta = {
        sessionTitle: feedback?.sessionTitle ?? session?.description ?? 'Mock Interview',
        date: session?.createdAt
            ? new Date(session.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
            })
            : '—',
        totalQuestions,
        answeredQuestions: candidateMessages.length,
        overallScore: feedback?.overallScore ?? 0,
        status: (session?.status as 'COMPLETED' | 'IN_PROGRESS') ?? 'IN_PROGRESS',
    }

    const handleBack = () => router.back()
    const handleRetry = () => router.push('/interview/new')
    const handleDashboard = () => router.push('/interview-dashboard')

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <DashboardLayout>
            <div className="relative min-h-full font-mono">
                {/* Grid texture */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <defs>
                        <pattern id="feedback-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#feedback-grid)"
                          className="text-neutral-900 dark:text-white"/>
                </svg>
                <div
                    className="absolute top-0 left-1/3 w-[500px] h-64 bg-blue-400/5 dark:bg-blue-600/8 blur-[100px] pointer-events-none"
                    aria-hidden
                />

                <div className="relative space-y-4 pb-8">

                    {/* ── Page header ── */}
                    <motion.div
                        initial={{opacity: 0, y: -6}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.35}}
                        className="flex items-end justify-between gap-4 pt-1 pb-2 border-b border-neutral-200 dark:border-neutral-800"
                    >
                        <div>
                            <p className="text-[9px] font-mono font-medium text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-1">
                                Interview Practice
                            </p>
                            <h1
                                className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight"
                                style={{fontFamily: "'DM Mono', monospace"}}
                            >
                                Session Feedback
                            </h1>
                        </div>
                        {session?.status === 'COMPLETED' && (
                            <div className="flex items-center gap-2 pb-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
                                <span
                                    className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                                    Completed
                                </span>
                            </div>
                        )}
                    </motion.div>

                    {/* ── Hard error (invalid ID / session not found) ── */}
                    {error && (
                        <div
                            className="bg-white dark:bg-neutral-950 border border-red-200 dark:border-red-900 px-5 py-8 text-center">
                            <span className="w-1 h-1 rounded-full bg-red-500 inline-block mb-3"/>
                            <p className="text-[10px] font-mono text-red-500 dark:text-red-400 uppercase tracking-widest">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* ── Loading skeletons ── */}
                    {isLoading && !error && (
                        <>
                            <SkeletonPanel rows={2}/>
                            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
                                <SkeletonPanel rows={5}/>
                                <SkeletonPanel rows={4}/>
                            </div>
                            <SkeletonPanel rows={3}/>
                        </>
                    )}

                    {/* ── Main content ── */}
                    {!isLoading && !error && session && (
                        <>
                            {/* Action bar */}
                            <motion.div
                                initial={{opacity: 0, y: 6}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.3}}
                            >
                                <FeedbackActionBar
                                    sessionTitle={meta.sessionTitle}
                                    onBack={handleBack}
                                    onRetry={handleRetry}
                                    onBackToDashboard={handleDashboard}
                                />
                            </motion.div>

                            {/* Feedback still generating — pulsing banner */}
                            {feedbackPending && (
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    className="border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/10 px-5 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0"/>
                                        <p className="text-[10px] font-mono text-blue-700 dark:text-blue-400 uppercase tracking-widest">
                                            AI feedback is being generated — this page updates automatically…
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Score header */}
                            <motion.div
                                initial={{opacity: 0, y: 8}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.4, delay: 0.05}}
                            >
                                <FeedbackScoreHeader meta={meta}/>
                            </motion.div>

                            {/* Skills panel + Strengths/Weaknesses */}
                            <motion.div
                                initial={{opacity: 0, y: 8}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.4, delay: 0.1}}
                                className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4"
                            >
                                <FeedbackSkillsPanel skills={skills}/>

                                <FeedbackStrengthsWeaknesses
                                    strengths={strengths}
                                    improvements={improvements}
                                    summary={
                                        feedback?.summary ??
                                        (feedbackPending
                                            ? 'AI feedback is being prepared…'
                                            : session.status === 'COMPLETED'
                                                ? `You completed all ${totalQuestions} questions.`
                                                : `This session was not fully completed (${candidateMessages.length} of ${totalQuestions} questions answered).`)
                                    }
                                />
                            </motion.div>

                            {/* Transcript */}
                            {transcript.length > 0 && (
                                <motion.div
                                    initial={{opacity: 0, y: 8}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.4, delay: 0.15}}
                                >
                                    <FeedbackTranscript entries={transcript}/>
                                </motion.div>
                            )}

                            {/* Incomplete session notice */}
                            {session.status !== 'COMPLETED' && (
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 0.2}}
                                    className="border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/10 px-5 py-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"/>
                                        <div>
                                            <p className="text-[10px] font-mono font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">
                                                Session incomplete
                                            </p>
                                            <p className="text-[10px] font-mono text-amber-600/80 dark:text-amber-500/80 leading-relaxed">
                                                Skill scores and full feedback are only available after finishing all
                                                questions.
                                                You answered {candidateMessages.length} of {totalQuestions} questions.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}