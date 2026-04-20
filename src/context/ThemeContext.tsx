'use client'

import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    setTheme: () => {},
    toggleTheme: () => {},
})

function normalizeTheme(v: unknown): Theme {
    return v === 'light' ? 'light' : 'dark'
}

function applyThemeToRoot(theme: Theme) {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            return normalizeTheme(localStorage.getItem('iva-theme'))
        } catch {
            return 'dark'
        }
    })

    // Apply ASAP to avoid a "flash" where the page paints light then flips dark.
    useLayoutEffect(() => {
        applyThemeToRoot(theme)
    }, [theme])

    useEffect(() => {
        try {
            localStorage.setItem('iva-theme', theme)
        } catch {
            // ignore
        }
    }, [theme])

    const value = useMemo<ThemeContextValue>(() => ({
        theme,
        setTheme,
        toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    }), [theme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)