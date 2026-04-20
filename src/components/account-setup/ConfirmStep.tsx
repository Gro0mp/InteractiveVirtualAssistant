'use client'

import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { ProfileValue } from './ProfileStep'
import type { GoalsValue } from './GoalsStep'
import type { PreferencesValue } from './PreferencesStep'

type Props = {
    profile: ProfileValue
    goals: GoalsValue
    preferences: PreferencesValue
}

const GOAL_LABELS: Record<string, string> = {
    interview_prep: 'Interview Prep',
    resume_review:  'Resume Review',
    career_switch:  'Career Switch',
    salary_nego:    'Salary Negotiation',
    skill_gap:      'Skill Gap Analysis',
    job_search:     'Job Search',
}

type RowProps = { label: string; value: string }
function Row({ label, value }: RowProps) {
    return (
        <div className="flex items-baseline justify-between gap-4 py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
            <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest shrink-0">
                {label}
            </span>
            <span className="text-[10px] font-mono text-neutral-700 dark:text-neutral-300 text-right truncate">
                {value}
            </span>
        </div>
    )
}

export function ConfirmStep({ profile, goals, preferences }: Props) {
    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || '—'
    const jobLine  = [profile.jobTitle, profile.company].filter(Boolean).join(' @ ') || '—'
    const goalList = goals.goals.map((g) => GOAL_LABELS[g] ?? g).join(', ') || '—'
    const expLevel = goals.experienceLevel ?? '—'
    const themeStr = preferences.theme.charAt(0).toUpperCase() + preferences.theme.slice(1)
    const notifs   = [
        preferences.emailNotifications   && 'Email',
        preferences.weeklyDigest         && 'Digest',
        preferences.interviewReminders   && 'Reminders',
    ].filter(Boolean).join(', ') || 'None'

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-7 h-7 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600" />
                </div>
                <div>
                    <p className="text-[10px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">
                        Review
                    </p>
                    <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">
                        Confirm your details before finishing
                    </p>
                </div>
            </div>

            {/* Summary blocks */}
            {[
                {
                    title: 'Profile',
                    rows: [
                        { label: 'Name',       value: fullName  },
                        { label: 'Role',       value: jobLine   },
                    ],
                },
                {
                    title: 'Goals',
                    rows: [
                        { label: 'Focus areas',  value: goalList  },
                        { label: 'Experience',   value: expLevel  },
                    ],
                },
                {
                    title: 'Preferences',
                    rows: [
                        { label: 'Theme',         value: themeStr },
                        { label: 'Notifications', value: notifs   },
                    ],
                },
            ].map((section) => (
                <div key={section.title} className="border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                            {section.title}
                        </span>
                    </div>
                    <div className="px-4">
                        {section.rows.map((r) => (
                            <Row key={r.label} label={r.label} value={r.value} />
                        ))}
                    </div>
                </div>
            ))}

            {/* Ready note */}
            <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Everything looks good — ready to launch
                </span>
            </div>
        </div>
    )
}