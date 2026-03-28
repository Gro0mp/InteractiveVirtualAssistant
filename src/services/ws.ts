import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessageRequest {
    userMessage: string;
    userId: number;
}

export interface ChatMessageResponse {
    type: string;
    responseMessage: string;
    audioUrl: string | null;
    expression: string | null;
    animation: string | null;
}

type MessageListener = (response: ChatMessageResponse) => void;
type ErrorListener = (code: string) => void;
type StatusListener = (status: 'connected' | 'disconnected' | 'error') => void;

// ─── Client ───────────────────────────────────────────────────────────────────

class StompChatClient {
    private client: Client;
    private messageSubscription: StompSubscription | null = null;
    private errorSubscription: StompSubscription | null = null;
    private messageListeners = new Set<MessageListener>();
    private errorListeners = new Set<ErrorListener>();
    private statusListeners = new Set<StatusListener>();
    private currentUserId: number | null = null;

    constructor() {
        this.client = new Client({ reconnectDelay: 3000 });

        this.client.onConnect = () => {
            this.emitStatus('connected');
            if (this.currentUserId !== null) {
                this.subscribeToUserQueues();
            }
        };

        this.client.onDisconnect = () => {
            this.emitStatus('disconnected');
        };

        this.client.onStompError = (frame) => {
            console.error('[ws] STOMP error', frame);
            this.emitStatus('error');
        };

        this.client.onWebSocketError = (evt) => {
            console.error('[ws] WebSocket error', evt);
            this.emitStatus('error');
        };

        this.client.onWebSocketClose = (evt) => {
            console.warn('[ws] WebSocket closed', evt);
            this.emitStatus('disconnected');
        };
    }

    // ── Public API ─────────────────────────────────────────────────────────────

    /**
     * Call once you know the userId (e.g. after login).
     * Activates the STOMP connection and subscribes to the user's private queues.
     */
    connect(userId: number): void {
        this.currentUserId = userId;

        const backendHttpUrl = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? '';
        if (!backendHttpUrl) {
            console.error('[ws] VITE_BACKEND_URL is not set — WebSocket cannot connect.');
            this.emitStatus('error');
            return;
        }

        // Convert http(s)://host[:port] → ws(s)://host[:port]
        const wsBase = backendHttpUrl
            .replace(/^https:/i, 'wss:')
            .replace(/^http:/i, 'ws:')
            .replace(/\/$/, '');

        const brokerURL = wsBase + '/chat-websocket';
        this.client.brokerURL = brokerURL;

        if (!this.client.active) {
            console.debug('[ws] Connecting (native WS) to', brokerURL);
            this.client.activate();
        } else if (this.client.connected) {
            this.subscribeToUserQueues();
        }
    }

    /** Gracefully close the connection and remove all subscriptions. */
    disconnect(): void {
        this.messageSubscription?.unsubscribe();
        this.errorSubscription?.unsubscribe();
        this.messageSubscription = null;
        this.errorSubscription = null;
        this.currentUserId = null;
        this.client.deactivate().then(r => (r));
    }

    /**
     * Send a message to the backend.
     * Maps to @MessageMapping("/chat.sendMessage") → destination: /app/chat.sendMessage
     */
    sendMessage(payload: ChatMessageRequest): void {
        if (!this.client.connected) {
            console.warn('STOMP not connected — message dropped');
            return;
        }
        this.client.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(payload),
        });
    }

    /** Subscribe to incoming AI responses. Returns an unsubscribe function. */
    onMessage(listener: MessageListener): () => void {
        this.messageListeners.add(listener);
        return () => this.messageListeners.delete(listener);
    }

    /** Subscribe to error frames pushed by the backend. Returns an unsubscribe function. */
    onError(listener: ErrorListener): () => void {
        this.errorListeners.add(listener);
        return () => this.errorListeners.delete(listener);
    }

    /** Subscribe to connection status changes. Returns an unsubscribe function. */
    onStatus(listener: StatusListener): () => void {
        this.statusListeners.add(listener);
        return () => this.statusListeners.delete(listener);
    }

    // ── Private ────────────────────────────────────────────────────────────────

    private subscribeToUserQueues(): void {
        this.messageSubscription?.unsubscribe();
        this.errorSubscription?.unsubscribe();

        // Fix: Subscribe to the explicit topic paths matching the backend
        const messageTopic = `/topic/user/${this.currentUserId}/messages`;
        const errorTopic = `/topic/user/${this.currentUserId}/errors`;

        this.messageSubscription = this.client.subscribe(messageTopic, (message: IMessage) => {
            try {
                const response = JSON.parse(message.body) as ChatMessageResponse;
                this.emitMessage(response);
            } catch (err) {
                console.error('Failed to parse message:', err, message.body);
            }
        });

        this.errorSubscription = this.client.subscribe(errorTopic, (message: IMessage) => {
            try {
                const parsed = JSON.parse(message.body) as Partial<ChatMessageResponse>;
                this.emitError(parsed.responseMessage ?? message.body.trim());
            } catch {
                this.emitError(message.body.trim());
            }
        });
    }

    private emitMessage(response: ChatMessageResponse): void {
        for (const l of this.messageListeners) l(response);
    }

    private emitError(codeOrMessage: string): void {
        for (const l of this.errorListeners) l(codeOrMessage);
    }

    private emitStatus(status: 'connected' | 'disconnected' | 'error'): void {
        for (const l of this.statusListeners) l(status);
    }
}

// Singleton — one connection shared across the app
export const wsClient = new StompChatClient();

