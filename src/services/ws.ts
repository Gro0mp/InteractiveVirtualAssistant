import {Client, type IMessage, type StompSubscription} from '@stomp/stompjs'

export interface ChatMessageRequest {
    userMessage: string
    userId: number
}

export interface ChatMessageResponse {
    type: string
    responseMessage: string
    audioUrl: string | null
    expression: string | null
    animation: string | null
}

type MessageListener = (response: ChatMessageResponse) => void
type ErrorListener  = (code: string) => void
type StatusListener = (status: 'connected' | 'disconnected' | 'error') => void

class StompChatClient {
    private client: Client
    private messageSubscription: StompSubscription | null = null
    private errorSubscription:   StompSubscription | null = null
    private messageListeners = new Set<MessageListener>()
    private errorListeners   = new Set<ErrorListener>()
    private statusListeners  = new Set<StatusListener>()
    private currentUserId: number | null = null

    constructor() {
        this.client = new Client({ reconnectDelay: 3_000 })

        this.client.onConnect       = () => { this.emitStatus('connected');    if (this.currentUserId !== null) this.subscribeToUserQueues() }
        this.client.onDisconnect    = () => { this.emitStatus('disconnected') }
        this.client.onStompError    = (f) => { console.error('[ws] STOMP error', f);     this.emitStatus('error') }
        this.client.onWebSocketError= (e) => { console.error('[ws] WS error', e);        this.emitStatus('error') }
        this.client.onWebSocketClose= (e) => { console.warn('[ws] WS closed', e);        this.emitStatus('disconnected') }
    }

    connect(userId: number): void {
        this.currentUserId = userId

        // FIX: was import.meta.env.VITE_BACKEND_URL (Vite syntax).
        // Next.js exposes env vars as process.env.NEXT_PUBLIC_*.
        const backendHttpUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
        if (!backendHttpUrl) {
            console.error('[ws] NEXT_PUBLIC_BACKEND_URL is not set — WebSocket cannot connect.')
            this.emitStatus('error')
            return
        }

        const wsBase = backendHttpUrl
            .replace(/^https:/i, 'wss:')
            .replace(/^http:/i,  'ws:')
            .replace(/\/$/, '')

        this.client.brokerURL = `${wsBase}/chat-websocket`

        if (!this.client.active) {
            this.client.activate()
        } else if (this.client.connected) {
            this.subscribeToUserQueues()
        }
    }

    disconnect(): void {
        this.messageSubscription?.unsubscribe()
        this.errorSubscription?.unsubscribe()
        this.messageSubscription = null
        this.errorSubscription   = null
        this.currentUserId       = null
        void this.client.deactivate()
    }

    sendMessage(payload: ChatMessageRequest): void {
        if (!this.client.connected) { console.warn('[ws] not connected — message dropped'); return }
        this.client.publish({ destination: '/app/chat.sendMessage', body: JSON.stringify(payload) })
    }

    onMessage(listener: MessageListener): () => void { this.messageListeners.add(listener); return () => this.messageListeners.delete(listener) }
    onError  (listener: ErrorListener  ): () => void { this.errorListeners.add(listener);   return () => this.errorListeners.delete(listener) }
    onStatus (listener: StatusListener ): () => void { this.statusListeners.add(listener);   return () => this.statusListeners.delete(listener) }

    private subscribeToUserQueues(): void {
        this.messageSubscription?.unsubscribe()
        this.errorSubscription?.unsubscribe()

        this.messageSubscription = this.client.subscribe(
            '/user/queue/messages',
            (msg: IMessage) => {
                try   { this.emitMessage(JSON.parse(msg.body) as ChatMessageResponse) }
                catch (e) { console.error('[ws] parse error', e, msg.body) }
            },
        )
        this.errorSubscription = this.client.subscribe(
            '/user/queue/errors',
            (msg: IMessage) => {
                try   { const p = JSON.parse(msg.body) as Partial<ChatMessageResponse>; this.emitError(p.responseMessage ?? msg.body.trim()) }
                catch { this.emitError(msg.body.trim()) }
            },
        )
    }

    private emitMessage(r: ChatMessageResponse) { for (const l of this.messageListeners) l(r) }
    private emitError  (c: string)               { for (const l of this.errorListeners)   l(c) }
    private emitStatus (s: 'connected' | 'disconnected' | 'error') { for (const l of this.statusListeners) l(s) }
}

export const wsClient = new StompChatClient()