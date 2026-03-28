// API service for backend communication
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;


export interface User {
    id: number;
    username: string;
    email: string;
    plan?: 'free' | 'basic' | 'premium';
    avatar_url?: string;
    last_login?: string;
}

export type AuthResponse = User & {
    message?: string;
};

export interface LoginRequest {
    username?: string;
    email: string;
    password: string;
    last_login?: string;
}

export interface SignUpRequest {
    username: string;
    email: string;
    password: string;
    last_login?: string;
}


export interface ChatRequest {
    userMessage: string;
    userId: number;
}

export interface ChatResponse {
    type: 'RESPONSE' | 'ERROR';
    responseMessage: string;
    audioUrl?: string | null;
    expression?: string | null;
    animation?: string | null;
}

export interface ChatHistoryListRequest {
    userId: number;
    tokenLimit?: number;
}

export interface ChatHistoryListResponse {
    role: 'USER' | 'ASSISTANT';
    content: string;
    createdAt: string;
}


export interface InterviewSessionResponse {
    id: number;
    description: string;
    createdAt: string;
    updatedAt?: string;
    messages: number;
    status: 'IN_PROGRESS' | 'COMPLETED' | string;
    totalMessages?: number;
}

export interface InterviewMessageResponse {
    responseMessage: string;
    audioUrl: string | null;
    completed: boolean;
    questionsAnswered: number;
    totalQuestions: number;
}

export interface InterviewMessageHistoryListResponse {
    id: number;
    sessionId: number;
    role: 'INTERVIEWER' | 'CANDIDATE';
    content: string;
    createdAt: string;
}


export type PaymentResponse = {
    message?: string;
    success?: boolean;
    sessionId?: string;
};

export interface ErrorResponse {
    error?: string;
    message?: string;
}

class ApiService {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            credentials: 'include',
        });
        if (!response.ok) {
            const error: ErrorResponse = await response.json();
            throw new Error(error.error || error.message || 'Login failed');
        }
        return response.json();
    }

    async signUp(userData: SignUpRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/users/create-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
            credentials: 'include',
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Sign up failed');
        }
        return response.json();
    }

    async getCurrentUser(): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Not authenticated');
        return response.json();
    }

    async getUserById(id: number): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
    }

    async logout(): Promise<void> {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!(response.ok || response.redirected)) {
            const text = await response.text().catch(() => '');
            throw new Error(text || 'Logout failed');
        }
    }

    /**
     * FIX: was sending userId and tokenLimit as a request body on a GET request.
     * Backend was updated to accept these as query params and a path variable —
     * now matches: GET /api/v1/chat/user/{userId}?tokenLimit=N
     */
    async getMessageHistory(req: ChatHistoryListRequest): Promise<ChatHistoryListResponse[]> {
        const params = new URLSearchParams();
        if (req.tokenLimit != null) params.set('tokenLimit', String(req.tokenLimit));

        const url = `${API_BASE_URL}/chat/user/${req.userId}${params.size ? `?${params}` : ''}`;
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to fetch message history');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Unexpected response format for message history.');
        }
        return (data as any[]).map((m) => ({
            role: m.role === 'USER' ? 'USER' : 'ASSISTANT',
            content: String(m.content ?? ''),
            createdAt: String(m.createdAt ?? ''),
        }));
    }

    /**
     * FIX: was sending field named `content` — backend ChatRequest DTO expects `userMessage`.
     * This caused the backend to receive a null message for every REST chat send.
     */
    // async processMessage(chatRequest: ChatRequest): Promise<ChatResponse> {
    //     const response = await fetch(`${API_BASE_URL}/chat/receive-message`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             userId: chatRequest.userId,
    //             userMessage: chatRequest.userMessage, // FIX: was `content`
    //         }),
    //         credentials: 'include',
    //     });
    //     if (!response.ok) {
    //         const text = await response.text().catch(() => '');
    //         throw new Error(`processMessage failed [${response.status}]: ${text}`);
    //     }
    //     const s: any = await response.json();
    //     return {
    //         type: s.type === 'ERROR' ? 'ERROR' : 'RESPONSE',
    //         responseMessage: String(s.responseMessage ?? ''),
    //         audioUrl: s.audioUrl ? String(s.audioUrl) : null,
    //         expression: s.expression ? String(s.expression) : null,
    //         animation: s.animation ? String(s.animation) : null,
    //     };
    // }

    async createInterviewSession(userId: number, jobDescription: string): Promise<InterviewSessionResponse> {
        const response = await fetch(`${API_BASE_URL}/interview/new-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, jobDescription }),
            credentials: 'include',
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            if (response.status === 429) throw new Error('LIMIT_EXCEEDED');
            throw new Error(text || 'Failed to create interview session');
        }
        const s: any = await response.json();
        return {
            id: s.id,
            description: String(s.description ?? ''),
            createdAt: String(s.created_at ?? ''),
            messages: Number(s.totalMessages ?? 0),
            status: String(s.status ?? 'IN_PROGRESS'),
            totalMessages: Number(s.totalMessages ?? 0),
        };
    }

    async getInterviewSessions(userId: string): Promise<InterviewSessionResponse[]> {
        const response = await fetch(`${API_BASE_URL}/interview/get-sessions/${userId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to retrieve interview sessions');
        const data = await response.json();
        return (data as any[]).map((s) => ({
            id: s.id,
            description: String(s.description ?? ''),
            createdAt: String(s.created_at ?? ''),
            updatedAt: String(s.updated_at ?? s.created_at ?? ''),
            messages: Number(s.totalMessages ?? 0),
            status: String(s.status ?? 'IN_PROGRESS'),
        }));
    }

    async deleteInterviewSession(sessionId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/interview/delete-session/${sessionId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(text || 'Failed to delete session');
        }
    }

    async sendInterviewMessage(
        interviewSessionId: number,
        userId: number,
        userMessage: string,
    ): Promise<InterviewMessageResponse> {
        const response = await fetch(`${API_BASE_URL}/interview/messages/receive-interview-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interviewSessionId, userId, userMessage }),
            credentials: 'include',
        });
        if (!response.ok) {
            if (response.status === 429) throw new Error('RATE_LIMITED');
            const text = await response.text().catch(() => '');
            throw new Error(`[${response.status}] ${text || 'Failed to send interview message'}`);
        }
        const s: any = await response.json();
        return {
            responseMessage: String(s.responseMessage ?? ''),
            audioUrl: s.audioUrl ? String(s.audioUrl) : null,
            completed: Boolean(s.completed ?? false),
            questionsAnswered: Number(s.questionsAnswered ?? 0),
            totalQuestions: Number(s.totalQuestions ?? 0),
        };
    }

    async getInterviewMessages(sessionId: number): Promise<InterviewMessageHistoryListResponse[]> {
        const response = await fetch(`${API_BASE_URL}/interview/messages/session/${sessionId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to retrieve interview messages');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Unexpected response format for message history');
        return (data as any[]).map((m) => ({
            id: m.id,
            sessionId,
            role: m.role === 'INTERVIEWER' ? 'INTERVIEWER' : 'CANDIDATE',
            content: String(m.content ?? ''),
            createdAt: String(m.createdAt ?? ''),
        }));
    }

    async uploadDocument(file: File, userId?: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId || '');
        const response = await fetch(`${API_BASE_URL}/documents/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(text || 'Upload failed');
        }
        return response.text();
    }

    async translateDocument(file: File): Promise<Record<string, string>> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE_URL}/translate/extract`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(text || 'Translation failed');
        }
        return response.json();
    }
}

export const api = new ApiService();