import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    CreditCard,
    ShieldCheck,
    Plug,
    Bell,
    Palette,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import { ProfileTab }       from '../components/settings/ProfileTab'
import { BillingTab }       from '../components/settings/BillingTab'
import { SecurityTab }      from '../components/settings/SecurityTab'
import { IntegrationsTab }  from '../components/settings/IntegrationsTab'
import { NotificationsTab } from '../components/settings/NotificationsTab'
import { AppearanceTab }    from '../components/settings/AppearanceTab'
import { useAuth }          from '../context/AuthContext'

type TabId = 'profile' | 'billing' | 'security' | 'integrations' | 'notifications' | 'appearance'

const TABS: {
    id: TabId
    label: string
    icon: LucideIcon
    description: string
    tag: string
}[] = [
    { id: 'profile',       label: 'Profile',                icon: User,        description: 'Personal info & career focus',    tag: '01' },
    { id: 'billing',       label: 'Billing',                icon: CreditCard,  description: 'Plan, payments & invoices',        tag: '02' },
    { id: 'security',      label: 'Privacy & Security',     icon: ShieldCheck, description: 'Password, 2FA & sessions',         tag: '03' },
    { id: 'integrations',  label: 'Integrations',           icon: Plug,        description: 'Connected services & API',         tag: '04' },
    { id: 'notifications', label: 'Notifications',          icon: Bell,        description: 'Alerts, digests & quiet hours',    tag: '05' },
    { id: 'appearance',    label: 'Appearance',             icon: Palette,     description: 'Theme, density & accessibility',   tag: '06' },
]

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>('profile')
    const { user } = useAuth()

    const activeTabMeta = TABS.find(t => t.id === activeTab)!

    const renderTab = () => {
        switch (activeTab) {
            case 'profile':       return <ProfileTab user={{ username: user?.username ?? '', email: user?.email ?? '' }} />
            case 'billing':       return <BillingTab currentPlan={user?.plan} />
            case 'security':      return <SecurityTab />
            case 'integrations':  return <IntegrationsTab />
            case 'notifications': return <NotificationsTab />
            case 'appearance':    return <AppearanceTab />
        }
    }

    return (
        <DashboardLayout>
            <div className="relative min-h-full font-mono">
                {/* Grid texture */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <defs>
                        <pattern id="settings-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#settings-grid)" className="text-neutral-900 dark:text-white" />
                </svg>

                {/* Blue ambient glow */}
                <div className="absolute top-0 left-1/3 w-[400px] h-48 bg-blue-400/5 dark:bg-blue-600/8 blur-[100px] pointer-events-none" aria-hidden />

                <div className="relative pb-8">
                    {/* Page header */}
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-end justify-between gap-4 pt-1 pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800"
                    >
                        <div>
                            <p className="text-[9px] font-mono font-medium text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-1">
                                Account
                            </p>
                            <h1
                                className="text-xl font-semibold text-neutral-900 dark:text-white tracking-tight"
                                style={{ fontFamily: "'DM Mono', monospace" }}
                            >
                                Settings
                            </h1>
                        </div>
                        {user && (
                            <div className="flex items-center gap-2 pb-0.5">
                                <div className="w-6 h-6 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
                                    <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                                    {user.username}
                                </span>
                            </div>
                        )}
                    </motion.div>

                    {/* Two-column layout: sidebar nav + content */}
                    <div className="flex gap-4 items-start">
                        {/* Sidebar tab nav */}
                        <motion.nav
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.35 }}
                            className="w-52 shrink-0 sticky top-4"
                            aria-label="Settings navigation"
                        >
                            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden relative">
                                {/* Corner accent */}
                                <span className="absolute top-0 left-0 w-8 h-px bg-blue-500" aria-hidden />
                                <span className="absolute top-0 left-0 h-8 w-px bg-blue-500" aria-hidden />

                                {/* Nav header */}
                                <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                    </div>
                                    <span className="text-[9px] font-mono font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                                        Settings
                                    </span>
                                </div>

                                {/* Tab list */}
                                <div className="py-1">
                                    {TABS.map((tab) => {
                                        const isActive = tab.id === activeTab
                                        const Icon = tab.icon
                                        return (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setActiveTab(tab.id)}
                                                className={[
                                                    'w-full flex items-center gap-3 px-4 py-2.5 text-left border-l-2 transition-all duration-150 group',
                                                    isActive
                                                        ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-700 dark:text-blue-400'
                                                        : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white',
                                                ].join(' ')}
                                                aria-current={isActive ? 'page' : undefined}
                                            >
                                                <Icon className={[
                                                    'h-3.5 w-3.5 shrink-0 transition-colors',
                                                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400',
                                                ].join(' ')} strokeWidth={1.75} />
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-mono font-semibold truncate">
                                                        {tab.label}
                                                    </p>
                                                </div>
                                                <span className="ml-auto text-[9px] font-mono text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400 dark:group-hover:text-neutral-600 transition-colors shrink-0">
                                                    {tab.tag}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Footer */}
                                <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                                    <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                                        IVA v2.0.1
                                    </p>
                                </div>
                            </div>
                        </motion.nav>

                        {/* Content area */}
                        <div className="flex-1 min-w-0">
                            {/* Breadcrumb / active tab label */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.25 }}
                                className="flex items-center gap-2 mb-4"
                            >
                                <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">Settings</span>
                                <span className="text-[9px] font-mono text-neutral-300 dark:text-neutral-700">/</span>
                                <span className="text-[9px] font-mono font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-widest">
                                    {activeTabMeta.label}
                                </span>
                                <span className="ml-1 text-[9px] font-mono text-neutral-400 dark:text-neutral-600">
                                    — {activeTabMeta.description}
                                </span>
                            </motion.div>

                            {/* Tab content with cross-fade */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderTab()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}