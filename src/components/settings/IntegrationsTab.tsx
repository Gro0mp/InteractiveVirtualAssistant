'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link2, Link2Off, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { SettingsSection } from './SettingsSection'
import { SettingsToggle } from './SettingsToggle'
import { api, type Integration } from '../../services/api'

// ── Static metadata for each provider ─────────────────────────────────────────

type ProviderMeta = {
    id: 'github' | 'google'
    name: string
    description: string
    category: string
    icon: string
}

const PROVIDERS: ProviderMeta[] = [
    {
        id: 'google',
        name: 'Google',
        description: 'Sign in with Google and sync your calendar for interview scheduling.',
        category: 'Auth & Calendar',
        icon: 'G',
    },
    {
        id: 'github',
        name: 'GitHub',
        description: 'Showcase your repositories and contributions. Required to let IVA scan your repos.',
        category: 'Profile & Code',
        icon: '⌥',
    },
]

// ── Component ──────────────────────────────────────────────────────────────────

export function IntegrationsTab() {
    const [integrations, setIntegrations] = useState<Integration[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    // Track per-provider loading state for connect/disconnect actions
    const [pendingProvider, setPendingProvider] = useState<string | null>(null)
    const [webhookEnabled, setWebhookEnabled] = useState(false)

    // ── Fetch integration status ───────────────────────────────────────────────

    const fetchIntegrations = useCallback(async () => {
        try {
            setError(null)
            const data = await api.getIntegrations()
            setIntegrations(data)
        } catch {
            setError('Failed to load integrations. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        void fetchIntegrations()
    }, [fetchIntegrations])

    // ── Connect — redirects through OAuth flow ─────────────────────────────────

    const handleConnect = (provider: 'github' | 'google') => {
        // Pass returnTo so OAuthCallback sends the user back here, not to /assistant
        api.connectIntegration(provider, '/settings?tab=integrations')
    }

    // ── Disconnect ─────────────────────────────────────────────────────────────

    const handleDisconnect = async (provider: 'github' | 'google') => {
        setPendingProvider(provider)
        try {
            await api.disconnectIntegration(provider)
            // Optimistically update UI, then re-fetch to confirm
            setIntegrations(prev =>
                prev.map(i => i.provider === provider ? { ...i, connected: false, scope: null } : i)
            )
        } catch (err) {
            if (err instanceof Error && err.message === 'LAST_LOGIN_METHOD') {
                setError(
                    `Cannot disconnect ${provider} — it's your only login method. ` +
                    `Set a password first under Privacy & Security.`
                )
            } else {
                setError(`Failed to disconnect ${provider}. Please try again.`)
            }
            // Re-fetch to get accurate state
            void fetchIntegrations()
        } finally {
            setPendingProvider(null)
        }
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    const getIntegration = (id: string): Integration | undefined =>
        integrations.find(i => i.provider === id)

    const connectedCount = integrations.filter(i => i.connected).length

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Error banner */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400"
                >
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span className="text-[11px] font-mono">{error}</span>
                    <button
                        type="button"
                        onClick={() => setError(null)}
                        className="ml-auto text-[9px] font-mono uppercase tracking-widest hover:text-red-900 dark:hover:text-red-200 transition-colors"
                    >
                        Dismiss
                    </button>
                </motion.div>
            )}

            {/* Connected Services */}
            <SettingsSection
                tag="01"
                title="Connected Services"
                accentCorner="tl"
                description={
                    isLoading
                        ? 'Loading…'
                        : `${connectedCount} of ${PROVIDERS.length} connected`
                }
            >
                {/* Refresh button */}
                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={() => { setIsLoading(true); void fetchIntegrations() }}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 uppercase tracking-widest transition-colors duration-150 disabled:opacity-40"
                    >
                        <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Integration cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800">
                    {PROVIDERS.map((provider, i) => {
                        const integration = getIntegration(provider.id)
                        const isConnected = integration?.connected ?? false
                        const isPending = pendingProvider === provider.id
                        const scope = integration?.scope ?? null

                        return (
                            <motion.div
                                key={provider.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.06 }}
                                className="bg-white dark:bg-neutral-950 p-4 flex items-start gap-4 group hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors duration-150"
                            >
                                {/* Icon */}
                                <div className={[
                                    'w-9 h-9 border flex items-center justify-center shrink-0 text-[13px] font-mono font-bold transition-colors duration-150',
                                    isLoading
                                        ? 'border-neutral-100 dark:border-neutral-900 text-neutral-300 dark:text-neutral-700 animate-pulse'
                                        : isConnected
                                            ? 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500 group-hover:border-neutral-300 dark:group-hover:border-neutral-700',
                                ].join(' ')}>
                                    {provider.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[12px] font-mono font-semibold text-neutral-900 dark:text-white">
                                            {provider.name}
                                        </span>
                                        {/* Live connected badge */}
                                        {!isLoading && isConnected && (
                                            <span className="inline-flex items-center gap-1 border border-emerald-200 dark:border-emerald-900 px-1.5 py-0.5">
                                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                                <span className="text-[8px] font-mono font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                                    Connected
                                                </span>
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-1">
                                        {provider.category}
                                    </p>
                                    <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-500 leading-relaxed">
                                        {provider.description}
                                    </p>

                                    {/* Scope pill — useful for showing if repo access is granted */}
                                    {isConnected && scope && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {scope.split(' ').map(s => (
                                                <span
                                                    key={s}
                                                    className="text-[8px] font-mono px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 uppercase tracking-widest"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Action button */}
                                <div className="shrink-0 pt-0.5">
                                    {isLoading ? (
                                        <span className="block w-14 h-3 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
                                    ) : isPending ? (
                                        <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest animate-pulse">
                                            …
                                        </span>
                                    ) : isConnected ? (
                                        <button
                                            type="button"
                                            onClick={() => void handleDisconnect(provider.id)}
                                            className="inline-flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 hover:text-red-500 dark:hover:text-red-400 uppercase tracking-widest transition-colors duration-150"
                                        >
                                            <Link2Off className="h-3 w-3" />
                                            Disconnect
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleConnect(provider.id)}
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
                            Payloads are signed with HMAC-SHA256.{' '}
                            <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5">
                                View docs <ExternalLink className="h-2.5 w-2.5" />
                            </button>
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