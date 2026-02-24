// src/components/DashboardLayout.tsx
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    Sparkles,
    Search,
    Bell,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {useAuth} from "../context/AuthContext.tsx";

interface DashboardLayoutProps {
    children: React.ReactNode
}

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: CheckSquare, label: 'Tasks', path: '/dashboard/tasks' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { user, logout } = useAuth();
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Overlay \- only when sidebar is open */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/50 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar \- now collapsible on all breakpoints */}
            <motion.aside
                className={[
                    'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200',
                    'transform transition-transform duration-300 ease-in-out',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                ].join(' ')}
            >
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-slate-100">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">IVA</span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    <item.icon
                                        className={`w-5 h-5 mr-3 ${isActive ? 'text-violet-600' : 'text-slate-400'}`}
                                    />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <div className="flex items-center p-3 mb-3 rounded-lg bg-slate-50">
                            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-semibold">
                                {user?.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-slate-900 truncate">{user?.username}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                logout()
                                setIsSidebarOpen(false)
                                navigate('/login', { replace: true })
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="cursor-pointer p-2 -ml-4 mr-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                            aria-label="Open sidebar"
                        >
                            <Menu className="w-6 h-6"/>
                        </button>

                        <div className="hidden sm:flex items-center max-w-md w-full">
                            <div className="relative w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-400"/>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search tasks, messages..."
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative">
                        <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    )
}
