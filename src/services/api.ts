// src/services/api.ts
const API_BASE = getApiBase()

function getApiBase(): string {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!url) throw new Error('[api] NEXT_PUBLIC_BACKEND_URL is not set')
    return `${url}/api/v1`
}

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : null
}

function csrfHeaders(extra?: HeadersInit): HeadersInit {
    const token = getCookie('XSRF-TOKEN')
    return {
        ...(extra ?? {}),
        ...(token ? { 'X-XSRF-TOKEN': token } : {}),
    }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
    id: number
    username: string
    email: string
    plan?: 'FREE' | 'BASIC' | 'PROFESSIONAL'
    stripeSubscriptionStatus?: string | null
    avatar_url?: string
    last_login?: string
    setUpComplete: boolean
    firstName?: string
    lastName?: string
    jobTitle?: string
    company?: string
    location?: string
    goals?: string
    experienceLevel?: string
    emailNotifications?: boolean
    weeklyDigest?: boolean
    interviewReminders?: boolean
}

export interface Integration {
    provider: 'github' | 'google'
    connected: boolean
    scope: string | null
}

export interface UpdateCredentialsRequest {
    username?: string
    email?: string
}

export interface UpdateProfileRequest {
    firstName?: string
    lastName?: string
    jobTitle?: string
    company?: string
    location?: string
    experienceLevel?: string
    goals?: string
}

export interface UpdatePreferencesRequest {
    emailNotifications?: boolean
    weeklyDigest?: boolean
    interviewReminders?: boolean
}

export interface AccountSetupRequest {
    firstName: string
    lastName: string
    jobTitle: string
    company: string
    experienceLevel: string
    goals: string
    emailNotifications: boolean
    weeklyDigest: boolean
    interviewReminders: boolean
}

export interface LoginRequest {
    email: string
    password: string
}

export interface SignUpRequest {
    username: string
    email: string
    password: string
}

export interface ChatHistoryListRequest {
    userId: number
    tokenLimit?: number
}

export interface ChatHistoryListResponse {
    role: 'USER' | 'ASSISTANT'
    content: string
    createdAt: string
}

/**
 * Mirrors the backend ChatResponse record.
 * type: 'AUDIO' | 'DONE' | 'ERROR'
 */
export interface ChatStreamEvent {
    type: 'AUDIO' | 'DONE' | 'ERROR'
    responseMessage: string | null
    audioUrl: string | null
    expression: string | null
    animation: string | null
}

/**
 * Callback interface for sendChatMessage.
 * onAudio fires for each sentence chunk with its text and optional TTS audio URL.
 * onDone fires once when the stream ends normally.
 * onError fires on ERROR events or network failures with an error code string.
 */
export interface ChatStreamCallbacks {
    onAudio: (text: string, audioUrl: string | null) => void
    onDone: () => void
    onError: (code: string) => void
}

export interface InterviewSessionResponse {
    id: number
    title: string
    createdAt: string
    status: 'IN_PROGRESS' | 'COMPLETED' | string
    questionsAnswered: number
    totalQuestions: number
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

export interface InterviewFeedbackResponse {
    sessionId: number
    sessionTitle: string
    overallScore: number
    summary: string
    communicationScore: number
    communicationFeedback: string
    technicalDepthScore: number
    technicalDepthFeedback: string
    confidenceScore: number
    confidenceFeedback: string
    clarityScore: number
    clarityFeedback: string
    problemSolvingScore: number
    problemSolvingFeedback: string
    strengths: string[]
    improvements: string[]
    completedAt: string | null
    feedbackCreatedAt: string
}

export interface UserDocument {
    id: number
    name: string
    s3Key: string
    content?: string
    uploadedAt?: string
    fileType?: string
    viewUrl?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `HTTP ${res.status}`)
    }
    return await res.json() as Promise<T>
}

async function fetchWithTimeout(
    input: RequestInfo | URL,
    init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
    const { timeoutMs = 8000, ...rest } = init
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), timeoutMs)
    try {
        return await fetch(input, { ...rest, signal: controller.signal })
    } finally {
        clearTimeout(t)
    }
}

