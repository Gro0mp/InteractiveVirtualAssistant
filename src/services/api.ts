// API service for backend communication
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export interface User {
    id: number;
    username: string;
    email: string;
    plan?: 'free' | 'basic' | 'premium';
    last_login?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    last_login?: string; // Optional, backend may set this automatically
}

export interface SignUpRequest {
    username: string;
    email: string;
    password: string;
    last_login?: string; // Optional, backend may set this automatically
}

export interface Message {
    userId: string;
    role: 'user' | 'assistant';
    content: string;
    audioData?: string; // Base64-encoded TTS audio, optional
    createdAt?: number;
}

/**
 * Matches the Chat entity returned by ChatController.receiveMessage.
 * Fields come directly from Chat.java: message, response, audioData, timestamp.
 */
export interface ChatResponse {
    id: number;
    message: string;       // The user's original message
    response: string;      // The assistant's reply
    audioData?: string;    // Base64 TTS audio, may be null if TTS failed
    timestamp: string;
}

export interface InterviewSession {
    id: number
    description: string
    createdAt: string
    updatedAt: string
    messages: number
    status: 'IN_PROGRESS' | 'COMPLETED' | string
}

export interface InterviewMessage {
    id: number
    sessionId: number
    role: 'INTERVIEWER' | 'CANDIDATE'
    content: string
    createdAt: string
}

// Backend appears to return user fields directly. Keep message optional for compatibility.
export type AuthResponse = User & {
    message?: string;
};

export type PaymentResponse = {
    message?: string
    success?: boolean
    sessionId?: string

}

export interface ErrorResponse {
    error?: string;
    message?: string;
}

class ApiService {
    // Login user
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include',
        });

        if (!response.ok) {
            const error: ErrorResponse = await response.json();
            throw new Error(error.error || error.message || 'Login failed');
        }

        return response.json();
    }

    // Create new user
    async signUp(userData: SignUpRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/users/create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Sign up failed');
        }

        return response.json();
    }

    async getMessageHistory(id: number): Promise<ChatResponse[]> {
        const response = await fetch(`${API_BASE_URL}/chat/user/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to fetch message history');
        }

        return response.json(); // returns ChatResponse[] directly
    }

    async processMessage(userMessage: Message): Promise<ChatResponse> {
        const response = await fetch(`${API_BASE_URL}/chat/receive-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userMessage.userId,
                content: userMessage.content,
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`processMessage failed [${response.status}]: ${text}`);
        }

        return response.json();
    }

    async getCurrentUser(): Promise< User > {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'GET',
            credentials: 'include' // send session cookie
        });
        if (!response.ok) throw new Error('Not authenticated');
        return response.json();
    }

    // Get user by ID
    async getUserById(id: number): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        return response.json();
    }

    async logout(): Promise<void> {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        // Spring commonly 302 redirects on logoutSuccessUrl; treat ok or redirect as success.
        if (!(response.ok || response.redirected)) {
            const text = await response.text().catch(() => '');
            throw new Error(text || 'Logout failed');
        }
    }
    // Upload a document (multipart/form-data) to /api/v1/documents/upload
    async uploadDocument(file: File, userId?: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId || ''); // Ensure userId is sent as a string, even if undefined
        console.log("Uploading document with userId:", userId);

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

        return response.json(); // now returns { "Hello": "(10,20), (100,20)...", ... }
    }


    // Interview session management
    async createInterviewSession(userId: number, jobDescription: string): Promise<InterviewSession> {
        const response = await fetch(`${API_BASE_URL}/interview/new-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, jobDescription }),
            credentials: 'include',
        })

        if (!response.ok) {
            // Backend returns JSON like { error: "..." } when 429 or 400.
            const text = await response.text().catch(() => '')
            // Surface a stable error code for limit exceeded so UI can branch.
            if (response.status === 429) throw new Error('LIMIT_EXCEEDED')
            throw new Error(text || 'Failed to create interview session')
        }

        const s: any = await response.json()
        return {
            id: s.id,
            description: String(s.description ?? ''),
            createdAt: String(s.created_at ?? ''),
            updatedAt: String(s.created_at ?? ''),
            messages: Number(s.totalMessages ?? 0),
            status: String(s.status ?? 'IN_PROGRESS'),
        }
    }

    async getInterviewSessions(userId: string): Promise<InterviewSession[]> {
        const response = await fetch(`${API_BASE_URL}/interview/get-sessions/${userId}`, {
            method: 'GET',
            credentials: 'include',
        })
        if (!response.ok) throw new Error('Failed to retrieve interview sessions')

        const data = await response.json()
        return (data as any[]).map((s: any) => ({
            id: s.id,
            description: String(s.description ?? ''),
            createdAt: String(s.created_at ?? ''),
            updatedAt: String(s.created_at ?? ''),
            messages: Number(s.totalMessages ?? 0),
            status: String(s.status ?? 'IN_PROGRESS'),
        }))
    }

    async deleteInterviewSession(sessionId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/interview/delete-session/${sessionId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        if (!response.ok) {
            const text = await response.text().catch(() => '')
            throw new Error(text || 'Failed to delete session')
        }
    }

    // Interview Session Message Management
    async getInterviewMessages(sessionId: string): Promise<InterviewMessage[]> {
        const response = await fetch(`${API_BASE_URL}/interview/get-messages/${sessionId}`, {
            method: 'GET',
            credentials: 'include',
        })
        if (!response.ok) throw new Error('Failed to retrieve interview messages')

        const data = await response.json()
        return (data as any[]).map((m: any) => ({
            id: m.id,
            sessionId: m.session_id,
            role: m.role === 'INTERVIEWER' ? 'INTERVIEWER' : 'CANDIDATE',
            content: String(m.content ?? ''),
            createdAt: String(m.created_at ?? ''),
        }))
    }
}

export const api = new ApiService();
