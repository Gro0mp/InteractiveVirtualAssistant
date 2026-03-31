// src/services/api.ts
const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`

// FIX: Spring Security's default CSRF cookie name is 'XSRF-TOKEN', not 'csrfToken'
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : null
}

function csrfHeaders(extra?: HeadersInit): HeadersInit {
    const token = getCookie('XSRF-TOKEN')
    return {
        ...(extra ?? {}),
        ...(token ? { 'X-CSRF-TOKEN': token } : {}),
    }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
    id: number
    username: string
    email: string
    plan?: 'free' | 'basic' | 'premium' | 'FREE' | 'BASIC' | 'PREMIUM'
    avatar_url?: string
    last_login?: string
}

export type AuthResponse = User & { message?: string }

export interface LoginRequest  { email: string; password: string }
export interface SignUpRequest { username: string; email: string; password: string }

export interface ChatRequest  { userMessage: string; userId: number }
export interface ChatResponse {
    type: 'RESPONSE' | 'ERROR'
    responseMessage: string
    audioUrl?: string | null
    expression?: string | null
    animation?: string | null
}

export interface ChatHistoryListRequest  { userId: number; tokenLimit?: number }
export interface ChatHistoryListResponse { role: 'USER' | 'ASSISTANT'; content: string; createdAt: string }

export interface InterviewSessionResponse {
    id: number
    description: string
    createdAt: string
    updatedAt?: string
    messages: number
    status: 'IN_PROGRESS' | 'COMPLETED' | string
    totalMessages?: number
}

export interface InterviewMessageResponse {
    responseMessage: string
    audioUrl: string | null
    completed: boolean
    questionsAnswered: number
    totalQuestions: number
}

export interface InterviewMessageHistoryListResponse {
    id: number
    sessionId: number
    role: 'INTERVIEWER' | 'CANDIDATE'
    content: string
    createdAt: string
}

export type PaymentResponse = { message?: string; success?: boolean; sessionId?: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `HTTP ${res.status}`)
    }
    return res.json() as Promise<T>
}

// ─── Service ──────────────────────────────────────────────────────────────────

class ApiService {

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(credentials),
            credentials: 'include',
        })
        if (!res.ok) {
            const err = await res.json().catch(() => ({})) as Record<string, string>
            throw new Error(err['error'] ?? err['message'] ?? 'Login failed')
        }
        return res.json()
    }

    async signUp(userData: SignUpRequest): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE}/users/create-user`, {
            method: 'POST',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(userData),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Sign up failed')
        return res.json()
    }

    async getCurrentUser(): Promise<User> {
        const res = await fetch(`${API_BASE}/users/me`, { credentials: 'include' })
        if (!res.ok) throw new Error('Not authenticated')
        return res.json()
    }

    // FIX: logout is at /logout (Spring Security default), not /api/v1/logout
    async logout(): Promise<void> {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
            method: 'POST',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (!res.ok && !res.redirected) throw new Error('Logout failed')
    }

    async getMessageHistory(req: ChatHistoryListRequest): Promise<ChatHistoryListResponse[]> {
        const params = req.tokenLimit != null ? `?tokenLimit=${req.tokenLimit}` : ''
        const res = await fetch(`${API_BASE}/chat/user/${req.userId}${params}`, { credentials: 'include' })
        const data = await handleResponse<unknown[]>(res)
        if (!Array.isArray(data)) throw new Error('Unexpected response format')
        return data.map((m: any) => ({
            role:      m.role === 'USER' ? 'USER' : 'ASSISTANT',
            content:   String(m.content   ?? ''),
            createdAt: String(m.createdAt ?? ''),
        }))
    }

    async createInterviewSession(userId: number, jobDescription: string): Promise<InterviewSessionResponse> {
        const res = await fetch(`${API_BASE}/interview/new-session`, {
            method: 'POST',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ userId, jobDescription }),
            credentials: 'include',
        })
        if (!res.ok) {
            if (res.status === 429) throw new Error('LIMIT_EXCEEDED')
            throw new Error(await res.text() || 'Failed to create interview session')
        }
        const s: any = await res.json()
        return {
            id:            s.id,
            description:   String(s.description ?? ''),
            createdAt:     String(s.created_at   ?? ''),
            messages:      Number(s.totalMessages ?? 0),
            status:        String(s.status        ?? 'IN_PROGRESS'),
            totalMessages: Number(s.totalMessages ?? 0),
        }
    }

    async getInterviewSessions(userId: string): Promise<InterviewSessionResponse[]> {
        const res = await fetch(`${API_BASE}/interview/get-sessions/${userId}`, { credentials: 'include' })
        const data = await handleResponse<any[]>(res)
        return data.map(s => ({
            id:          s.id,
            description: String(s.description ?? ''),
            createdAt:   String(s.created_at   ?? ''),
            updatedAt:   String(s.updated_at   ?? s.created_at ?? ''),
            messages:    Number(s.totalMessages ?? 0),
            status:      String(s.status        ?? 'IN_PROGRESS'),
        }))
    }

    async deleteInterviewSession(sessionId: number): Promise<void> {
        const res = await fetch(`${API_BASE}/interview/delete-session/${sessionId}`, {
            method: 'DELETE',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Failed to delete session')
    }

    async sendInterviewMessage(interviewSessionId: number, userId: number, userMessage: string): Promise<InterviewMessageResponse> {
        const res = await fetch(`${API_BASE}/interview/messages/receive-interview-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interviewSessionId, userId, userMessage }),
            credentials: 'include',
        })
        if (!res.ok) {
            if (res.status === 429) throw new Error('RATE_LIMITED')
            throw new Error(`[${res.status}] ${await res.text() || 'Failed to send interview message'}`)
        }
        const s: any = await res.json()
        return {
            responseMessage:   String(s.responseMessage    ?? ''),
            audioUrl:          s.audioUrl ? String(s.audioUrl) : null,
            completed:         Boolean(s.completed         ?? false),
            questionsAnswered: Number(s.questionsAnswered  ?? 0),
            totalQuestions:    Number(s.totalQuestions     ?? 0),
        }
    }

    async getInterviewMessages(sessionId: number): Promise<InterviewMessageHistoryListResponse[]> {
        const res = await fetch(`${API_BASE}/interview/messages/session/${sessionId}`, { credentials: 'include' })
        const data = await handleResponse<any[]>(res)
        return data.map(m => ({
            id:        m.id,
            sessionId,
            role:      m.role === 'INTERVIEWER' ? 'INTERVIEWER' : 'CANDIDATE',
            content:   String(m.content   ?? ''),
            createdAt: String(m.createdAt ?? ''),
        }))
    }

    async uploadDocument(file: File, userId?: string): Promise<string> {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('userId', userId ?? '')
        const res = await fetch(`${API_BASE}/documents/upload`, {
            method: 'POST',
            headers: csrfHeaders(),
            body: formData,
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Upload failed')
        return res.text()
    }

    async translateDocument(file: File): Promise<Record<string, string>> {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch(`${API_BASE}/translate/extract`, {
            method: 'POST',
            headers: csrfHeaders(),
            body: formData,
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Translation failed')
        return res.json()
    }
}

export const api = new ApiService()