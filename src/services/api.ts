// src/services/api.ts
const API_BASE = getApiBase()

function getApiBase(): string {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!url) throw new Error('[api] NEXT_PUBLIC_BACKEND_URL is not set')
    return `${url}/api/v1`
}

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
        ...(token ? {'X-XSRF-TOKEN': token} : {}),
    }
}


// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
    id: number
    username: string
    email: string
    plan?: 'FREE' | 'BASIC' | 'PROFESSIONAL'
    avatar_url?: string
    last_login?: string
}

export type AuthResponse = User & { message?: string }

export interface LoginRequest {
    email: string;
    password: string
}

export interface SignUpRequest {
    username: string;
    email: string;
    password: string
}

export interface ChatHistoryListRequest {
    userId: number;
    tokenLimit?: number
}

export interface ChatHistoryListResponse {
    role: 'USER' | 'ASSISTANT';
    content: string;
    createdAt: string
}

export interface InterviewSessionResponse {
    id: number
    description: string
    createdAt: string
    messages: number
    status: 'IN_PROGRESS' | 'COMPLETED' | string
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

// Represents a document stored against the user's account.
// `content` holds the plain-text body so the resume uploader can pass it
// directly into the interview setup without a second fetch.
export interface UserDocument {
    id: number
    name: string
    s3Key: string      // the unique identifier for the file in S3 (or your storage)
    content?: string       // plain-text body — may be undefined if the backend omits it
    uploadedAt?: string    // ISO date string
    fileType?: string      // e.g. "pdf", "docx"
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
    const {timeoutMs = 8000, ...rest} = init
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), timeoutMs)

    try {
        return await fetch(input, {...rest, signal: controller.signal})
    } finally {
        clearTimeout(t)
    }
}

// ─── Service ──────────────────────────────────────────────────────────────────

class ApiService {

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: csrfHeaders({'Content-Type': 'application/json'}),
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
            headers: csrfHeaders({'Content-Type': 'application/json'}),
            body: JSON.stringify(userData),
            credentials: 'include',
        })
        if (!res.ok) throw new Error(await res.text() || 'Sign up failed')
        return res.json()
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

    // FIX: logout is at /logout (Spring Security default), not /api/v1/logout
    async logout(): Promise<void> {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
            method: 'POST',
            headers: csrfHeaders(),
            credentials: 'include',
        })
    }

    async getMessageHistory(req: ChatHistoryListRequest): Promise<ChatHistoryListResponse[]> {
        const params = req.tokenLimit != null ? `?tokenLimit=${req.tokenLimit}` : ''
        const res = await fetch(`${API_BASE}/chat/user/${req.userId}${params}`, {credentials: 'include'})
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

    async createInterviewSession(description: string, s3Key?: string): Promise<InterviewSessionResponse> {
        const res = await fetch(`${API_BASE}/interview/new-session`, {
            method: 'POST',
            headers: csrfHeaders({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                jobDescription: description,
                resumeS3Key: s3Key ?? null,
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
            description: String(s.description ?? ''),
            createdAt: String(s.created_at ?? ''),
            messages: Number(s.messages ?? 0),
            status: String(s.status ?? 'IN_PROGRESS'),
        }
    }

    async getInterviewSessions(): Promise<InterviewSessionResponse[]> {
        const res = await fetch(`${API_BASE}/interview/get-sessions/`, {
            method: 'GET',
            headers: csrfHeaders(),
            credentials: 'include'
        })
        const data = await handleResponse<any[]>(res)
        return data.map(s => ({
            id: s.id,
            description: String(s.description ?? ''),
            createdAt: String(s.created_at ?? ''),
            messages: Number(s.messages ?? 0),
            status: String(s.status ?? 'IN_PROGRESS'),
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

    async sendInterviewMessage(sessionId: number, userMessage: string): Promise<InterviewMessageResponse> {
        const res = await fetch(`${API_BASE}/interview/messages/${sessionId}/send`, {
            method: 'POST',
            headers: csrfHeaders({'Content-Type': 'application/json'}),
            body: JSON.stringify({sessionId, userMessage}),
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
            credentials: 'include'
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
            credentials: 'include'
        })

        if (!res.ok) {
            if (res.status === 404) throw new Error('FEEDBACK_NOT_FOUND')
            throw new Error(await res.text() || 'Failed to get interview feedback')
        }
        const data = await res.json();
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
            credentials: 'include'
        })
        if (!res.ok) throw new Error(await res.text() || 'Failed to get interview feedback for this user')
        const data = await res.json();
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

    // Returns all documents saved to the authenticated user's account.
    // Adjust the field mapping below to match whatever your backend returns.
    async getUserDocuments(): Promise<UserDocument[]> {
        const res = await fetch(`${API_BASE}/documents/user-documents`, {
            method: 'GET',
            headers: csrfHeaders(),
            credentials: 'include',
        })
        if (!res.ok) {
            // Return empty array rather than throwing — the uploader handles the
            // no-documents state gracefully without an error page.
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

    // Delete document from database, the documents table and the vector table.
    // Inside api.ts
    async deleteDocument(s3Key: string): Promise<void> {
        // Correctly format the parameter into the URL string
        const params = new URLSearchParams({ s3Key });

        const res = await fetch(`${API_BASE}/documents/delete?${params.toString()}`, {
            method: 'DELETE',
            headers: csrfHeaders(), // No need for 'application/json' anymore
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
}

export const api = new ApiService()