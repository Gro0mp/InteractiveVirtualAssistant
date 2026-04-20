'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { api, type User } from '../services/api'
import { wsClient } from '../services/ws'

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (user: User) => void
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const restore = async () => {
            // Fast path: restore from localStorage for instant render
            const stored = localStorage.getItem('user')
            if (stored) {
                try {
                    const parsed = JSON.parse(stored) as User
                    if (!cancelled) { setUser(parsed); setIsLoading(false) }
                } catch {
                    localStorage.removeItem('user')
                }
            }

            // Always verify with backend — session cookie is the source of truth
            try {
                const me = await api.getCurrentUser()
                if (!cancelled) {
                    setUser(me)
                    localStorage.setItem('user', JSON.stringify(me))
                }
            } catch {
                localStorage.removeItem('user')
                if (!cancelled) setUser(null)
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        void restore()
        return () => { cancelled = true }
    }, [])

    const login = (user: User) => {
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        setIsLoading(false)
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        wsClient.disconnect()
        // Call backend to invalidate the JSESSIONID session cookie.
        // Spring Security's logout endpoint is /logout (not /api/v1/logout).
        api.logout().catch(err => console.error('Server logout failed:', err))
    }

    const refreshUser = async () => {
        setIsLoading(true)
        try {
            const me = await api.getCurrentUser()
            setUser(me)
            localStorage.setItem('user', JSON.stringify(me))
        } finally {

        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}