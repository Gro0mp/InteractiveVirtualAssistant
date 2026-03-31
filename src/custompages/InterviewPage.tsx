import React, { Suspense, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '../components/DashboardLayout'
import { InterviewScene } from '../components/interview/InterviewScene'
import { InterviewChatPanel } from '../components/interview/InterviewChatPanel'
import { InterviewSetupPanel } from '../components/interview/InterviewSetupPanel'
import { InterviewSelectionPanel } from '../components/interview/InterviewSelectionPanel'
import type { InterviewSetupValue } from '../components/interview/InterviewSetupPanel'
import type { InterviewMessageHistoryListResponse, InterviewSessionResponse } from '../services/api'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {TTSControls} from "../components/assistant/TTSControls.tsx";

type View = 'selection' | 'setup' | 'chat'

export function InterviewPage() {
    const router = useRouter()
    const params = useParams<{ sessionId?: string }>()
    const { user } = useAuth()
    const [audio, setAudio] = useState<string | null>(null);

    // ── view state ────────────────────────────────────────────────────────────
    const [view, setView] = useState<View>(() => {
        const sid = params?.sessionId
        if (!sid || sid === 'new') return 'setup'
        return 'selection'
    })

    // ── session list ──────────────────────────────────────────────────────────
    const [sessions, setSessions] = useState<InterviewSessionResponse[]>([])
    const [isLoadingSessions, setIsLoadingSessions] = useState(false)

    // ── interview state ───────────────────────────────────────────────────────
    const [isCompleted, setIsCompleted] = useState(false)
    const [questionProgress, setQuestionProgress] = useState<{ answered: number; total: number } | null>(null)

    const loadSessions = async () => {
        if (!user?.id) return
        setIsLoadingSessions(true)
        try {
            const data = await api.getInterviewSessions(String(user.id))
            setSessions(data)
        } catch (e) {
            console.error('Failed to load sessions:', e)
        } finally {
            setIsLoadingSessions(false)
        }
    }

    useEffect(() => {
        if (view === 'selection') void loadSessions()
    }, [view, user?.id])

    // ── setup state ───────────────────────────────────────────────────────────
    const [setup, setSetup] = useState<InterviewSetupValue | null>(null)

    // ── chat state ────────────────────────────────────────────────────────────
    const [activeSessionId, setActiveSessionId] = useState<number | null>(null)

    /**
     * FIX: was typed as InterviewMessageHistoryListResponse[] but used as ChatHistoryMessage[]
     * throughout (role: 'user'/'assistant', createdAt: number). Using ChatHistoryMessage[]
     * consistently so components and sort logic all agree on the shape.
     */
    const [messages, setMessages] = useState<InterviewMessageHistoryListResponse[]>([])
    const [isSending, setIsSending] = useState(false)
    const [animation, setAnimation] = useState<string | null>(null)

    // ── route → view sync ─────────────────────────────────────────────────────
    useEffect(() => {
        const sid = params?.sessionId
        if (!sid) {
            setView('selection')
            return
        }
        if (sid === 'new') {
            setIsSending(false)
            setAnimation(null)
            setMessages([])
            setActiveSessionId(null)
            setView('setup')
            return
        }
        const parsed = Number(sid)
        if (!Number.isFinite(parsed)) {
            router.replace('/interview')
            return
        }
        setActiveSessionId(parsed)
        setView('chat')
    }, [params, router])

    // ── handlers ──────────────────────────────────────────────────────────────
    const handleCreateNew = () => {
        setSetup(null)
        router.replace('/interview/new')
    }

    const handleOpenSession = (sessionId: number) => {
        setActiveSessionId(sessionId)
        setMessages([])
        router.replace(`/interview/${sessionId}`)
    }

    // ── load history when entering chat view ──────────────────────────────────
    useEffect(() => {
        if (!activeSessionId || view !== 'chat') return
        const loadHistory = async () => {
            try {
                const history = await api.getInterviewMessages(activeSessionId)

                const mapped: InterviewMessageHistoryListResponse[] = history.map((m) => ({
                    id: m.id,
                    sessionId: m.sessionId,
                    role: m.role === 'INTERVIEWER' ? 'INTERVIEWER' : 'CANDIDATE',
                    content: m.content,
                    createdAt: m.createdAt,
                }))
                setMessages(mapped)
            } catch (e) {
                console.error('Failed to load message history:', e)
            }
        }
        void loadHistory()
    }, [activeSessionId, view])

    const handleDeleteSession = async (id: number) => {
        try {
            await api.deleteInterviewSession(id)
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
            const session = await api.createInterviewSession(user.id, nextSetup.jobDescriptionText)
            setActiveSessionId(session.id)
            setMessages([])
            router.replace(`/interview/${session.id}`)

            setIsSending(false)
            setAnimation(null)
            setIsCompleted(false)
            setQuestionProgress(null)

            await sendMessage(session.id, 'Hello, I am ready to begin the interview.')
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

    const sendMessage = async (_sessionId: number, text: string) => {
        if (!user?.id) return

        const userMsg: InterviewMessageHistoryListResponse = {
            id: user.id,
            sessionId: _sessionId,
            role: 'CANDIDATE',
            content: text,
            createdAt: new Date().toISOString()
        }
        setMessages((prev) => [...prev, userMsg])
        setIsSending(true)
        setAnimation('Thinking')

        try {
            const saved = await api.sendInterviewMessage(_sessionId, user.id, text)

            const interviewerMsg: InterviewMessageHistoryListResponse = {
                id: user.id,
                sessionId: _sessionId,
                role: 'INTERVIEWER',
                content: saved.responseMessage,
                createdAt: new Date().toISOString()
            }
            setMessages((prev) => [...prev, interviewerMsg])

            if (saved.completed) {
                setIsCompleted(true)
            }
            if (saved.audioUrl) {
                setAudio(saved.audioUrl)
            }
            setQuestionProgress({
                answered: saved.questionsAnswered,
                total: saved.totalQuestions,
            })
        } catch (err) {
            console.error('Failed to send interview message:', err)
        } finally {
            setAnimation(null)
            setIsSending(false)
        }
    }

    const handleSend = async (text: string) => {
        if (!activeSessionId || isSending) return
        await sendMessage(activeSessionId, text)
    }

    const handleBackToSelection = () => {
        router.replace('/interview')
    }

    // ── right panel ───────────────────────────────────────────────────────────
    const rightPanel = () => {
        switch (view) {
            case 'selection':
                return (
                    <InterviewSelectionPanel
                        sessions={sessions}
                        isLoading={isLoadingSessions}
                        onCreateNew={handleCreateNew}
                        onOpen={handleOpenSession}
                        onDelete={handleDeleteSession}
                    />
                )
            case 'setup':
                return (
                    <InterviewSetupPanel
                        value={setup}
                        onChange={setSetup}
                        onStart={handleStart}
                        onBack={handleBackToSelection}
                        isStarting={isSending}
                    />
                )
            case 'chat':
                return (
                    <InterviewChatPanel
                        title="Mock Interview"
                        subtitle={
                            questionProgress
                                ? `Question ${questionProgress.answered} of ${questionProgress.total}`
                                : 'Ask questions, practice answers, and get feedback.'
                        }
                        messages={messages}
                        onSend={handleSend}
                        disabled={isSending || isCompleted}
                        isCompleted={isCompleted}
                        onBack={() => router.replace('/interview')}
                    />
                )
        }
    }

    return (
        <DashboardLayout>
            <TTSControls
                audioData={audio}
                autoPlay={true}
                onPlayingStateChange={(playing) => {
                    if (playing) setAnimation('Talking');
                    else setAnimation(null);
                }}
            />
            <div className="relative -m-4 sm:-m-6 lg:-m-8 h-[calc(100vh-4rem)] font-[Manrope] overflow-hidden">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_0%,rgba(43,109,255,0.10),transparent_60%),radial-gradient(900px_620px_at_80%_10%,rgba(109,224,255,0.12),transparent_55%)]" />
                </div>
                <div className="h-full w-full px-4 sm:px-6 lg:px-8 py-6">
                    <div className="mx-auto max-w-[1400px] h-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4">
                        <div className="min-h-0">
                            <Suspense fallback={null}>
                                <InterviewScene animationName={animation ?? undefined} />
                            </Suspense>
                        </div>
                        <div className="min-h-0">
                            {rightPanel()}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}