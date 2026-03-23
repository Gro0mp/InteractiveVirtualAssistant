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
            const storedUser = localStorage.getItem('user'); // Try getting user from localStorage first
            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser) as User;
                    if (!cancelled) {
                        setUser(parsed);
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error('Failed to parse stored user:', error);
                    localStorage.removeItem('user');
                }
            }
            // If no valid user in localStorage, try fetching from backend
            try {
                const me = await api.getCurrentUser();
                if (!cancelled) {
                    setUser(me);
                    localStorage.setItem('user', JSON.stringify(me));
                }
            } catch {
                localStorage.removeItem('user');
                if (!cancelled) {
                    setUser(null);
                    setIsLoading(false);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        restore().then(r => (r));
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
