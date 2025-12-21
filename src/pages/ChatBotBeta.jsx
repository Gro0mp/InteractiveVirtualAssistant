import { useEffect, useState, useRef } from 'react';

import { MessageList } from '../components/ChatbotSection/chatControls/MessageList.jsx';
import { MessageBox } from '../components/ChatbotSection/chatControls/MessageBox.jsx';

import { Scene } from "../components/ChatbotSection/scene/Scene.jsx";
import { Client } from '@stomp/stompjs';
import TTSControls from "../components/ChatbotSection/audioControls/TTSControls.jsx";
import {Header} from "../components/ChatbotSection/chatControls/Header.jsx";

export default function ChatBotBeta() {
    // Message and response states
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [audio, setAudio] = useState(null);
    const [pose, setPose] = useState(null);
    const [expressions, setExpressions] = useState(null);

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [connected, setConnected] = useState(false);

    // Track if character is currently speaking
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Generate a temporary session ID for anonymous users
    const sessionId = useRef(`guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    const stompClientRef = useRef(null);

    /**
     * Connect to WebSocket server for guest users
     * Uses a temporary session ID instead of a real user ID
     */
    const connectWebSocket = () => {
        console.log('Connecting to WebSocket for guest session:', sessionId.current);

        // Create STOMP client with native WebSocket
        const client = new Client({
            // Use native WebSocket
            brokerURL: 'ws://localhost:8080/websocket',

            // Reconnect settings
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            // Connection callbacks
            onConnect: (frame) => {
                console.log('Connected to WebSocket (Guest Mode):', frame);
                setConnected(true);

                // Subscribe to messages using session ID
                console.log('Subscribing to /user/queue/messages');
                client.subscribe(`/user/${sessionId.current}/queue/messages`, (message) => {
                    console.log('📨 Raw message received on /user/queue/messages:', message);
                    const response = JSON.parse(message.body);
                    handleWebSocketMessage(response);
                });

                console.log('Guest session ready - no chat history loaded');
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
    };

    const disconnectWebSocket = () => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
            setConnected(false);
            console.log('Disconnected from WebSocket');
        }
    };

    const handleWebSocketMessage = (response) => {
        console.log('Received WebSocket message:', response);

        switch (response.type) {
            // Message received acknowledgment
            case 'received':
                console.log('✓ Message received by server');
                break;

            // New AI response
            case 'response':
                setLoading(false);
                const aiMessage = {
                    id: `${Date.now()}-assistant`,
                    role: 'assistant',
                    content: response.response,
                    audio: response.audioData,
                    expressions: response.expressionValues
                };

                console.log('AI Response:', aiMessage.content);
                console.log('Expressions (raw):', response.expressionValues);
                console.log('Pose data:', response.pose);

                // Update pose state
                setPose(response.pose?.trim() || null);

                // Parse expressions if it's a JSON string
                let parsedExpressions = null;
                if (response.expressionValues) {
                    try {
                        if (typeof response.expressionValues === 'string') {
                            parsedExpressions = JSON.parse(response.expressionValues);
                        } else {
                            parsedExpressions = response.expressionValues;
                        }
                        console.log('Expressions (parsed):', parsedExpressions);
                    } catch (error) {
                        console.error('Error parsing expressions:', error);
                    }
                }

                // Update expressions state
                setExpressions(parsedExpressions);

                // Set response and audio states
                setResponse(aiMessage.content);
                setMessages(prev => [...prev, aiMessage]);

                // Set audio bytes to trigger playback
                if (response.audioData && response.audioData.length > 0) {
                    console.log('Audio data received, size:', response.audioData.length);
                    setAudio(response.audioData);
                } else {
                    console.log('No audio data in response');
                }

                break;

            case 'error':
                console.error('Server error:', response.message);
                setLoading(false);
                setMessages(prev => [...prev, {
                    id: `error-${Date.now()}`,
                    role: 'assistant',
                    content: `Error: ${response.message}`
                }]);
                break;
        }
    };

    // Handle sending user message
    const handleSend = () => {
        // Prevent sending empty messages or if loading or not connected
        if (!input.trim() || loading || !connected) {
            if (!connected) {
                console.warn('Cannot send: WebSocket not connected');
            }
            return;
        }

        // Prepare user message
        const userMessage = input.trim();

        // Optimistically add user message to chat
        const tempUserMessage = {
            id: `temp-user-${Date.now()}`,
            role: 'user',
            content: userMessage,
        };

        // Update states
        setMessages((prevMessages) => [...prevMessages, tempUserMessage]);
        setInput('');
        setLoading(true);

        try {
            // Get STOMP client
            const client = stompClientRef.current;

            // Publish message to server with session ID
            client.publish({
                destination: '/app/chat',
                body: JSON.stringify({
                    userId: sessionId.current,
                    message: userMessage,
                    isGuest: true
                })
            });

            console.log('Message sent via WebSocket (Guest):', userMessage);

        } catch (error) {
            console.error('Error sending message:', error);
            setLoading(false);

            setMessages(prev => [...prev, {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: 'Sorry, I encountered an error sending your message. Please try again.'
            }]);
        }
    };

    // Clear chat history
    const handleClearChat = () => {
        setMessages([]);
        setResponse('');
        setAudio(null);
        setPose(null);
        setExpressions(null);
        console.log('Chat history cleared');
    };

    // Callback when audio starts/stops
    const handleAudioStateChange = (isPlaying) => {
        setIsSpeaking(isPlaying);
    };

    useEffect(() => {
        // Connect to WebSocket on mount
        connectWebSocket();

        // Disconnect on unmount
        return () => {
            disconnectWebSocket();
        };
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {/* Connection status banner */}
            {!connected && (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-center text-sm">
                    ⚠️ Reconnecting to server...
                </div>
            )}

            {/* Pass speaking state, pose, and expressions to Scene */}
            <Scene
                isSpeaking={isSpeaking}
                pose={pose}
                expressions={expressions}
            />

            <Header user={null} clearChat={handleClearChat} isGuest={true}/>

            {/* Message list */}
            <MessageList messages={messages} loading={loading} />

            {/* Message input box */}
            <MessageBox
                input={input}
                setInput={setInput}
                onSend={handleSend}
                loading={loading}
                disabled={!connected}
                isGuest={true}
            />

            {/* Audio player - plays automatically when audioBytes change */}
            <TTSControls
                audioData={audio}
                autoPlay={true}
                onPlayingStateChange={handleAudioStateChange}
            />
        </div>
    );
}