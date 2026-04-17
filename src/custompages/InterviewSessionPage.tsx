'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { InterviewScene } from '../components/interview/InterviewScene'
import { InterviewTTSControls } from '../components/interview-session/InterviewTTSControls.tsx'
import { SessionStatusBar } from '../components/interview-session/SessionStatusBar'
import { SessionVideoTile } from '../components/interview-session/SessionVideoTile'
import { SessionSelfView } from '../components/interview-session/SessionSelfView'
import { SessionChatDrawer } from '../components/interview-session/SessionChatDrawer'
import { SessionControlBar } from '../components/interview-session/SessionControlBar'
import type { InterviewMessageHistoryListResponse } from '../services/api'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

// How long to wait after completion before auto-redirecting to feedback.
// This gives the user time to read the final message and for TTS to finish.
const REDIRECT_DELAY_MS = 5000

export function InterviewSessionPage() {
    const params = useParams<{ sessionId: string }>()
    const router = useRouter()
    const { user } = useAuth()
    const sessionId = Number(params?.sessionId)

    // ── Session state ─────────────────────────────────────────────────────────
    const [sessionTitle, setSessionTitle] = useState('Mock Interview')
    const [messages, setMessages] = useState<InterviewMessageHistoryListResponse[]>([])
    const [isSending, setIsSending] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [questionProgress, setQuestionProgress] = useState<{ answered: number; total: number } | null>(null)
    const [audio, setAudio] = useState<string | null>(null)
    const [animation, setAnimation] = useState<string | null>(null)

    // Tracks whether the interview completed *during this session* (not on a prior visit).
    // Only this flag triggers the auto-redirect — prevents bouncing the user away
    // when they simply revisit a session that was already completed.
    const [completedDuringSession, setCompletedDuringSession] = useState(false)

    // Counts down seconds remaining before the redirect fires
    const [redirectCountdown, setRedirectCountdown] = useState(Math.ceil(REDIRECT_DELAY_MS / 1000))

    // ── UI state ──────────────────────────────────────────────────────────────
    const [isMuted, setIsMuted] = useState(false)
    const [isCameraOff, setIsCameraOff] = useState(true)
    const [isChatOpen, setIsChatOpen] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        // If the ID isn't a valid number, kick them back to the dashboard
        if (isNaN(sessionId)) {
            router.replace('/interview')
        }
    }, [sessionId, router])

    // ── Auto-redirect on completion ───────────────────────────────────────────
    useEffect(() => {
        if (!completedDuringSession) return

        // Countdown ticker — updates every second so the UI can show "Redirecting in Xs"
        const countdownInterval = setInterval(() => {
            setRedirectCountdown(prev => Math.max(0, prev - 1))
        }, 1000)

        // The actual redirect after the full delay
        const redirectTimeout = setTimeout(() => {
            router.push(`/interview/${sessionId}/feedback`)
        }, REDIRECT_DELAY_MS)

        return () => {
            clearInterval(countdownInterval)
            clearTimeout(redirectTimeout)
        }
    }, [completedDuringSession, sessionId, router])

    // ── Track unread messages when chat is closed ─────────────────────────────
    const prevMessageCountRef = useRef(0)
    useEffect(() => {
        const newCount = messages.length
        if (!isChatOpen && newCount > prevMessageCountRef.current) {
            setUnreadCount(c => c + (newCount - prevMessageCountRef.current))
        }
        prevMessageCountRef.current = newCount
    }, [messages.length, isChatOpen])

    const handleToggleChat = () => {
        setIsChatOpen(o => !o)
        setUnreadCount(0)
    }

    // ── Load session title + history on mount ─────────────────────────────────
    useEffect(() => {
        if (!sessionId || !Number.isFinite(sessionId)) return

        const load = async () => {
            try {
                const [sessions, history] = await Promise.all([
                    api.getInterviewSessions(),
                    api.getInterviewMessages(sessionId),
                ])
                const session = sessions.find(s => s.id === sessionId)
                if (session) {
                    setSessionTitle(session.description || 'Mock Interview')
                    // Only set isCompleted — do NOT set completedDuringSession here.
                    // This prevents the auto-redirect from firing when revisiting an
                    // already-completed session.
                    if (session.status === 'COMPLETED') setIsCompleted(true)
                }
                const GREETING: InterviewMessageHistoryListResponse = {
                    id: -1,
                    sessionId,
                    role: 'INTERVIEWER',
                    content: "Hello! I am IVA, your interactive virtual assistant. I will be conducting your mock interview today based on the job description you provided. Whenever you are ready, please say 'I am ready to start'.",
                    createdAt: new Date().toISOString(),
                }

                const mapped: InterviewMessageHistoryListResponse[] = history.map((m) => ({
                    id: m.id,
                    sessionId: m.sessionId,
                    role: m.role === 'INTERVIEWER' ? 'INTERVIEWER' : 'CANDIDATE',
                    content: m.content,
                    createdAt: m.createdAt,
                }))

                // Prepend the greeting if the session hasn't started yet (no real messages saved)
                // or always show it first so the UI has context regardless
                setMessages(history.length === 0 ? [GREETING] : [GREETING, ...mapped])
            } catch (e) {
                console.error('Failed to load session:', e)
            }
        }
        void load()
    }, [sessionId])

    // ── Send message ──────────────────────────────────────────────────────────
    const sendMessage = async (text: string) => {
        if (!user?.id || isSending || !sessionId) return

        const userMsg: InterviewMessageHistoryListResponse = {
            id: user.id, sessionId, role: 'CANDIDATE',
            content: text, createdAt: new Date().toISOString(),
        }
        setMessages(prev => [...prev, userMsg])
        setIsSending(true)
        setAnimation('Thinking')

        try {
            const saved = await api.sendInterviewMessage(sessionId, text)
            const interviewerMsg: InterviewMessageHistoryListResponse = {
                id: user.id, sessionId, role: 'INTERVIEWER',
                content: saved.responseMessage, createdAt: new Date().toISOString(),
            }
            setMessages(prev => [...prev, interviewerMsg])

            if (saved.completed) {
                setIsCompleted(true)
                // This is the flag that triggers auto-redirect — only set when the
                // interview finishes live, not when loading a previously completed session.
                setCompletedDuringSession(true)
                setRedirectCountdown(Math.ceil(REDIRECT_DELAY_MS / 1000))
            }

            if (saved.audioUrl) setAudio(saved.audioUrl)
            setQuestionProgress({ answered: saved.questionsAnswered, total: saved.totalQuestions })
        } catch (err) {
            console.error('Failed to send message:', err)
        } finally {
            setAnimation(null)
            setIsSending(false)
        }
    }

    // ── Navigation ────────────────────────────────────────────────────────────
    const handleLeave = () => router.push('/interview')

    const handleEndCall = () => {
        if (isCompleted) {
            router.push(`/interview/${sessionId}/feedback`)
        } else {
            router.push('/interview')
        }
    }

    const handleViewFeedback = () => router.push(`/interview/${sessionId}/feedback`)

    // ── Derive speaking/thinking state for the avatar ─────────────────────────
    const isSpeaking = animation === 'Speaking'
    const isThinking = animation === 'Thinking' || isSending

    return (
        <div className="fixed inset-0 bg-neutral-950 flex flex-col font-mono overflow-hidden">
            {/* TTS audio playback */}
            <InterviewTTSControls
                audioData={audio}
                autoPlay={true}
                onPlayingStateChange={playing => {
                    if (playing) setAnimation('Speaking')
                    else setAnimation(null)
                }}
            />

            {/* Top bar */}
            <SessionStatusBar
                sessionTitle={sessionTitle}
                questionProgress={questionProgress}
                isRunning={!isCompleted && messages.length > 0}
                isCompleted={isCompleted}
                onLeave={handleLeave}
            />

            {/* Main content area — tiles + chat drawer */}
            <div className="flex-1 min-h-0 flex overflow-hidden">

                {/* Video grid */}
                <div className="flex-1 min-w-0 relative flex flex-col p-3 gap-3">

                    {/* Main interviewer tile */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="flex-1 min-h-0"
                    >
                        <SessionVideoTile
                            label="IVA Interviewer"
                            sublabel={sessionTitle}
                            isSpeaking={isSpeaking}
                            isThinking={isThinking}
                            className="w-full h-full"
                            cornerAccent="tl"
                        >
                            <Suspense fallback={
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-neutral-700 animate-pulse" />
                                        <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                                            Loading…
                                        </span>
                                    </div>
                                </div>
                            }>
                                <InterviewScene animationName={animation ?? undefined} />
                            </Suspense>
                        </SessionVideoTile>
                    </motion.div>

                    {/* Self-view — pinned bottom-right like Zoom's PiP */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 }}
                        className="absolute bottom-16 right-6 w-44 h-28 z-10"
                    >
                        <SessionSelfView
                            username={user?.username ?? 'You'}
                            isMuted={isMuted}
                            isCameraOff={isCameraOff}
                            className="w-full h-full"
                        />
                    </motion.div>

                    {/* Completed overlay — shows countdown when auto-redirect is active */}
                    {isCompleted && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-x-3 bottom-[4.5rem] flex justify-center z-20"
                        >
                            <div className="inline-flex items-center gap-3 border border-emerald-700/50 bg-neutral-950/90 px-5 py-3 backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-widest">
                                        Interview complete
                                    </p>
                                    {completedDuringSession ? (
                                        <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest">
                                            Redirecting to feedback in {redirectCountdown}s…
                                        </p>
                                    ) : (
                                        <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest">
                                            Click End to view your feedback
                                        </p>
                                    )}
                                </div>
                                {completedDuringSession && (
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/interview/${sessionId}/feedback`)}
                                        className="ml-2 border border-emerald-700/60 px-3 py-1 text-[9px] font-mono font-semibold text-emerald-400 hover:bg-emerald-900/30 transition-colors uppercase tracking-widest shrink-0"
                                    >
                                        Go now
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Chat drawer */}
                <SessionChatDrawer
                    isOpen={isChatOpen}
                    onClose={handleToggleChat}
                    messages={messages}
                    onSend={sendMessage}
                    disabled={isSending || isCompleted}
                    isCompleted={isCompleted}
                />
            </div>

            {/* Control bar */}
            <SessionControlBar
                isMuted={isMuted}
                isCameraOff={isCameraOff}
                isChatOpen={isChatOpen}
                isCompleted={isCompleted}
                onToggleMute={() => setIsMuted(m => !m)}
                onToggleCamera={() => setIsCameraOff(c => !c)}
                onToggleChat={handleToggleChat}
                onViewFeedback={handleViewFeedback}
                onEndCall={handleEndCall}
                unreadCount={unreadCount}
            />
        </div>
    )
}