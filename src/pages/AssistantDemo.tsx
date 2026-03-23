import React, {Suspense, useEffect, useState} from 'react';
import { DashboardLayout } from "../components/DashboardLayout.tsx";
import { Assistant } from "../components/assistant/Assistant.tsx";
import { AssistantChatBar } from '../components/assistant/AssistantChatBar.tsx';
import {TTSControls} from "../components/assistant/TTSControls.tsx";
import { DocumentOrb } from "../components/ui/orbs/DocumentOrb.tsx";
import {EmailOrb} from "../components/ui/orbs/EmailOrb.tsx";
import {TranslateOrb} from "../components/ui/orbs/TranslateOrb.tsx";
import { MockInterviewOrb } from "../components/ui/orbs/MockInterviewOrb.tsx";
import {SearchCareersOrb} from "../components/ui/orbs/SearchCareersOrb.tsx";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {CalendarOrb} from "../components/ui/orbs/CalendarOrb.tsx";
import {api, type Message} from "../services/api.ts";
import {useAuth} from "../context/AuthContext.tsx";
import {ChatHistoryPanel} from "../components/assistant/ChatHistoryPanel.tsx";


export function AssistantDemo() {
    const [animation, setAnimation] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [audio, setAudio] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const loadHistory = async () => {
            try {
                const chats = await api.getMessageHistory(user.id);

                // Each Chat has a user message and an assistant response
                // Flatten them into the messages array in chronological order
                const historyMessages: Message[] = chats.flatMap(chat => [
                    {
                        userId: String(user.id),
                        role: 'user' as const,
                        content: chat.message,
                        createdAt: new Date(chat.timestamp).getTime(),
                    },
                    {
                        userId: String(user.id),
                        role: 'assistant' as const,
                        content: chat.response,
                        createdAt: new Date(chat.timestamp).getTime(),
                    },
                ])

                setMessages(historyMessages)
            } catch (err) {
                console.error('Failed to load chat history:', err)
            }
        }

        loadHistory()
    }, [user?.id]) // only runs once when the user is available


    const handleSend = async (text: string) => {
        if (!user?.id) {
            console.warn('No authenticated user found');
            return;
        }

        // Build the user message using the real database user ID
        const userMessage: Message = {
            userId: String(user.id),
            role: 'user',
            content: text,
            createdAt: Date.now(),
        }

        // Optimistically add the user message to the UI
        setMessages(prev => [...prev, userMessage])
        setAnimation('Thinking')
        setIsLoading(true)

        try {
            const savedChat = await api.processMessage(userMessage);

            // Map the backend Chat response to a frontend Message
            const assistantMessage: Message = {
                userId: String(user.id),
                role: 'assistant',
                content: savedChat.response,
                audioData: savedChat.audioData ?? undefined,
                createdAt: Date.now(),
            }

            setMessages(prev => [...prev, assistantMessage])

            // Trigger TTS playback if audio was returned
            if (savedChat.audioData) {
                setAudio(savedChat.audioData)
            }
        } catch (err) {
            console.error('Failed to send message:', err)
        } finally {
            setAnimation(null)
            setIsLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <TTSControls
                audioData={audio}
                autoPlay={true}
                onPlayingStateChange={(playing: any) => {
                    if (playing) setAnimation('Talking')
                    else setAnimation(null)
                }}
            />
            <div className="relative w-full overflow-hidden -m-4 sm:-m-6 lg:-m-8 left-5 font-[Manrope]" style={{ height: 'calc(100vh - 4rem)'}}>

                {/* Animated tech waves background */}
                <div className="absolute z-0 inset-0">
                    {/*<TechWavesBackground
                        dotColor="#64748b"
                        dotSize={1.5}
                        waveCount={10}
                        speed={0.4}
                        opacity={0.5}
                    />*/}
                </div>

                {/* Full-page 3D canvas behind everything */}
                <div className="absolute inset-0 z-1">
                    <Canvas camera={{ position: [0, 2, 5], fov: 50, near: 0.1, far: 1000 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[5, 10, 5]} intensity={15} />
                        <pointLight position={[-5, 5, -5]} intensity={0.5} />
                        <Suspense fallback={null}>
                            <Assistant
                                position={[0, -3.2, 1]}
                                scale={3}
                                animationName={animation || undefined}
                                idleAnimation={'Idle'}
                            />
                            <Environment preset="studio" />
                        </Suspense>
                    </Canvas>
                </div>

                {/* UI layer on top */}
                <div className="relative z-10 flex flex-col h-full pointer-events-none">
                    <div className="flex-1 relative">
                        {/* Three orbs in a curved arc on the left */}
                        <div
                            className="absolute left-4 sm:left-1 top-1/2 -translate-y-1/2 flex flex-col items-start gap-6 pointer-events-auto">
                            <div className="translate-x-12 scale-30">
                                <DocumentOrb/>
                            </div>
                            <div className="translate-x-2 scale-30">
                                <TranslateOrb/>
                            </div>
                            <div className="translate-x-12 scale-30">
                                <CalendarOrb/>
                            </div>
                        </div>

                        {/* Three orbs in a curved arc on the right */}
                        <div
                            className="absolute right-4 sm:right-1 top-1/2 -translate-y-1/2 flex flex-col items-end gap-6 pointer-events-auto">
                            <div className="-translate-x-12 scale-30">
                                <EmailOrb/>
                            </div>
                            <div className="-translate-x-2 scale-30">
                                <MockInterviewOrb/>
                            </div>
                            <div className="-translate-x-12 scale-30">
                                <SearchCareersOrb/>
                            </div>
                        </div>

                        <ChatHistoryPanel messages={messages} />
                    </div>

                    <div className="w-full shrink-0 p-4 pointer-events-auto">
                        <div className="mx-auto">
                            <AssistantChatBar onSend={handleSend} disabled={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}