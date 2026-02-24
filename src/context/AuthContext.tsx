import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface User {
    id: number;
    username: string;
    email: string;
    last_login?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isPremium?: boolean; // Optional, can be set based on user data
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on mount:
    // 1) prefer localStorage (fast)
    // 2) otherwise ask backend (/users/me) which works for OAuth + traditional sessions
    useEffect(() => {
        let cancelled = false;

        const restore = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const parsed = JSON.parse(storedUser) as User;
                        if (!cancelled) setUser(parsed);
                        return;
                    } catch (error) {
                        console.error('Failed to parse stored user:', error);
                        localStorage.removeItem('user');
                    }
                }

                // If no local user, try backend session cookie
                const me = await api.getCurrentUser();
                if (!cancelled) {
                    setUser(me);
                    localStorage.setItem('user', JSON.stringify(me));
                }
            } catch {
                // Not authenticated (or network error) => keep user null
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        restore();
        return () => {
            cancelled = true;
        };
    }, []);

    const login = (user: User) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setIsLoading(false);
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
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            isLoading,
            login,
            logout,
            refreshUser,
        }}>
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
