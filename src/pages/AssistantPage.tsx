import React, { Suspense, useEffect, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout.tsx';
import { Assistant } from '../components/assistant/Assistant.tsx';
import { TTSControls } from '../components/assistant/TTSControls.tsx';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import {
    api,
    type ChatHistoryListResponse,
    type ChatHistoryListRequest,
} from '../services/api.ts';
import { wsClient } from '../services/ws.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
    type LucideIcon,
    MessageSquare, X, ChevronDown, Send, Paperclip, Mic,
    FileText, Mail, Languages, Speech, Search, Calendar, WifiOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// ─── Feature tile ──────────────────────────────────────────────────────────────

type FeatureTileProps = {
    icon: LucideIcon;
    label: string;
    to: string;
    index?: number;
};

function FeatureTile({ icon: Icon, label, to, index = 0 }: FeatureTileProps) {
    return (
        <Link to={to}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
                className="group flex flex-col items-center gap-2.5 cursor-pointer select-none"
            >
                {/* Tile */}
                <div className={[
                    'w-14 h-14 flex items-center justify-center',
                    'border border-neutral-300/70 dark:border-neutral-700/80',
                    'bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md',
                    'shadow-[0_2px_8px_rgba(15,23,42,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]',
                    'transition-all duration-150',
                    'group-hover:border-blue-400 dark:group-hover:border-blue-500',
                    'group-hover:shadow-[0_4px_16px_rgba(37,99,235,0.15)] dark:group-hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)]',
                    'group-hover:bg-white dark:group-hover:bg-neutral-900',
                ].join(' ')}>
                    <Icon
                        className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150"
                        strokeWidth={1.75}
                    />
                </div>
                {/* Label */}
                <span className="text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors duration-150 whitespace-nowrap">
                    {label}
                </span>
            </motion.div>
        </Link>
    );
}

// ─── Chat bar ──────────────────────────────────────────────────────────────────

function AssistantChatBar({
                              onSend,
                              disabled = false,
                              onAttach,
                              onMic,
                          }: {
    onSend: (message: string) => void;
    disabled?: boolean;
    onAttach?: () => void;
    onMic?: () => void;
}) {
    const [input, setInput] = useState('');
    const canSend = !disabled && input.trim().length > 0;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || disabled) return;
        onSend(text);
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="mx-auto flex w-full max-w-2xl items-stretch gap-0">
                {/* Attach */}
                <button
                    type="button"
                    onClick={onAttach}
                    disabled={disabled}
                    aria-label="Attach file"
                    className={[
                        'flex items-center justify-center w-12 shrink-0',
                        'border border-r-0 border-neutral-300/80 dark:border-neutral-700/80',
                        'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md',
                        'text-neutral-400 dark:text-neutral-500',
                        'hover:text-neutral-700 dark:hover:text-neutral-300',
                        'transition-colors duration-150',
                        'disabled:opacity-40 disabled:pointer-events-none',
                    ].join(' ')}
                >
                    <Paperclip className="w-4 h-4" />
                </button>

                {/* Input */}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask IVA anything…"
                    disabled={disabled}
                    className={[
                        'flex-1 min-h-[52px] px-4',
                        'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md',
                        'border border-neutral-300/80 dark:border-neutral-700/80',
                        'text-[13px] font-mono text-neutral-900 dark:text-white',
                        'placeholder:text-neutral-400 dark:placeholder:text-neutral-600',
                        'outline-none focus:border-blue-400 dark:focus:border-blue-500',
                        'transition-colors duration-150',
                        disabled ? 'opacity-60 cursor-not-allowed' : '',
                    ].join(' ')}
                />

                {/* Mic */}
                <button
                    type="button"
                    onClick={onMic}
                    disabled={disabled}
                    aria-label="Voice input"
                    className={[
                        'flex items-center justify-center w-12 shrink-0',
                        'border border-l-0 border-neutral-300/80 dark:border-neutral-700/80',
                        'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md',
                        'text-neutral-400 dark:text-neutral-500',
                        'hover:text-neutral-700 dark:hover:text-neutral-300',
                        'transition-colors duration-150',
                        'disabled:opacity-40 disabled:pointer-events-none',
                    ].join(' ')}
                >
                    <Mic className="w-4 h-4" />
                </button>

                {/* Send */}
                <button
                    type="submit"
                    disabled={!canSend}
                    aria-label="Send message"
                    className={[
                        'flex items-center justify-center w-14 shrink-0 ml-px',
                        'border border-neutral-300/80 dark:border-neutral-700/80',
                        'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500',
                        'text-white transition-colors duration-150',
                        'disabled:opacity-35 disabled:bg-neutral-200 dark:disabled:bg-neutral-800',
                        'disabled:text-neutral-400 disabled:pointer-events-none',
                    ].join(' ')}
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </form>
    );
}

