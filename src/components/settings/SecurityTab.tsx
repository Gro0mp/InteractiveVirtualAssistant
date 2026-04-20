import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { SettingsSection } from './SettingsSection'
import { SettingsToggle } from './SettingsToggle'
import { SettingsRow } from './SettingsRow'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export function SecurityTab() {
    const router = useRouter()
    const { logout } = useAuth()

    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [twoFactor, setTwoFactor] = useState(false)
    const [loginAlerts, setLoginAlerts] = useState(true)
    const [activityLog, setActivityLog] = useState(true)
    const [dataSharing, setDataSharing] = useState(false)
    const [analytics, setAnalytics] = useState(true)

    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
    const [pwSaved, setPwSaved] = useState(false)

    const [isDeletingAccount, setIsDeletingAccount] = useState(false)
    const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null)

    const handlePasswordSave = () => {
        setPwSaved(true)
        setTimeout(() => setPwSaved(false), 2500)
        setPasswords({ current: '', new: '', confirm: '' })
    }

    const handleDeleteAccount = async () => {
        setDeleteAccountError(null)

        const confirmed = window.confirm(
            'Delete your account permanently? This will remove your profile and all associated data.'
        )
        if (!confirmed) return

        setIsDeletingAccount(true)
        try {
            await api.deleteAccount()
            logout()
            router.replace('/login?accountDeleted=1')
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete account. Please try again.'
            setDeleteAccountError(message)
        } finally {
            setIsDeletingAccount(false)
        }
    }

    const newStrength = passwords.new.length === 0 ? null
        : passwords.new.length < 8 ? 'weak'
            : passwords.new.length < 12 ? 'fair'
                : 'strong'

    const strengthConfig = {
        weak: { label: 'Weak', color: 'bg-red-500', text: 'text-red-500', pct: '33%' },
        fair: { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500', pct: '66%' },
        strong: { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500', pct: '100%' },
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Password */}
            <SettingsSection tag="01" title="Password" accentCorner="tl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Input
                            label="Current password"
                            name="current"
                            type={showCurrent ? 'text' : 'password'}
                            value={passwords.current}
                            onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(v => !v)}
                            className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                        >
                            {showCurrent ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                    </div>
                    <div className="relative">
                        <Input
                            label="New password"
                            name="new"
                            type={showNew ? 'text' : 'password'}
                            value={passwords.new}
                            onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(v => !v)}
                            className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                        >
                            {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        {newStrength && (
                            <div className="mt-1.5">
                                <div className="h-px bg-neutral-100 dark:bg-neutral-800 relative">
                                    <div
                                        className={`absolute left-0 top-0 h-full transition-all duration-300 ${strengthConfig[newStrength].color}`}
                                        style={{ width: strengthConfig[newStrength].pct }}
                                    />
                                </div>
                                <p className={`mt-0.5 text-[9px] font-mono ${strengthConfig[newStrength].text}`}>
                                    {strengthConfig[newStrength].label}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <Input
                            label="Confirm new password"
                            name="confirm"
                            type={showConfirm ? 'text' : 'password'}
                            value={passwords.confirm}
                            onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                            placeholder="••••••••"
                            error={passwords.confirm && passwords.new !== passwords.confirm ? 'Passwords do not match' : undefined}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(v => !v)}
                            className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                        >
                            {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={handlePasswordSave}
                        disabled={!passwords.current || !passwords.new || passwords.new !== passwords.confirm}
                    >
                        {pwSaved ? 'Password updated!' : 'Update password'}
                    </Button>
                </div>
            </SettingsSection>

            {/* 2FA */}
            <SettingsSection tag="02" title="Two-Factor Authentication" accentCorner="tr">
                <div className="flex items-start gap-4 pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
                        <Shield className={`h-4 w-4 ${twoFactor ? 'text-emerald-500' : 'text-neutral-400'}`} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[12px] font-mono font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
                            Authenticator app
                        </p>
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
                            Use an app like Google Authenticator or Authy to generate one-time codes.
                        </p>
                    </div>
                    <div className="shrink-0">
                        {twoFactor ? (
                            <Button variant="outline" size="sm" onClick={() => setTwoFactor(false)}>Disable</Button>
                        ) : (
                            <Button variant="secondary" size="sm" onClick={() => setTwoFactor(true)}>Enable</Button>
                        )}
                    </div>
                </div>
                <SettingsToggle
                    id="login-alerts"
                    label="Login alerts"
                    description="Send an email when a new device signs in to your account."
                    checked={loginAlerts}
                    onChange={setLoginAlerts}
                />
                <SettingsToggle
                    id="activity-log"
                    label="Activity log"
                    description="Keep a log of all account actions for your review."
                    checked={activityLog}
                    onChange={setActivityLog}
                />
            </SettingsSection>

            {/* Privacy */}
            <SettingsSection tag="04" title="Privacy" accentCorner="tl">
                <SettingsToggle
                    id="data-sharing"
                    label="Usage data sharing"
                    description="Share anonymised usage data to help improve IVA's AI models."
                    checked={dataSharing}
                    onChange={setDataSharing}
                />
                <SettingsToggle
                    id="analytics"
                    label="Analytics cookies"
                    description="Allow analytics cookies to measure how you use the product."
                    checked={analytics}
                    onChange={setAnalytics}
                />
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">Download my data</Button>
                    <Button variant="ghost" size="sm">View privacy policy</Button>
                </div>
            </SettingsSection>

            {/* Danger zone */}
            <SettingsSection tag="05" title="Danger Zone" danger>
                <SettingsRow
                    label="Delete account"
                    description="Permanently delete your account and all data. This cannot be undone."
                >
                    <Button
                        variant="outline"
                        size="sm"
                        isLoading={isDeletingAccount}
                        onClick={handleDeleteAccount}
                        className="border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:border-red-500 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                        {isDeletingAccount ? 'Deleting…' : 'Delete account'}
                    </Button>
                </SettingsRow>

                {deleteAccountError && (
                    <p className="mt-3 text-[11px] font-mono text-red-500 border border-red-200 dark:border-red-900/70 bg-red-50/60 dark:bg-red-950/30 px-3 py-2 rounded-sm">
                        {deleteAccountError}
                    </p>
                )}
            </SettingsSection>
        </motion.div>
    )
}