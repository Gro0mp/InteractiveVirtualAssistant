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
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Sign up failed');
        }

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
}

export const api = new ApiService();
