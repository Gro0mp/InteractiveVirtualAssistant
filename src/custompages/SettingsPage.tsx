import React, { useState } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { User, Bell, Blocks, CreditCard, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProfileSettings } from '../components/settings/ProfileSettings'
import { NotificationSettings } from '../components/settings/NotificationSettings'
import { IntegrationSettings } from '../components/settings/IntegrationSettings'
import { BillingSettings } from '../components/settings/BillingSettings'
import { SecuritySettings } from '../components/settings/SecuritySettings'
import {useAuth} from "../context/AuthContext.tsx";
const tabs = [
    {
        id: 'profile',
        label: 'Profile',
        icon: User,
        component: ProfileSettings,
    },
    {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        component: NotificationSettings,
    },
    {
        id: 'integrations',
        label: 'Integrations',
        icon: Blocks,
        component: IntegrationSettings,
    },
    {
        id: 'billing',
        label: 'Billing',
        icon: CreditCard,
        component: BillingSettings,
    },
    {
        id: 'security',
        label: 'Security',
        icon: Shield,
        component: SecuritySettings,
    },
]
export function SettingsPage() {

    const { user } = useAuth()

    const [activeTab, setActiveTab] = useState('profile')
    const ActiveComponent =
        tabs.find((t) => t.id === activeTab)?.component || ProfileSettings
    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Settings
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation for Settings */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                    >
                                        <tab.icon
                                            className={`w-5 h-5 ${isActive ? 'text-violet-600' : 'text-slate-400'}`}
                                        />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -10,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                            >
                                <ActiveComponent username={user?.username} email={user?.email}/>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
