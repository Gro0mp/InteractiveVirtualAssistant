// API service for backend communication
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

// Reuse the app-wide User type from AuthContext to avoid mismatches.
import type { User } from '../context/AuthContext';

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

// Backend appears to return user fields directly. Keep message optional for compatibility.
export type AuthResponse = User & {
    message?: string;
};

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
        const res = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'GET',
            credentials: 'include' // send session cookie
        });
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
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

}

export const api = new ApiService();