// ─── Chat history panel ────────────────────────────────────────────────────────

function ChatHistoryPanel({ messages }: { messages: ChatHistoryListResponse[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const bottomRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        }
    }, [messages, isOpen]);

    return (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto flex flex-col items-end gap-2">
            {/* Expanded panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className={[
                            'w-[340px] overflow-hidden',
                            'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md',
                            'border border-neutral-200 dark:border-neutral-800',
                            'shadow-[0_4px_24px_rgba(15,23,42,0.10)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.5)]',
                        ].join(' ')}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-mono">
                                    Chat History
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            className="overflow-y-auto px-3 py-3 space-y-2.5"
                            style={{ maxHeight: '340px', scrollbarWidth: 'thin' }}
                        >
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <MessageSquare className="h-5 w-5 text-neutral-300 dark:text-neutral-700" strokeWidth={1.5} />
                                    <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600">No messages yet</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isUser = msg.role === 'USER';
                                    return (
                                        <div key={i} className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={[
                                                'mt-0.5 h-5 w-5 shrink-0 flex items-center justify-center',
                                                'border text-[9px] font-semibold font-mono',
                                                isUser
                                                    ? 'border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                                                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900',
                                            ].join(' ')}>
                                                {isUser ? 'U' : 'A'}
                                            </div>
                                            <div className={[
                                                'max-w-[80%] px-3 py-2 text-[12px] leading-relaxed border',
                                                isUser
                                                    ? 'border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/40 text-neutral-800 dark:text-neutral-200'
                                                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300',
                                            ].join(' ')}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={bottomRef} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={[
                    'flex items-center gap-2.5 px-4 py-2.5',
                    'border border-neutral-300/80 dark:border-neutral-700/80',
                    'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md',
                    'shadow-[0_2px_8px_rgba(15,23,42,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]',
                    'hover:border-blue-400 dark:hover:border-blue-500',
                    'transition-all duration-150 cursor-pointer select-none',
                ].join(' ')}
            >
                <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-neutral-400 shrink-0" strokeWidth={1.75} />
                <span className="text-[11px] font-mono font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-widest whitespace-nowrap">
                    History
                </span>
                {messages.length > 0 && (
                    <span className="inline-flex items-center justify-center h-4 min-w-[1rem] px-1 border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/50 text-[9px] font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                        {messages.length}
                    </span>
                )}
                <ChevronDown
                    className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600 shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                />
            </button>
        </div>
    );
}

// ─── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'connected' | 'disconnected' | 'error' }) {
    if (status === 'connected') return null;
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-neutral-200/80 dark:border-neutral-700/60 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm shadow-[0_2px_8px_rgba(15,23,42,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                {status === 'disconnected' ? (
                    <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Connecting…</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-3 h-3 text-red-500" />
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Connection error — retrying</span>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export function AssistantPage() {
    const [animation, setAnimation] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatHistoryListResponse[]>([]);
    const [audio, setAudio] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
    const { user } = useAuth();

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
            if (code === 'RATE_LIMIT_EXCEEDED') alert('Daily message limit reached. Upgrade your plan for more.');
        });

        const unsubStatus = wsClient.onStatus((status) => {
            setWsStatus(status);
            if (status !== 'connected') { setAnimation(null); setIsLoading(false); }
        });

        return () => { unsubMessage(); unsubError(); unsubStatus(); wsClient.disconnect(); };
    }, [user?.id]);

    const handleSend = (text: string) => {
        if (!user?.id) return;
        setMessages(prev => [...prev, { role: 'USER', content: text, createdAt: new Date().toISOString() }]);
        setAnimation('Thinking');
        setIsLoading(true);
        wsClient.sendMessage({ userMessage: text, userId: user.id });
    };

    const leftTiles: { icon: LucideIcon; label: string; to: string }[] = [
        { icon: FileText,  label: 'Documents', to: '/documents' },
        { icon: Languages, label: 'Translate',  to: '/translate' },
        { icon: Calendar,  label: 'Calendar',   to: '/calender'  },
    ];

    const rightTiles: { icon: LucideIcon; label: string; to: string }[] = [
        { icon: Mail,   label: 'Email',     to: '/emails'      },
        { icon: Speech, label: 'Interview', to: '/interview'   },
        { icon: Search, label: 'Jobs',      to: '/search-jobs' },
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

                {/* UI overlay */}
                <div className="relative z-10 flex flex-col h-full pointer-events-none">

                    {/* Feature tiles */}
                    <div className="flex-1 relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col items-start gap-6 pointer-events-auto">
                            {leftTiles.map((tile, i) => (
                                <FeatureTile key={tile.to} {...tile} index={i} />
                            ))}
                        </div>

                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-end gap-6 pointer-events-auto">
                            {rightTiles.map((tile, i) => (
                                <FeatureTile key={tile.to} {...tile} index={i} />
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