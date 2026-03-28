// src/components/DashboardLayout.tsx
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Calendar,
    MessageSquare,
    FileText,
    Settings,
    LogOut,
    Menu,
    Bell,
    User,
    Languages,
    Sun,
    Moon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from "../context/AuthContext.tsx"
import { useTheme, ThemeProvider } from "../context/ThemeContext.tsx"

interface DashboardLayoutProps {
    children: React.ReactNode
}

const navItems = [
    { icon: MessageSquare,   label: 'AI Assistant',  path: '/assistant' },
    { icon: LayoutDashboard, label: 'Mock Interview', path: '/interview' },
    { icon: Calendar,        label: 'Calendar',       path: '/calender'  },
    { icon: Languages,       label: 'Translate',      path: '/translate' },
    { icon: FileText,        label: 'Documents',      path: '/documents' },
    { icon: Settings,        label: 'Settings',       path: '/settings'  },
]

function DashboardLayoutInner({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <div
            className="min-h-screen bg-neutral-50 dark:bg-[#0A0A0A] flex transition-colors duration-300"
            style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
        >
            {/* Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-neutral-900/40 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={[
                    'fixed inset-y-0 left-0 z-50 w-60',
                    'bg-white dark:bg-neutral-950',
                    'border-r border-neutral-200 dark:border-neutral-800',
                    'transform transition-transform duration-300 ease-in-out',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                ].join(' ')}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-14 flex items-center px-5 border-b border-neutral-100 dark:border-neutral-800">
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 group"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <div className="w-6 h-6 border border-neutral-300 dark:border-neutral-700 group-hover:border-blue-500 dark:group-hover:border-blue-500 flex items-center justify-center transition-colors duration-150">
                                <img src="/logo.png" className="scale-[1.6]" alt="IVA logo" aria-hidden />
                            </div>
                            <span className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-widest">
                                IVA
                            </span>
                        </Link>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
                        <p className="px-3 pb-2 text-[9px] font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest font-mono">
                            Navigation
                        </p>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={[
                                        'flex items-center px-3 py-2 text-xs font-medium transition-colors duration-150 border-l-2',
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-500'
                                            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white border-transparent',
                                    ].join(' ')}
                                    style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
                                >
                                    <item.icon
                                        className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400 dark:text-neutral-600'}`}
                                        strokeWidth={1.75}
                                    />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User / sign out */}
                    <div className="p-3 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-3 px-3 py-2.5 mb-2 border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                            <div className="w-7 h-7 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 text-[10px] font-bold font-mono">
                                {user?.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                                    {user?.username}
                                </p>
                                <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                logout()
                                setIsSidebarOpen(false)
                                navigate('/login', { replace: true })
                            }}
                            className="w-full flex items-center px-3 py-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150"
                        >
                            <LogOut className="w-4 h-4 mr-3" strokeWidth={1.75} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="cursor-pointer p-1.5 -ml-1.5 mr-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                        aria-label="Open sidebar"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                        {/* Theme toggle — same pattern as Navbar.tsx */}
                        <button
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="w-8 h-8 flex items-center justify-center border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-150"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {theme === 'dark' ? (
                                    <motion.span
                                        key="sun"
                                        initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <Sun className="w-3.5 h-3.5" />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="moon"
                                        initial={{ opacity: 0, rotate: 30, scale: 0.8 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: -30, scale: 0.8 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <Moon className="w-3.5 h-3.5" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        <button
                            className="relative p-2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer"
                            aria-label="Notifications"
                        >
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full border-2 border-white dark:border-neutral-950" />
                        </button>

                        <button
                            className="p-2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer"
                            aria-label="Settings"
                        >
                            <Settings className="w-4 h-4" />
                        </button>

                        <button
                            className="p-2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer"
                            aria-label="Profile"
                        >
                            <User className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto h-full">{children}</div>
                </main>
            </div>
        </div>
    )
}

// Wraps with ThemeProvider so the dashboard has its own persistent theme context,
// mirroring the same pattern used in LandingPage.tsx
export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <ThemeProvider>
            <DashboardLayoutInner>{children}</DashboardLayoutInner>
        </ThemeProvider>
    )
}