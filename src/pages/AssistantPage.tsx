// src/pages/AssistantPage.tsx
import React, {useEffect, useMemo, useRef, useState} from 'react'
import { Client } from '@stomp/stompjs';
import {DashboardLayout} from '../components/DashboardLayout'
import {AssistantChatPanel, type Message} from '../components/assistant/AssistantChatPanel'
import {AssistantModelPanel} from '../components/assistant/AssistantModelPanel'
import {AssistantToolsPanel} from '../components/assistant/AssistantToolsPanel'
import {TTSControls} from "../components/assistant/TTSControls.tsx";

import {motion} from 'framer-motion'
import {useAuth} from "../context/AuthContext.tsx";

export function AssistantPage() {

    const {user} = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [audio, setAudio] = useState<string | null>(null);

    const [connected, setConnected] = useState(false);

    const stompClientRef = useRef(new Client());

    /**
     * Connect to WebSocket server using native WebSocket
     */
    const connnectWebSocket = (userId: any) => {
        const client = new Client({
            brokerURL: import.meta.env.VITE_BACKEND_WEBSOCKET_URL,

            // Reconnect settings
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            // Connection callbacks
            onConnect: (frame) => {

                console.log('Connected to WebSocket:', frame);
                setConnected(true);

                // Subscribe to messages for this user
                console.log('Subscribing to /user/queue/messages');
                client.subscribe(`/user/${user?.id}/queue/messages`, (message) => {
                    console.log('Raw message received on /user/queue/messages:', message);
                    const response = JSON.parse(message.body);
                    handleWebSocketMessage(response);
                });

                // Subscribe to chat history
                console.log('Subscribing to /user/queue/history');
                client.subscribe(`/user/${user?.id}/queue/history`, (message) => {
                    console.log('Raw history received on /user/queue/history:', message);
                    const history = JSON.parse(message.body);
                    loadChatHistoryFromWebSocket(history);
                });

                // Request chat history
                console.log('Requesting chat history for user:', userId);
                client.publish({
                    destination: '/app/chat/history',
                    body: JSON.stringify({ userId: userId })
                });
                console.log('History request sent');
            },

            onStompError: (frame) => {
                console.error('STOMP error:', frame);
                setConnected(false);
            },

            onWebSocketClose: () => {
                console.log('WebSocket connection closed');
                setConnected(false);
            },

            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
            },
        });

        client.activate();
        stompClientRef.current = client;
    }

    const modelUrl = useMemo(() => {
        // Default path; drop a GLB here to replace the fallback orb.
        return '/models/assistant.glb'
    }, [])

    // Handle sending a message: update local state and send to backend via WebSocket
    const handleSend = (text: string) => {
        const trimmed = text.trim()

        // Prevent sending empty messages or if user not set
        if (!trimmed || !user || !connected) {
            if (!connected) {
                console.warn('Cannot send: WebSocket not connected');
            }
            return;
        }

        // Create a new message object for the user's input
        const newMessage: Message = {
            id: `${Date.now()}-user`,
            role: 'user',
            content: trimmed,
            createdAt: Date.now(),
        }

        // Update states
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            // Send the message to the backend via WebSocket
            const client = stompClientRef.current;
            if (client && client.connected) {
                console.log('Sending message to backend:', newMessage);
                client.publish({
                    destination: '/app/chat',
                    body: JSON.stringify({
                        userId: user.id,
                        message: newMessage.content,
                        isGuest: false
                    }),
                });
            }
            console.log('Message sent via WebSocket:', newMessage);
        } catch (error) {
            console.error('Error sending message:', error);

            setMessages(prev => [...prev, {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: 'Sorry, I encountered an error sending your message. Please try again.',
                createdAt: Date.now(),
            }]);
        }
    }

    const handleWebSocketMessage = (response: any) => {
        console.log('Processing WebSocket message:', response);

        switch (response.type) {
            case 'received':
                console.log('Message received by server:', response);
                break;
            case 'response':
                console.log('Assistant response received:', response);
                const AssistantMessage: Message = {
                    id: `${response.chatId}-assistant`,
                    role: 'assistant',
                    content: response.response,
                    audioData: response.audioData, // Optional field for audio responses
                }
                setMessages((prevMessages) => [...prevMessages, AssistantMessage]);

                if (!response.audioData.isEmpty) {
                    setAudio(response.audioData);
                }

                break;
            case 'error':
                console.error('Server error:', response.message);
                setMessages(prev => [...prev, {
                    id: `error-${Date.now()}`,
                    role: 'assistant',
                    content: `Error: ${response.message}`
                }]);
                break;

            case 'deleted':
                console.log('Chat deleted:', response.chatId);
                setMessages(prev => prev.filter(msg =>
                    !msg.id.startsWith(`${response.chatId}-`)
                ));
                break;
        }
    };

    type ChatHistoryItem = {
        id: string | number
        message?: string
        content?: string
        response?: string
        createdAt?: number
        timestamp?: number
    }

    const normalizeHistoryPayload = (payload: unknown): ChatHistoryItem[] => {
        if (Array.isArray(payload)) return payload as ChatHistoryItem[]
        if (payload && typeof payload === 'object') {
            const obj = payload as any
            if (Array.isArray(obj.history)) return obj.history as ChatHistoryItem[]
            if (Array.isArray(obj.chats)) return obj.chats as ChatHistoryItem[]
            if (Array.isArray(obj.items)) return obj.items as ChatHistoryItem[]
            if (Array.isArray(obj.data)) return obj.data as ChatHistoryItem[]
        }
        return []
    }

    // Load chat history from WebSocket
    const loadChatHistoryFromWebSocket = (payload: unknown) => {
        const history = normalizeHistoryPayload(payload)
        console.log('Loading chat history:', history.length, 'chats');

        // Avoid toReversed() for compatibility. Copy + reverse keeps original intact.
        const formatted = [...history].reverse().flatMap((chat): Message[] => {
            const chatId = chat?.id ?? Date.now()
            const createdAt = chat?.createdAt ?? chat?.timestamp

            const userContent = chat?.message ?? chat?.content ?? ''
            const assistantContent = chat?.response ?? ''

            // Skip empty rows gracefully.
            if (!userContent && !assistantContent) return []

            const out: Message[] = []
            if (userContent) {
                out.push({
                    id: `${chatId}-user`,
                    role: 'user',
                    content: String(userContent),
                    createdAt: typeof createdAt === 'number' ? createdAt : undefined,
                })
            }
            if (assistantContent) {
                out.push({
                    id: `${chatId}-assistant`,
                    role: 'assistant',
                    content: String(assistantContent),
                    createdAt: typeof createdAt === 'number' ? createdAt : undefined,
                })
            }
            return out
        })

        setMessages(formatted);
    };


    useEffect(() => {
        if (!user?.id) return
        if (connected) return
        connnectWebSocket(user.id)

        return () => {
            try {
                stompClientRef.current?.deactivate()
            } catch {
                // ignore
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id])

    return (
        <DashboardLayout>
            <div className="relative -m-4 min-h-[calc(100vh-4rem)] bg-white sm:-m-6 lg:-m-8">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div
                        className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_0%,rgba(43,109,255,0.10),transparent_60%),radial-gradient(900px_620px_at_80%_10%,rgba(109,224,255,0.12),transparent_55%)]"/>
                </div>

                <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 pb-8 pt-6 sm:px-6 lg:px-8">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <motion.h1
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                className="text-2xl font-bold tracking-[-0.02em] text-slate-950"
                            >
                                AI Assistant
                            </motion.h1>
                            <motion.p
                                initial={{opacity: 0, y: -10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.1}}
                                className="mt-1 text-[13px] leading-snug text-slate-900/60"
                            >
                                Chat on the left, and your 3D assistant lives in the middle.
                            </motion.p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr_340px]">
                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{delay: 0.15}}
                            className="min-h-[520px] lg:h-[calc(100vh-12.5rem)]"
                        >
                            <AssistantChatPanel messages={messages} onSend={handleSend}/>
                        </motion.div>

                        <div className="lg:h-[calc(100vh-12.5rem)]">
                            <AssistantModelPanel modelUrl={modelUrl}/>
                            <TTSControls audioData={audio} autoPlay={true}/>
                        </div>

                        <motion.div
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{delay: 0.2}}
                            className="lg:h-[calc(100vh-12.5rem)]"
                        >
                            <AssistantToolsPanel
                                connected={connected}
                                onAction={(action) => {
                                    setMessages((prev) => [
                                        ...prev,
                                        {
                                            id: `${Date.now()}-tool`,
                                            role: 'assistant',
                                            content: `Tool clicked: ${action} (stub)`,
                                        },
                                    ])
                                }}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
