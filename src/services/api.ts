// API service for backend communication
const API_BASE_URL = 'http://localhost:8080/api/v1';

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
        const response = await fetch('http://localhost:8080/logout', {
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
        if (userId && userId.trim().length > 0) {
            formData.append('userId', userId);
        }

        const response = await fetch(`${API_BASE_URL}/documents/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(text || 'Upload failed');
        }

        // Controller returns ResponseEntity<String>
        return response.text();
    }

}

export const api = new ApiService();
