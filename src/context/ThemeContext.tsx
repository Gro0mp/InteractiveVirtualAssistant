'use client'

import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'

export type Theme = 'dark' | 'light'
export type ThemeMode = Theme | 'system'

interface ThemeContextValue {
    // Resolved runtime theme currently applied to the document.
    theme: Theme
    // User preference mode (light/dark/system).
    themeMode: ThemeMode
    setTheme: (theme: Theme) => void
    setThemeMode: (mode: ThemeMode) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    themeMode: 'system',
    setTheme: () => {},
    setThemeMode: () => {},
    toggleTheme: () => {},
})

function normalizeThemeMode(v: unknown): ThemeMode {
    if (v === 'light' || v === 'dark' || v === 'system') return v
    return 'system'
}

function applyThemeToRoot(theme: Theme) {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        try {
            const storedMode = localStorage.getItem('iva-theme-mode')
            if (storedMode) return normalizeThemeMode(storedMode)

            // Backward compatibility: if old key exists, use it as explicit mode.
            const legacyTheme = localStorage.getItem('iva-theme')
            return legacyTheme === 'light' || legacyTheme === 'dark' ? legacyTheme : 'system'
        } catch {
            return 'system'
        }
    })
    const [prefersDark, setPrefersDark] = useState<boolean>(() => {
        if (typeof window === 'undefined') return true
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    const theme: Theme = themeMode === 'system' ? (prefersDark ? 'dark' : 'light') : themeMode

    useEffect(() => {
        if (typeof window === 'undefined') return
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const update = () => setPrefersDark(mq.matches)
        update()

        // Support both modern and older browsers.
        if (typeof mq.addEventListener === 'function') {
            mq.addEventListener('change', update)
            return () => mq.removeEventListener('change', update)
        }
        mq.addListener(update)
        return () => mq.removeListener(update)
    }, [])

    // Apply ASAP to avoid a "flash" where the page paints light then flips dark.
    useLayoutEffect(() => {
        applyThemeToRoot(theme)
    }, [theme])

    useEffect(() => {
        try {
            localStorage.setItem('iva-theme-mode', themeMode)
            // Keep resolved theme key for compatibility with older readers.
            localStorage.setItem('iva-theme', theme)
        } catch {
            // ignore
        }
    }, [theme, themeMode])

    const value = useMemo<ThemeContextValue>(() => ({
        theme,
        themeMode,
        setTheme: (nextTheme) => setThemeMode(nextTheme),
        setThemeMode,
        toggleTheme: () => setThemeMode(theme === 'dark' ? 'light' : 'dark'),
    }), [theme, themeMode])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)