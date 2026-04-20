'use client'

import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {SetupPanel, type SetupState} from '../components/account-setup/SetupPanel'
import {SetupVisual} from '../components/account-setup/SetupVisual'
import {api} from '../services/api'
import {useAuth} from '../context/AuthContext'
import {useTheme} from '../context/ThemeContext'

const DEFAULT_STATE: SetupState = {
    profile: {
        firstName: '',
        lastName: '',
        jobTitle: '',
        company: '',
    },
    goals: {
        goals: [],
        experienceLevel: null,
    },
    preferences: {
        emailNotifications: true,
        weeklyDigest: true,
        interviewReminders: true,
        theme: 'system',
    },
}

export function AccountSetupPage() {
    const router = useRouter()
    const {user, isLoading, refreshUser} = useAuth()
    const {setTheme} = useTheme()

    const [step, setStep] = useState(1)
    const [state, setState] = useState<SetupState>(DEFAULT_STATE)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    // If the user has already completed setup (e.g. they navigated here manually),
    // send them straight to the assistant.
    useEffect(() => {
        if (!isLoading && user?.setUpComplete) {
            router.replace('/assistant')
        }
    }, [user, isLoading, router])

    useEffect(() => {
        const selected = state.preferences.theme
        if (selected === 'light' || selected === 'dark') {
            setTheme(selected)
            return
        }
        if (typeof window !== 'undefined') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        }
    }, [state.preferences.theme, setTheme])

    const handleNext = async () => {
        if (step < 4) {
            setStep((s) => s + 1)
            return
        }

        // Step 4 → submit
        setSubmitError(null)
        setIsSubmitting(true)
        try {
            await api.completeAccountSetup({
                firstName: state.profile.firstName,
                lastName: state.profile.lastName,
                jobTitle: state.profile.jobTitle,
                company: state.profile.company,
                experienceLevel: state.goals.experienceLevel ?? '',
                goals: state.goals.goals.join(','),
                theme: state.preferences.theme,
                emailNotifications: state.preferences.emailNotifications,
                weeklyDigest: state.preferences.weeklyDigest,
                interviewReminders: state.preferences.interviewReminders,
            })

            // Refresh the cached user so setUpComplete flips to true everywhere
            await refreshUser()

            router.replace('/assistant')
        } catch (err) {
            console.error('Account setup failed:', err)
            setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => setStep((s) => Math.max(1, s - 1))

    return (
        <div className="w-full overflow-x-hidden">
            <div
                className="relative w-full h-[calc(100vh-3.5rem)] font-mono overflow-x-hidden overflow-y-hidden bg-neutral-50 dark:bg-[#0A0A0A]">
                {/* Grid texture */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.025] pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                >
                    <defs>
                        <pattern id="account-setup-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        fill="url(#account-setup-grid)"
                        className="text-neutral-900 dark:text-white"
                    />
                </svg>

                {/* Blue ambient glow */}
                <div
                    className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-96 bg-blue-400/6 dark:bg-blue-600/10 blur-[120px] pointer-events-none"
                    aria-hidden
                />

                {/* Section label */}
                <div className="absolute top-5 left-6 flex items-center gap-2 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/>
                    <span
                        className="text-[9px] font-semibold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                        Account Setup — IVA
                    </span>
                </div>

                {/* Error banner */}
                {submitError && (
                    <div
                        className="absolute top-12 left-1/2 -translate-x-1/2 z-20 px-4 py-2 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
                        <p className="text-[10px] font-mono text-red-600 dark:text-red-400">{submitError}</p>
                    </div>
                )}

                <div className="h-full w-full px-4 sm:px-6 lg:px-8 pt-12 pb-4">
                    <div className="mx-auto max-w-[1400px] h-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4">
                        {/* Left — decorative visual */}
                        <div className="min-h-0 hidden lg:block">
                            <SetupVisual step={step}/>
                        </div>

                        {/* Right — form panel */}
                        <div className="min-h-0">
                            <SetupPanel
                                step={step}
                                state={state}
                                onStateChange={setState}
                                onNext={handleNext}
                                onBack={handleBack}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}