// ─── Service ──────────────────────────────────────────────────────────────────

class ApiService {

    async login(credentials: LoginRequest): Promise<User> {
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

    async signUp(userData: SignUpRequest): Promise<User> {
        const res = await fetch(`${API_BASE}/users/create-user`, {
            method: 'POST',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(userData),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Sign up failed')
        return res.json()
    }

    /**
     * GET /api/v1/integrations
     * Returns connection status for all supported OAuth providers.
     */
    async getIntegrations(): Promise<Integration[]> {
        const res = await fetch(`${API_BASE}/integrations`, {
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Failed to load integrations')
        return res.json()
    }

    /**
     * DELETE /api/v1/integrations/{provider}
     * Unlinks the provider from the user's account.
     * Throws with message "LAST_LOGIN_METHOD" if it would lock the user out.
     */
    async disconnectIntegration(provider: 'github' | 'google'): Promise<void> {
        const res = await fetch(`${API_BASE}/integrations/${provider}`, {
            method: 'DELETE',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (res.status === 409) throw new Error('LAST_LOGIN_METHOD')
        if (res.status === 404) throw new Error(`${provider} is not connected`)
        if (!res.ok) throw new Error(await res.text() || 'Failed to disconnect integration')
    }

    /**
     * Redirects the user to re-authorize / newly connect a provider.
     * Use this both for "Connect" and "Reconnect" (e.g. to upgrade scopes).
     */
    connectIntegration(provider: 'github' | 'google', returnTo = '/assistant'): void {
        const params = new URLSearchParams({ returnTo })
        window.location.href =
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/${provider}?${params}`
    }

    async completeAccountSetup(req: AccountSetupRequest): Promise<void> {
        const res = await fetch(`${API_BASE}/users/complete-setup`, {
            method: 'POST',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(req),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Account setup failed')
    }

    async updateCredentials(req: UpdateCredentialsRequest): Promise<void> {
        if (!req.username && !req.email) return
        const res = await fetch(`${API_BASE}/users/update-credentials`, {
            method: 'PUT',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(req),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Failed to update credentials')
    }

    async updateProfile(req: UpdateProfileRequest): Promise<void> {
        const res = await fetch(`${API_BASE}/users/update-profile`, {
            method: 'PUT',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(req),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Failed to update profile')
    }

    async updatePreferences(req: UpdatePreferencesRequest): Promise<void> {
        const res = await fetch(`${API_BASE}/users/update-preferences`, {
            method: 'PUT',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(req),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Failed to update preferences')
    }

    async getCurrentUser(): Promise<User> {
        try {
            const res = await fetchWithTimeout(`${API_BASE}/users/me`, {
                credentials: 'include',
                timeoutMs: 8000,
            })
            if (!res.ok) throw new Error('Not authenticated')
            return res.json()
        } catch (err: any) {
            if (err?.name === 'AbortError') throw new Error('AUTH_TIMEOUT')
            throw err
        }
    }

    async logout(): Promise<void> {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
            method: 'POST',
            headers: csrfHeaders(),
            credentials: 'include',
        })
    }

    async getMessageHistory(req: ChatHistoryListRequest): Promise<ChatHistoryListResponse[]> {
        const params = req.tokenLimit != null ? `?tokenLimit=${req.tokenLimit}` : ''
        const res = await fetch(`${API_BASE}/chat/user/${req.userId}${params}`, { credentials: 'include' })
        const data = await handleResponse<unknown[]>(res)
        if (!Array.isArray(data)) throw new Error('Unexpected response format')
        return data.map((m: any) => ({
            role: m.role === 'USER' ? 'USER' : 'ASSISTANT',
            content: String(m.content ?? ''),
            createdAt: String(m.createdAt ?? ''),
        }))
    }

    async deleteMessageHistory(): Promise<void> {
        const response = await fetch(`${API_BASE}/chat/delete/chat-history/`, {
            method: 'DELETE',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (!response.ok) throw new Error(await response.text() || 'Failed to delete chat history')
    }

    /**
     * Sends a chat message and streams the SSE response from POST /api/v1/chat/send.
     *
     * Why fetch + ReadableStream instead of native EventSource:
     *   - EventSource is GET-only and cannot attach a request body or CSRF headers.
     *   - fetch gives us full control over headers, credentials, and cancellation.
     *
     * Returns { abort } so the caller can cancel mid-stream, e.g. when the user
     * sends a new message before the current one finishes.
     */
    sendChatMessage(
        payload: { userMessage: string; userId: number; style?: string },
        callbacks: ChatStreamCallbacks,
    ): { abort: () => void } {
        const controller = new AbortController()

        const run = async () => {
            let res: Response
            try {
                res = await fetch(`${API_BASE}/chat/send`, {
                    method: 'POST',
                    headers: csrfHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(payload),
                    credentials: 'include',
                    signal: controller.signal,
                })
            } catch (err: any) {
                if (err?.name === 'AbortError') return // intentional cancel
                callbacks.onError('NETWORK_ERROR')
                return
            }

            if (!res.ok) {
                if (res.status === 429) { callbacks.onError('RATE_LIMIT_EXCEEDED'); return }
                if (res.status === 401) { callbacks.onError('UNAUTHENTICATED');     return }
                callbacks.onError(`HTTP_${res.status}`)
                return
            }

            // Read SSE stream line-by-line
            const reader    = res.body!.getReader()
            const decoder   = new TextDecoder()
            let   buffer    = ''
            let   eventType = ''

            while (true) {
                let done: boolean
                let value: Uint8Array | undefined
                try {
                    ;({ done, value } = await reader.read())
                } catch (err: any) {
                    if (err?.name === 'AbortError') return
                    callbacks.onError('STREAM_READ_ERROR')
                    return
                }

                if (done) break

                buffer += decoder.decode(value, { stream: true })

                // SSE messages are separated by double newlines (\n\n)
                const parts = buffer.split('\n\n')
                buffer = parts.pop() ?? '' // last part may be incomplete

                for (const part of parts) {
                    for (const line of part.split('\n')) {
                        if (line.startsWith('event:')) {
                            eventType = line.slice(6).trim()
                        } else if (line.startsWith('data:')) {
                            const raw = line.slice(5).trim()
                            try {
                                const event = JSON.parse(raw) as ChatStreamEvent
                                const type  = eventType || event.type
                                if (type === 'AUDIO') {
                                    callbacks.onAudio(event.responseMessage ?? '', event.audioUrl)
                                } else if (type === 'DONE') {
                                    callbacks.onDone()
                                    return
                                } else if (type === 'ERROR') {
                                    callbacks.onError(event.responseMessage ?? 'UNKNOWN_ERROR')
                                    return
                                }
                            } catch {
                                console.warn('[api] SSE parse error, raw:', raw)
                            }
                            eventType = ''
                        }
                    }
                }
            }
        }

        void run()
        return { abort: () => controller.abort() }
    }

    async createInterviewSession(description: string, interviewLength: string, s3Key?: string): Promise<InterviewSessionResponse> {
        const res = await fetch(`${API_BASE}/interview/new-session`, {
            method: 'POST',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                jobDescription: description,
                resumeS3Key: s3Key ?? null,
                interviewLength: interviewLength,
            }),
            credentials: 'include',
        })
        if (!res.ok) {
            if (res.status === 429) throw new Error('LIMIT_EXCEEDED')
            throw new Error(await res.text() || 'Failed to create interview session')
        }
        const s: any = await res.json()
        return {
            id: s.id,
            title: String(s.title ?? ''),
            createdAt: String(s.created_at ?? ''),
            status: String(s.status ?? 'IN_PROGRESS'),
            questionsAnswered: Number(s.questionsAnswered ?? 0),
            totalQuestions: Number(s.totalQuestions ?? 0),
        }
    }

    async getCurrentInterviewSession(sessionId: number): Promise<InterviewSessionResponse> {
        const res = await fetch(`${API_BASE}/interview/session/${sessionId}`, {
            method: 'GET',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Failed to get interview session')
        const s: any = await res.json()
        return {
            id: s.id,
            title: String(s.title ?? ''),
            createdAt: String(s.created_at ?? ''),
            status: String(s.status ?? 'IN_PROGRESS'),
            questionsAnswered: Number(s.questionsAnswered ?? 0),
            totalQuestions: Number(s.totalQuestions ?? 0),
        }
    }

    async getInterviewSessions(): Promise<InterviewSessionResponse[]> {
        const res = await fetch(`${API_BASE}/interview/get-sessions/`, {
            method: 'GET',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        const data = await handleResponse<any[]>(res)
        return data.map(s => ({
            id: s.id,
            title: String(s.title ?? ''),
            createdAt: String(s.created_at ?? ''),
            status: String(s.status ?? 'IN_PROGRESS'),
            questionsAnswered: Number(s.questionsAnswered ?? 0),
            totalQuestions: Number(s.totalQuestions ?? 0),
        }))
    }

    async deleteInterviewSession(sessionId: number): Promise<void> {
        const res = await fetch(`${API_BASE}/interview/delete-session/${sessionId}`, {
            method: 'DELETE',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (!res.ok) {
            const text = await res.text().catch(() => '')
            if (res.status === 404) throw new Error('SESSION_NOT_FOUND')
            throw new Error(text || 'Failed to delete session')
        }
    }

    async sendInterviewMessage(sessionId: number, userMessage: string): Promise<InterviewMessageResponse> {
        const res = await fetch(`${API_BASE}/interview/messages/${sessionId}/send`, {
            method: 'POST',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ sessionId, userMessage }),
            credentials: 'include',
        })
        if (!res.ok) {
            if (res.status === 429) throw new Error('RATE_LIMITED')
            throw new Error(`[${res.status}] ${await res.text() || 'Failed to send interview message'}`)
        }
        const s: any = await res.json()
        return {
            responseMessage: String(s.responseMessage ?? ''),
            audioUrl: s.audioUrl ? String(s.audioUrl) : null,
            completed: Boolean(s.completed ?? false),
            questionsAnswered: Number(s.questionsAnswered ?? 0),
            totalQuestions: Number(s.totalQuestions ?? 0),
        }
    }

    async getInterviewMessages(sessionId: number): Promise<InterviewMessageHistoryListResponse[]> {
        const res = await fetch(`${API_BASE}/interview/messages/${sessionId}/history`, {
            credentials: 'include',
        })
        const data = await handleResponse<any[]>(res)
        return data.map(m => ({
            id: m.id,
            sessionId,
            role: m.role === 'INTERVIEWER' ? 'INTERVIEWER' : 'CANDIDATE',
            content: String(m.content ?? ''),
            createdAt: String(m.createdAt ?? ''),
        }))
    }

    async getInterviewSessionFeedback(sessionId: number): Promise<InterviewFeedbackResponse> {
        const res = await fetch(`${API_BASE}/interview/feedback/${sessionId}`, {
            method: 'GET',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (!res.ok) {
            if (res.status === 404) throw new Error('FEEDBACK_NOT_FOUND')
            throw new Error(await res.text() || 'Failed to get interview feedback')
        }
        const data = await res.json()
        return {
            sessionId: Number(data.sessionId ?? 0),
            sessionTitle: String(data.sessionTitle ?? ''),
            overallScore: Number(data.overallScore ?? 0),
            summary: String(data.summary ?? ''),
            communicationScore: Number(data.communicationScore ?? 0),
            communicationFeedback: String(data.communicationFeedback ?? ''),
            technicalDepthScore: Number(data.technicalDepthScore ?? 0),
            technicalDepthFeedback: String(data.technicalDepthFeedback ?? ''),
            confidenceScore: Number(data.confidenceScore ?? 0),
            confidenceFeedback: String(data.confidenceFeedback ?? ''),
            clarityScore: Number(data.clarityScore ?? 0),
            clarityFeedback: String(data.clarityFeedback ?? ''),
            problemSolvingScore: Number(data.problemSolvingScore ?? 0),
            problemSolvingFeedback: String(data.problemSolvingFeedback ?? ''),
            strengths: Array.isArray(data.strengths) ? data.strengths.map(String) : [],
            improvements: Array.isArray(data.improvements) ? data.improvements.map(String) : [],
            completedAt: String(data.completedAt ?? ''),
            feedbackCreatedAt: String(data.feedbackCreatedAt ?? ''),
        }
    }

    async getAllInterviewFeedback(): Promise<InterviewFeedbackResponse[]> {
        const res = await fetch(`${API_BASE}/interview/feedback/all-feedback`, {
            method: 'GET',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Failed to get interview feedback for this user')
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Unexpected response format')
        return data.map((item: any) => ({
            sessionId: Number(item.sessionId ?? 0),
            sessionTitle: String(item.sessionTitle ?? ''),
            overallScore: Number(item.overallScore ?? 0),
            summary: String(item.summary ?? ''),
            communicationScore: Number(item.communicationScore ?? 0),
            communicationFeedback: String(item.communicationFeedback ?? ''),
            technicalDepthScore: Number(item.technicalDepthScore ?? 0),
            technicalDepthFeedback: String(item.technicalDepthFeedback ?? ''),
            confidenceScore: Number(item.confidenceScore ?? 0),
            confidenceFeedback: String(item.confidenceFeedback ?? ''),
            clarityScore: Number(item.clarityScore ?? 0),
            clarityFeedback: String(item.clarityFeedback ?? ''),
            problemSolvingScore: Number(item.problemSolvingScore ?? 0),
            problemSolvingFeedback: String(item.problemSolvingFeedback ?? ''),
            strengths: Array.isArray(item.strengths) ? item.strengths.map(String) : [],
            improvements: Array.isArray(item.improvements) ? item.improvements.map(String) : [],
            completedAt: String(item.completedAt ?? ''),
            feedbackCreatedAt: String(item.feedbackCreatedAt ?? ''),
        }))
    }

    async getUserDocuments(): Promise<UserDocument[]> {
        const res = await fetch(`${API_BASE}/documents/user-documents`, {
            method: 'GET',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (!res.ok) {
            console.error('Failed to load documents:', await res.text().catch(() => ''))
            return []
        }
        const data = await res.json() as any[]
        return data.map(d => ({
            id: d.id,
            name: String(d.name ?? d.fileName ?? d.filename ?? 'Untitled'),
            s3Key: String(d.s3Key ?? d.storageKey ?? d.key ?? ''),
            content: d.content ? String(d.content) : undefined,
            uploadedAt: d.uploadedAt ?? d.createdAt ?? undefined,
            fileType: d.fileType ?? d.type ?? undefined,
            viewUrl: d.viewUrl ?? d.url ?? undefined,
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

    async deleteDocument(s3Key: string): Promise<void> {
        const params = new URLSearchParams({ s3Key })
        const res = await fetch(`${API_BASE}/documents/delete?${params.toString()}`, {
            method: 'DELETE',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Failed to delete document')
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

    async deleteAccount(): Promise<void> {
        const res = await fetch(`${API_BASE}/users/delete-user`, {
            method: 'DELETE',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (!res.ok) {
            const text = await res.text().catch(() => '')
            if (res.status === 409) throw new Error('SUBSCRIPTION_CANCEL_FAILED')
            throw new Error(text || 'Failed to delete account')
        }
    }

    async createCheckoutSession(plan: string): Promise<string> {
        const res = await fetch(`${API_BASE}/payments/create-checkout-session`, {
            method: 'POST',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ plan }),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Failed to create checkout session')
        const data = await res.json()
        return data.url
    }

    async createPortalSession(sessionId?: string): Promise<string> {
        const res = await fetch(`${API_BASE}/payments/create-portal-session`, {
            method: 'POST',
            headers: csrfHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ session_id: sessionId ?? '' }),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Failed to create portal session')
        const data = await res.json()
        return data.url
    }
}

export const api = new ApiService()