'use client'

import React from 'react'
import { Target } from 'lucide-react'

export type GoalsValue = {
    goals: string[]
    experienceLevel: 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | null
}

const GOAL_OPTIONS = [
    { key: 'interview_prep',   label: 'Interview Prep',      desc: 'Practice mock interviews' },
    { key: 'resume_review',    label: 'Resume Review',       desc: 'Improve my CV & cover letter' },
    { key: 'career_switch',    label: 'Career Switch',       desc: 'Transition to a new field' },
    { key: 'salary_nego',      label: 'Salary Negotiation',  desc: 'Negotiate better offers' },
    { key: 'skill_gap',        label: 'Skill Gap Analysis',  desc: 'Identify what to learn next' },
    { key: 'job_search',       label: 'Job Search',          desc: 'Find the right opportunities' },
]

const EXPERIENCE_OPTIONS: { key: GoalsValue['experienceLevel']; label: string; sub: string }[] = [
    { key: 'JUNIOR', label: 'Junior',   sub: '0 – 2 yrs' },
    { key: 'MID',    label: 'Mid',      sub: '2 – 5 yrs' },
    { key: 'SENIOR', label: 'Senior',   sub: '5 – 10 yrs' },
    { key: 'LEAD',   label: 'Lead',     sub: '10+ yrs' },
]

type Props = {
    value: GoalsValue
    onChange: (val: GoalsValue) => void
}

export function GoalsStep({ value, onChange }: Props) {
    const toggleGoal = (key: string) => {
        const next = value.goals.includes(key)
            ? value.goals.filter((g) => g !== key)
            : [...value.goals, key]
        onChange({ ...value, goals: next })
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-7 h-7 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
                    <Target className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600" />
                </div>
                <div>
                    <p className="text-[10px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">
                        Goals
                    </p>
                    <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">
                        Select all that apply — we'll personalise your experience
                    </p>
                </div>
            </div>

            {/* Goals grid */}
            <div>
                <p className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    01 — What are you working towards?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {GOAL_OPTIONS.map((opt) => {
                        const selected = value.goals.includes(opt.key)
                        return (
                            <button
                                key={opt.key}
                                type="button"
                                onClick={() => toggleGoal(opt.key)}
                                className={[
                                    'text-left px-3 py-2.5 border transition-colors duration-150',
                                    selected
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
                                ].join(' ')}
                            >
                                <p className="text-[10px] font-mono font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                                    {opt.label}
                                </p>
                                <p className="mt-0.5 text-[9px] font-mono text-neutral-400 dark:text-neutral-600">
                                    {opt.desc}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Experience level */}
            <div>
                <p className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    02 — Experience level
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {EXPERIENCE_OPTIONS.map((opt) => {
                        const selected = value.experienceLevel === opt.key
                        return (
                            <button
                                key={opt.key}
                                type="button"
                                onClick={() => onChange({ ...value, experienceLevel: opt.key })}
                                className={[
                                    'text-left px-3 py-2.5 border transition-colors duration-150',
                                    selected
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
                                ].join(' ')}
                            >
                                <p className="text-[10px] font-mono font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                                    {opt.label}
                                </p>
                                <p className="mt-0.5 text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                                    {opt.sub}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}