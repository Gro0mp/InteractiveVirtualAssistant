import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link2, Link2Off, ExternalLink } from 'lucide-react'
import { Button } from '../ui/Button'
import { SettingsSection } from './SettingsSection'
import { SettingsToggle } from './SettingsToggle'

type Integration = {
    id: string
    name: string
    description: string
    category: string
    connected: boolean
    connectedAs?: string
    badge?: string
    icon: string  // emoji / text icon for simplicity
}

const INTEGRATIONS: Integration[] = [
    {
        id: 'linkedin',
        name: 'LinkedIn',
        description: 'Import your profile, work history, and skills automatically.',
        category: 'Profile',
        connected: true,
        connectedAs: 'Dennis Wong',
        icon: 'in',
    },
    {
        id: 'google',
        name: 'Google',
        description: 'Sign in with Google and sync your calendar for interview scheduling.',
        category: 'Auth & Calendar',
        connected: true,
        connectedAs: 'dennis@gmail.com',
        icon: 'G',
    },
    {
        id: 'github',
        name: 'GitHub',
        description: 'Showcase your repositories and contributions in your profile.',
        category: 'Profile',
        connected: false,
        icon: '⌥',
    },
    {
        id: 'notion',
        name: 'Notion',
        description: 'Export interview notes and feedback directly to your Notion workspace.',
        category: 'Productivity',
        connected: false,
        badge: 'Beta',
        icon: 'N',
    },
    {
        id: 'slack',
        name: 'Slack',
        description: 'Receive interview reminders and coaching tips in your Slack channels.',
        category: 'Notifications',
        connected: false,
        icon: '#',
    },
    {
        id: 'calendly',
        name: 'Calendly',
        description: 'Let recruiters book real interview slots synced with your availability.',
        category: 'Scheduling',
        connected: false,
        badge: 'Coming soon',
        icon: '◎',
    },
]

const CATEGORIES = ['All', ...Array.from(new Set(INTEGRATIONS.map(i => i.category)))]

export function IntegrationsTab() {
    const [connections, setConnections] = useState<Record<string, boolean>>(
        Object.fromEntries(INTEGRATIONS.map(i => [i.id, i.connected]))
    )
    const [activeCategory, setActiveCategory] = useState('All')
    const [webhookEnabled, setWebhookEnabled] = useState(false)

    const toggle = (id: string) => setConnections(c => ({ ...c, [id]: !c[id] }))

    const filtered = activeCategory === 'All'
        ? INTEGRATIONS
        : INTEGRATIONS.filter(i => i.category === activeCategory)

    const connectedCount = Object.values(connections).filter(Boolean).length

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Summary */}
            <SettingsSection tag="01" title="Connected Services" accentCorner="tl"
                             description={`${connectedCount} of ${INTEGRATIONS.length} connected`}>

                {/* Category filter */}
                <div className="flex flex-wrap gap-px mb-5 border border-neutral-200 dark:border-neutral-800 w-fit">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setActiveCategory(cat)}
                            className={[
                                'px-3 py-1.5 text-[9px] font-mono font-semibold uppercase tracking-widest transition-colors duration-150',
                                activeCategory === cat
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900',
                            ].join(' ')}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Integration cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800">
                    {filtered.map((integration, i) => {
                        const isConnected = connections[integration.id]
                        const isComingSoon = integration.badge === 'Coming soon'
                        return (
                            <motion.div
                                key={integration.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.04 }}
                                className="bg-white dark:bg-neutral-950 p-4 flex items-start gap-4 group hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors duration-150"
                            >
                                {/* Icon */}
                                <div className={[
                                    'w-9 h-9 border flex items-center justify-center shrink-0 text-[13px] font-mono font-bold transition-colors duration-150',
                                    isConnected
                                        ? 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500 group-hover:border-neutral-300 dark:group-hover:border-neutral-700',
                                ].join(' ')}>
                                    {integration.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[12px] font-mono font-semibold text-neutral-900 dark:text-white">
                                            {integration.name}
                                        </span>
                                        {integration.badge && (
                                            <span className={[
                                                'inline-flex items-center gap-1 border px-1.5 py-0.5',
                                                isComingSoon
                                                    ? 'border-neutral-200 dark:border-neutral-800'
                                                    : 'border-blue-200 dark:border-blue-900',
                                            ].join(' ')}>
                                                {!isComingSoon && <span className="w-1 h-1 rounded-full bg-blue-500" />}
                                                <span className={[
                                                    'text-[8px] font-mono font-medium uppercase tracking-widest',
                                                    isComingSoon ? 'text-neutral-400 dark:text-neutral-600' : 'text-blue-600 dark:text-blue-400',
                                                ].join(' ')}>
                                                    {integration.badge}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-1">
                                        {integration.category}
                                    </p>
                                    <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-500 leading-relaxed">
                                        {integration.description}
                                    </p>
                                    {isConnected && integration.connectedAs && (
                                        <div className="mt-2 flex items-center gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">
                                                Connected as {integration.connectedAs}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="shrink-0">
                                    {isComingSoon ? (
                                        <span className="text-[9px] font-mono text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">
                                            Soon
                                        </span>
                                    ) : isConnected ? (
                                        <button
                                            type="button"
                                            onClick={() => toggle(integration.id)}
                                            className="inline-flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 hover:text-red-500 dark:hover:text-red-400 uppercase tracking-widest transition-colors duration-150"
                                        >
                                            <Link2Off className="h-3 w-3" />
                                            Disconnect
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => toggle(integration.id)}
                                            className="inline-flex items-center gap-1.5 text-[9px] font-mono text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 uppercase tracking-widest transition-colors duration-150"
                                        >
                                            <Link2 className="h-3 w-3" />
                                            Connect
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </SettingsSection>

            {/* Webhook */}
            <SettingsSection tag="02" title="Webhooks" description="For advanced users and developers" accentCorner="tr">
                <SettingsToggle
                    id="webhook-enabled"
                    label="Enable outbound webhooks"
                    description="Send POST requests to your endpoint when interview sessions complete."
                    checked={webhookEnabled}
                    onChange={setWebhookEnabled}
                    badge="Dev"
                />
                {webhookEnabled && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                    >
                        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest font-mono">
                            Webhook URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                placeholder="https://your-server.com/webhook"
                                className="flex-1 h-10 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-sm font-mono text-neutral-900 dark:text-white px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 rounded-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                            />
                            <Button variant="outline" size="md">Save</Button>
                        </div>
                        <p className="mt-2 text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
                            Payloads are signed with HMAC-SHA256. <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5">View docs <ExternalLink className="h-2.5 w-2.5" /></button>
                        </p>
                    </motion.div>
                )}
            </SettingsSection>

            {/* API access */}
            <SettingsSection tag="03" title="API Access" accentCorner="tl">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <p className="text-[11px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 mb-1">API key</p>
                        <div className="flex gap-2 items-center">
                            <code className="flex-1 h-10 flex items-center px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-400 dark:text-neutral-600 select-all">
                                iva_sk_••••••••••••••••••••••••••••••••
                            </code>
                            <Button variant="outline" size="sm">Reveal</Button>
                            <Button variant="ghost" size="sm">Rotate</Button>
                        </div>
                        <p className="mt-1.5 text-[9px] font-mono text-neutral-400 dark:text-neutral-600">
                            Available on Pro plan · <span className="text-amber-500">Upgrade to access</span>
                        </p>
                    </div>
                </div>
            </SettingsSection>
        </motion.div>
    )
}