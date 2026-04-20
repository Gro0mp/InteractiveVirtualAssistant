'use client'

import React from 'react'
import { User } from 'lucide-react'

export type ProfileValue = {
    firstName: string
    lastName: string
    jobTitle: string
    company: string
}

type Props = {
    value: ProfileValue
    onChange: (val: ProfileValue) => void
}

const FIELD_DEFS: {
    key: keyof ProfileValue
    label: string
    placeholder: string
    required?: boolean
}[] = [
    { key: 'firstName', label: '01 — First name', placeholder: 'Jane', required: true },
    { key: 'lastName',  label: '02 — Last name',  placeholder: 'Doe',  required: true },
    { key: 'jobTitle',  label: '03 — Job title',  placeholder: 'Software Engineer' },
    { key: 'company',   label: '04 — Company',    placeholder: 'Acme Corp' },
]

export function ProfileStep({ value, onChange }: Props) {
    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-7 h-7 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600" />
                </div>
                <div>
                    <p className="text-[10px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">
                        Profile
                    </p>
                    <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">
                        Tell us a bit about yourself
                    </p>
                </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FIELD_DEFS.map((field) => (
                    <div key={field.key} className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-blue-500" />
                            {field.label}
                            {field.required && (
                                <span className="text-blue-500 ml-0.5">*</span>
                            )}
                        </label>
                        <input
                            type="text"
                            value={value[field.key]}
                            placeholder={field.placeholder}
                            onChange={(e) => onChange({ ...value, [field.key]: e.target.value })}
                            className="w-full bg-transparent border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-blue-500 dark:focus:border-blue-500 px-3 py-2 text-[12px] font-mono text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 outline-none transition-colors duration-150"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}