import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, type User } from '../services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const restore = async () => {
            // Try restoring from localStorage first for a fast initial render
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser) as User;
                    if (!cancelled) {
                        setUser(parsed);
                        setIsLoading(false);
                    }
                } catch {
                    localStorage.removeItem('user');
                }
            }

            // Always verify with the backend — the session cookie is the source of truth
            try {
                const me = await api.getCurrentUser();
                if (!cancelled) {
                    setUser(me);
                    localStorage.setItem('user', JSON.stringify(me));
                }
            } catch {
                localStorage.removeItem('user');
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        void restore();
        return () => { cancelled = true; };
    }, []);

    const login = (user: User) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setIsLoading(false);
    };

    /**
     * FIX: was only clearing local state / localStorage, leaving the server-side
     * session cookie alive. The backend's /logout endpoint must be called so Spring
     * Security invalidates the session. We clear local state regardless of whether
     * the API call succeeds, so a network failure doesn't strand the user logged in
     * locally with a dead session.
     */
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setIsLoading(false);
        api.logout().catch((err) => console.error('Server logout failed:', err));
    };

    const refreshUser = async () => {
        setIsLoading(true);
        try {
            const me = await api.getCurrentUser();
            setUser(me);
            localStorage.setItem('user', JSON.stringify(me));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};