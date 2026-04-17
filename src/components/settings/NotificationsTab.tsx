import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { SettingsSection } from './SettingsSection'
import { SettingsToggle } from './SettingsToggle'
import { SettingsRow } from './SettingsRow'

type Channel = 'email' | 'push' | 'slack'

type NotifSetting = {
    id: string
    label: string
    description: string
    channels: Partial<Record<Channel, boolean>>
}

const INITIAL_NOTIFS: NotifSetting[] = [
    {
        id: 'session-complete',
        label: 'Session complete',
        description: 'When a mock interview session finishes and feedback is ready.',
        channels: { email: true, push: true, slack: false },
    },
    {
        id: 'weekly-report',
        label: 'Weekly progress report',
        description: 'A summary of your interview scores and skill improvements each week.',
        channels: { email: true, push: false, slack: false },
    },
    {
        id: 'job-match',
        label: 'New job match',
        description: 'When a new job listing matches your target role and skills.',
        channels: { email: true, push: true, slack: false },
    },
    {
        id: 'streak-reminder',
        label: 'Streak reminder',
        description: "A nudge when you haven't practiced in 2+ days.",
        channels: { email: false, push: true, slack: false },
    },
    {
        id: 'tip-of-day',
        label: 'Daily coaching tip',
        description: 'A single actionable interview tip delivered each morning.',
        channels: { email: true, push: false, slack: false },
    },
    {
        id: 'billing',
        label: 'Billing & receipts',
        description: 'Payment confirmations, plan changes, and renewal reminders.',
        channels: { email: true, push: false, slack: false },
    },
    {
        id: 'product-updates',
        label: 'Product updates',
        description: "New features, improvements, and what's coming to IVA.",
        channels: { email: true, push: false, slack: false },
    },
]

const CHANNELS: { key: Channel; label: string }[] = [
    { key: 'email', label: 'Email' },
    { key: 'push', label: 'Push' },
    { key: 'slack', label: 'Slack' },
]

export function NotificationsTab() {
    const [notifs, setNotifs] = useState(INITIAL_NOTIFS)
    const [digestMode, setDigestMode] = useState(false)
    const [quietHours, setQuietHours] = useState(true)
    const [saved, setSaved] = useState(false)

    const toggleChannel = (id: string, channel: Channel) => {
        setNotifs(prev => prev.map(n =>
            n.id === id
                ? { ...n, channels: { ...n.channels, [channel]: !n.channels[channel] } }
                : n
        ))
    }

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Notification matrix */}
            <SettingsSection tag="01" title="Notification Preferences" accentCorner="tl">
                {/* Column headers */}
                <div className="grid grid-cols-[1fr_4rem_4rem_4rem] gap-3 pb-2 mb-1 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-[9px] font-mono font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                        Event
                    </span>
                    {CHANNELS.map(ch => (
                        <span key={ch.key} className="text-[9px] font-mono font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest text-center">
                            {ch.label}
                        </span>
                    ))}
                </div>

                {notifs.map((n, i) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="grid grid-cols-[1fr_4rem_4rem_4rem] gap-3 items-center py-3.5 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0"
                    >
                        <div>
                            <p className="text-[12px] font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                                {n.label}
                            </p>
                            <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mt-0.5 leading-relaxed">
                                {n.description}
                            </p>
                        </div>
                        {CHANNELS.map(ch => (
                            <div key={ch.key} className="flex justify-center">
                                <button
                                    type="button"
                                    role="checkbox"
                                    aria-checked={!!n.channels[ch.key]}
                                    onClick={() => toggleChannel(n.id, ch.key)}
                                    className={[
                                        'w-4 h-4 border transition-colors duration-150 flex items-center justify-center',
                                        n.channels[ch.key]
                                            ? 'bg-blue-600 border-blue-500'
                                            : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600',
                                    ].join(' ')}
                                    aria-label={`${n.label} via ${ch.label}`}
                                >
                                    {n.channels[ch.key] && (
                                        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="none">
                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ))}
                    </motion.div>
                ))}
            </SettingsSection>

            {/* Delivery preferences */}
            <SettingsSection tag="02" title="Delivery Preferences" accentCorner="tr">
                <SettingsToggle
                    id="digest-mode"
                    label="Email digest"
                    description="Bundle all email notifications into a single daily summary instead of sending individually."
                    checked={digestMode}
                    onChange={setDigestMode}
                />
                <SettingsToggle
                    id="quiet-hours"
                    label="Quiet hours"
                    description="Suppress push notifications between 10 PM and 8 AM in your local time."
                    checked={quietHours}
                    onChange={setQuietHours}
                />
                {quietHours && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 grid grid-cols-2 gap-3"
                    >
                        <div>
                            <label className="block text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-1.5">
                                Start
                            </label>
                            <select className="w-full h-9 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-900 dark:text-white px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-sm appearance-none">
                                {['8 PM', '9 PM', '10 PM', '11 PM', '12 AM'].map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-1.5">
                                End
                            </label>
                            <select className="w-full h-9 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-900 dark:text-white px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-sm appearance-none">
                                {['6 AM', '7 AM', '8 AM', '9 AM', '10 AM'].map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </motion.div>
                )}
            </SettingsSection>

            {/* Save */}
            <div className="flex items-center justify-between px-5 py-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                    Preferences saved per device
                </p>
                <Button variant="secondary" size="md" onClick={handleSave}>
                    {saved ? 'Saved!' : 'Save preferences'}
                </Button>
            </div>
        </motion.div>
    )
}