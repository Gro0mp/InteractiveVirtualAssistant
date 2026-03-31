'use client'

import React, { Suspense, useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Assistant } from '../components/assistant/Assistant';
import { TTSControls } from '../components/assistant/TTSControls';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import {
    api,
    type ChatHistoryListResponse,
    type ChatHistoryListRequest,
} from '../services/api';
import { wsClient } from '../services/ws';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    type LucideIcon,
    FileText, Mail, Languages, Speech, Search, Calendar
} from 'lucide-react';

import {AssistantChatBar} from '../components/assistant/AssistantChatBar';
import {StatusBadge} from "../components/assistant/StatusBadge.tsx";
import {ChatHistoryPanel} from "../components/assistant/ChatHistoryPanel.tsx";
import {FeatureTile} from "../components/assistant/FeatureTile.tsx";

export function AssistantPage() {
    const [animation, setAnimation] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatHistoryListResponse[]>([]);
    const [audio, setAudio] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
    const { user } = useAuth();
    const { theme } = useTheme();

    // Load chat history
    useEffect(() => {
        if (!user?.id) return;
        const load = async () => {
            try {
                const chats = await api.getMessageHistory({ userId: user.id } as ChatHistoryListRequest);
                setMessages(chats.map(c => ({ role: c.role, content: c.content, createdAt: c.createdAt })).reverse());
            } catch (err) {
                console.error('Failed to load chat history:', err);
            }
        };
        void load();
    }, [user?.id]);

    // WebSocket lifecycle
    useEffect(() => {
        if (!user?.id) return;
        wsClient.connect(user.id);

        const unsubMessage = wsClient.onMessage((response) => {
            setMessages(prev => [...prev, { role: 'ASSISTANT', content: response.responseMessage, createdAt: new Date().toISOString() }]);
            if (response.audioUrl) setAudio(response.audioUrl);
            setAnimation(null);
            setIsLoading(false);
        });

        const unsubError = wsClient.onError((code) => {
            console.error('WS error:', code);
            setAnimation(null);
            setIsLoading(false);
            if (code === 'RATE_LIMIT_EXCEEDED') alert('Daily message limit reached.');
        });

        const unsubStatus = wsClient.onStatus((status) => {
            setWsStatus(status);
            if (status !== 'connected') { setAnimation(null); setIsLoading(false); }
        });

        // ✅ Only remove THIS component's listeners — don't kill the shared WS connection
        return () => { unsubMessage(); unsubError(); unsubStatus(); };
    }, [user?.id]);

    const handleSend = (text: string) => {
        if (!user?.id) return;
        setMessages(prev => [...prev, { role: 'USER', content: text, createdAt: new Date().toISOString() }]);
        setAnimation('Thinking');
        setIsLoading(true);
        wsClient.sendMessage({ userMessage: text, userId: user.id });
    };

    const leftTiles: { icon: LucideIcon; label: string; href: string }[] = [
        { icon: FileText,  label: 'Documents', href: '/documents' },
        { icon: Languages, label: 'Translate',  href: '/translate' },
        { icon: Calendar,  label: 'Calendar',   href: '/calender'  },
    ];

    const rightTiles: { icon: LucideIcon; label: string; href: string }[] = [
        { icon: Mail,   label: 'Email',     href: '/emails'      },
        { icon: Speech, label: 'Interview', href: '/interview'   },
        { icon: Search, label: 'Jobs',      href: '/search-jobs' },
    ];

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

            <div
                className="relative w-full overflow-hidden -m-4 sm:-m-6 lg:-m-8 left-5"
                style={{ height: 'calc(100vh - 4rem)', fontFamily: "'DM Sans', sans-serif" }}
            >
                {/* Status badge */}
                <StatusBadge status={wsStatus} />

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
                            : 'linear-gradient(to top, rgba(248,250,252,0.90) 0%, rgba(248,250,252,0.35) 60%, transparent 100%)'
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

                        <ChatHistoryPanel messages={messages} />
                    </div>

                    {/* Chat bar area */}
                    <div className="w-full shrink-0 px-6 pb-5 pt-3 pointer-events-auto">
                        {/* Status label */}
                        <div className="mx-auto max-w-2xl mb-2.5 flex items-center gap-2">
                            <span className={[
                                'inline-flex items-center gap-1.5 px-2.5 py-1',
                                'border border-neutral-300/70 dark:border-neutral-700/70',
                                'bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md',
                                'text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest',
                            ].join(' ')}>
                                <span className={`w-1.5 h-1.5 rounded-full ${wsStatus === 'connected' ? 'bg-blue-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                                {wsStatus === 'connected' ? 'IVA · Ready' : 'IVA · Connecting'}
                            </span>
                        </div>

                        <AssistantChatBar
                            onSend={handleSend}
                            disabled={isLoading || wsStatus !== 'connected'}
                        />

                        <p className="mx-auto max-w-2xl mt-2 text-[9px] font-mono text-neutral-400 dark:text-neutral-600 text-center tracking-widest uppercase">
                            IVA may make mistakes — verify important information
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}