'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { Assistant } from '../components/assistant/Assistant'
import { TTSControls } from '../components/assistant/TTSControls'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import {
    api,
    type ChatHistoryListResponse,
    type ChatHistoryListRequest,
} from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
    type LucideIcon,
    FileText, Mail, Speech, Search, School, BriefcaseBusiness,
} from 'lucide-react'
import { AssistantChatBar } from '../components/assistant/AssistantChatBar'
import { StatusBadge } from '../components/assistant/StatusBadge'
import { ChatHistoryPanel } from '../components/assistant/ChatHistoryPanel'
import { FeatureTile } from '../components/assistant/FeatureTile'
import { AssistantStyleSelect, type AssistantStyle } from '../components/assistant/AssistantStyleSelect'

const STYLE_STORAGE_KEY = 'iva_assistant_style'

function isAssistantStyle(v: unknown): v is AssistantStyle {
    return v === 'friendly' || v === 'professional' || v === 'humorous' || v === 'ltg'
}

export function AssistantPage() {
    const [animation, setAnimation]   = useState<string | null>(null)
    const [messages, setMessages]     = useState<ChatHistoryListResponse[]>([])
    const [style, setStyle]           = useState<AssistantStyle>(() => {
        if (typeof window === 'undefined') return 'friendly'
        const stored = window.localStorage.getItem(STYLE_STORAGE_KEY)
        return isAssistantStyle(stored) ? stored : 'friendly'
    })
    const [newAudioChunk, setNewAudioChunk]           = useState<{ url: string; id: number } | null>(null)
    const [audioInterruptCounter, setAudioInterruptCounter] = useState(0)
    const [isLoading, setIsLoading]   = useState(false)

    // Replaces wsStatus — SSE has no persistent connection to track, so we
    // model it as 'idle' | 'streaming' | 'error' instead.
    const [streamStatus, setStreamStatus] = useState<'idle' | 'streaming' | 'error'>('idle')

    const { user } = useAuth()
    const { theme } = useTheme()

    /**
     * Holds the abort function for the in-flight SSE stream so we can cancel
     * it when the user sends a new message before the previous one finishes.
     */
    const abortStreamRef = useRef<(() => void) | null>(null)

    /**
     * Token buffer — same 30ms batching strategy as before to avoid a
     * re-render on every single streamed chunk.
     */
    const chunkBufferRef  = useRef('')
    const flushTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)

    const flushChunkBuffer = () => {
        flushTimerRef.current = null
        const buffered = chunkBufferRef.current
        if (!buffered) return
        chunkBufferRef.current = ''

        setMessages(prev => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last && last.role === 'ASSISTANT') {
                last.content += buffered
            } else {
                next.push({ role: 'ASSISTANT', content: buffered, createdAt: new Date().toISOString() })
            }
            return next
        })
    }

    const scheduleFlush = () => {
        if (!flushTimerRef.current) {
            flushTimerRef.current = setTimeout(flushChunkBuffer, 30)
        }
    }

    // Load chat history on mount
    useEffect(() => {
        if (!user?.id) return
        const load = async () => {
            try {
                const chats = await api.getMessageHistory({ userId: user.id } as ChatHistoryListRequest)
                setMessages(chats.map(c => ({ role: c.role, content: c.content, createdAt: c.createdAt })).reverse())
            } catch (err) {
                console.error('Failed to load chat history:', err)
            }
        }
        void load()
    }, [user?.id])

    // Cleanup flush timer on unmount
    useEffect(() => {
        return () => {
            if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
        }
    }, [])

    // Persist style selection
    useEffect(() => {
        try { window.localStorage.setItem(STYLE_STORAGE_KEY, style) } catch { /* ignore */ }
    }, [style])

    const handleSend = (text: string) => {
        if (!user?.id) return

        // Cancel any in-flight stream before starting a new one
        if (abortStreamRef.current) {
            abortStreamRef.current()
            abortStreamRef.current = null
            // Flush any partial buffer from the previous response
            if (flushTimerRef.current) {
                clearTimeout(flushTimerRef.current)
                flushChunkBuffer()
            }
        }

        // Interrupt any currently playing audio
        setAudioInterruptCounter(prev => prev + 1)

        // Optimistically append the user's message
        setMessages(prev => [...prev, { role: 'USER', content: text, createdAt: new Date().toISOString() }])
        setAnimation('Thinking')
        setIsLoading(true)
        setStreamStatus('streaming')

        const { abort } = api.sendChatMessage(
            { userMessage: text, userId: user.id, style },
            {
                onAudio: (chunk, audioUrl) => {
                    // Buffer the text chunk for batched React state updates
                    if (chunk) {
                        chunkBufferRef.current += chunk
                        scheduleFlush()
                    }
                    // Queue TTS audio immediately — no need to wait for the flush
                    if (audioUrl) {
                        setNewAudioChunk({ url: audioUrl, id: Date.now() })
                    }
                },

                onDone: () => {
                    // Flush any remaining buffered text
                    if (flushTimerRef.current) {
                        clearTimeout(flushTimerRef.current)
                        flushChunkBuffer()
                    }
                    abortStreamRef.current = null
                    setAnimation(null)
                    setIsLoading(false)
                    setStreamStatus('idle')
                },

                onError: (code) => {
                    console.error('Chat stream error:', code)
                    // Flush partial buffer so the UI isn't stuck mid-sentence
                    if (flushTimerRef.current) {
                        clearTimeout(flushTimerRef.current)
                        flushChunkBuffer()
                    }
                    abortStreamRef.current = null
                    setAnimation(null)
                    setIsLoading(false)
                    setStreamStatus('error')
                    if (code === 'RATE_LIMIT_EXCEEDED') alert('Daily message limit reached.')
                },
            },
        )

        abortStreamRef.current = abort
    }

    const handleDeleteHistory = () => {
        if (!user?.id) return
        if (!confirm('Are you sure you want to delete your chat history? This action cannot be undone.')) return

        api.deleteMessageHistory()
            .then(() => setMessages([]))
            .catch(err => {
                console.error('Failed to delete chat history:', err)
                alert('Failed to delete chat history. Please try again later.')
            })
    }

    const leftTiles: { icon: LucideIcon; label: string; href: string }[] = [
        { icon: FileText,         label: 'Resume',    href: '/documents' },
        { icon: School,           label: 'Study',     href: '/study' },
        { icon: BriefcaseBusiness, label: 'Tracker',  href: '/job-tracker' },
    ]

    const rightTiles: { icon: LucideIcon; label: string; href: string }[] = [
        { icon: Mail,   label: 'Emails',    href: '/emails' },
        { icon: Speech, label: 'Interview', href: '/interview-dashboard' },
        { icon: Search, label: 'Jobs',      href: '/search-jobs' },
    ]

    // Map our streamStatus to the shape StatusBadge already expects.
    // 'streaming' maps to 'connected' so the pulsing blue dot still appears
    // while a response is in flight. 'idle' also maps to 'connected' since
    // HTTP is always available — there's no persistent socket to lose.
    const badgeStatus = streamStatus === 'error' ? 'error' : 'connected'

    return (
        <DashboardLayout>
            <TTSControls
                newAudioChunk={newAudioChunk}
                clearTrigger={audioInterruptCounter}
            />

            <div
                className="relative w-full overflow-hidden -m-4 sm:-m-6 lg:-m-8 left-5"
                style={{ height: 'calc(100vh - 4rem)', fontFamily: "'DM Sans', sans-serif" }}
            >
                <StatusBadge status={badgeStatus} />

                {/* 3D Canvas */}
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 2, 5], fov: 50, near: 0.1, far: 1000 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[5, 10, 5]} intensity={15} />
                        <pointLight position={[-5, 5, -5]} intensity={0.5} />
                        <Suspense fallback={null}>
                            <Assistant
                                position={[0, -3.2, 1]}
                                scale={3}
                                animationName={animation || undefined}
                                idleAnimation="Idle"
                            />
                            <Environment preset="studio" />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Theme-aware vignette */}
                <div
                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-52 z-[5] transition-all duration-300"
                    style={{
                        background: theme === 'dark'
                            ? 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.4) 60%, transparent 100%)'
                            : 'linear-gradient(to top, rgba(248,250,252,0.90) 0%, rgba(248,250,252,0.35) 60%, transparent 100%)',
                    }}
                />

                {/* UI overlay */}
                <div className="relative z-10 flex flex-col h-full pointer-events-none">

                    {/* Feature tiles */}
                    <div className="flex-1 relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col items-start gap-6 pointer-events-auto">
                            {leftTiles.map((tile, i) => (
                                <FeatureTile key={tile.href} {...tile} index={i} />
                            ))}
                        </div>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-end gap-6 pointer-events-auto">
                            {rightTiles.map((tile, i) => (
                                <FeatureTile key={tile.href} {...tile} index={i} />
                            ))}
                        </div>
                        <ChatHistoryPanel
                            messages={messages}
                            onDelete={() => setMessages([])}
                        />
                    </div>

                    {/* Chat bar */}
                    <div className="w-full shrink-0 px-6 pb-5 pt-3 pointer-events-auto">
                        <div className="mx-auto max-w-2xl mb-2.5 flex items-center justify-between gap-3">
                            <span className={[
                                'inline-flex items-center gap-1.5 px-2.5 py-1',
                                'border border-neutral-300/70 dark:border-neutral-700/70',
                                'bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md',
                                'text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest',
                            ].join(' ')}>
                                <span className={[
                                    'w-1.5 h-1.5 rounded-full',
                                    streamStatus === 'streaming' ? 'bg-blue-500 animate-pulse' :
                                        streamStatus === 'error'     ? 'bg-red-400' :
                                            'bg-neutral-300 dark:bg-neutral-700',
                                ].join(' ')} />
                                {streamStatus === 'streaming' ? 'IVA · Thinking' : 'IVA · Ready'}
                            </span>

                            <AssistantStyleSelect
                                value={style}
                                onChangeAction={setStyle}
                                disabled={isLoading}
                            />
                        </div>

                        <AssistantChatBar
                            onSend={handleSend}
                            disabled={isLoading}
                        />

                        <p className="mx-auto max-w-2xl mt-2 text-[9px] font-mono text-neutral-400 dark:text-neutral-600 text-center tracking-widest uppercase">
                            IVA may make mistakes — verify important information
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}