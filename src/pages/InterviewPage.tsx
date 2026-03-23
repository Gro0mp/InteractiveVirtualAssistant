import React, { Suspense, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import { InterviewScene } from '../components/interview/InterviewScene'
import { InterviewChatPanel } from '../components/interview/InterviewChatPanel'
import { InterviewSetupPanel } from '../components/interview/InterviewSetupPanel'
import { InterviewSelectionPanel } from '../components/interview/InterviewSelectionPanel'
import type { InterviewSetupValue } from '../components/interview/InterviewSetupPanel'
import type { InterviewSession, Message } from '../services/api'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

type View = 'selection' | 'setup' | 'chat'

export function InterviewPage() {
    const params = useParams<{ sessionId?: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()

    // ── view state ──────────────────────────────────────────────────────────
    const [view, setView] = useState<View>(() => {
        if (!params.sessionId || params.sessionId === 'new') return 'setup'
        return 'selection'
    })

    // ── session list ─────────────────────────────────────────────────────────
    const [sessions, setSessions] = useState<InterviewSession[]>([])
    const [isLoadingSessions, setIsLoadingSessions] = useState(false)

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

    // Load sessions on mount and whenever we return to selection view
    useEffect(() => {
        if (view === 'selection') void loadSessions()
    }, [view, user?.id])

    // ── setup state ──────────────────────────────────────────────────────────
    const [setup, setSetup] = useState<InterviewSetupValue | null>(null)

    // ── chat state ───────────────────────────────────────────────────────────
    const [activeSessionId, setActiveSessionId] = useState<number | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isSending, setIsSending] = useState(false)
    const [animation, setAnimation] = useState<string | null>(null)

    // ── route → view sync ────────────────────────────────────────────────────
    useEffect(() => {
        const sid = params.sessionId
        if (!sid) {
            setView('selection')
            return
        }

        if (sid === 'new') {
            // Important: if a previous session left us in a loading state,
            // reset it when starting a new interview.
            setIsSending(false)
            setAnimation(null)
            setMessages([])
            setActiveSessionId(null)
            setView('setup')
            return
        }

        const parsed = Number(sid)
        if (!Number.isFinite(parsed)) {
            // If someone navigates to a non-numeric id, fall back to selection.
            navigate('/interview', { replace: true })
            return
        }

        setActiveSessionId(parsed)
        setView('chat')
    }, [params.sessionId, navigate])

    // ── handlers ─────────────────────────────────────────────────────────────
    const handleCreateNew = () => {
        setSetup(null)
        navigate('/interview/new', { replace: true })
        // view will update via the useEffect above
    }

    const handleOpenSession = (sessionId: number) => {
        setActiveSessionId(sessionId)
        setMessages([])
        navigate(`/interview/${sessionId}`, { replace: true })
    }

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

        // Create session: show loading, but don't keep isSending locked while we also call sendMessage.
        setIsSending(true)
        setAnimation('Thinking')

        try {
            const session = await api.createInterviewSession(user.id, nextSetup.jobDescriptionText)
            setActiveSessionId(session.id)
            setMessages([])
            navigate(`/interview/${session.id}`, { replace: true })

            // Stop the "Start interview" button loader immediately after session creation.
            // sendMessage will manage its own loading state.
            setIsSending(false)
            setAnimation(null)

            const startingMsg = `You are interviewing for the following job:\n\n${session.description}\n\nStart asking questions to the interviewer!`
            // Kick off the first AI message using the job description
            await sendMessage(session.id, startingMsg)
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

        const userMsg: Message = {
            userId: String(user.id),
            role: 'user',
            content: text,
            createdAt: Date.now(),
        }
        setMessages(prev => [...prev, userMsg])
        setIsSending(true)
        setAnimation('Thinking')

        try {
            const saved = await api.processMessage(userMsg)
            const assistantMsg: Message = {
                userId: String(user.id),
                role: 'assistant',
                content: saved.response,
                createdAt: Date.now(),
            }
            setMessages(prev => [...prev, assistantMsg])
        } catch (err) {
            console.error('Failed to send message:', err)
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
        navigate('/interview', { replace: true })
    }

    // ── right panel ──────────────────────────────────────────────────────────
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
                        subtitle="Ask questions, practice answers, and get feedback."
                        messages={messages}
                        onSend={handleSend}
                        disabled={isSending}
                        onBack={() => navigate('/interview')}
                    />
                )
        }
    }

    return (
        <DashboardLayout>
            <div className="relative -m-4 sm:-m-6 lg:-m-8 h-[calc(100vh-4rem)] font-[Manrope] overflow-hidden">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_0%,rgba(43,109,255,0.10),transparent_60%),radial-gradient(900px_620px_at_80%_10%,rgba(109,224,255,0.12),transparent_55%)]" />
                </div>

                <div className="h-full w-full px-4 sm:px-6 lg:px-8 py-6">
                    <div className="mx-auto max-w-[1400px] h-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4">

                        {/* Left — never unmounts */}
                        <div className="min-h-0">
                            <Suspense fallback={null}>
                                <InterviewScene animationName={animation ?? undefined} />
                            </Suspense>
                        </div>

                        {/* Right — swaps between views */}
                        <div className="min-h-0">
                            {rightPanel()}
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}