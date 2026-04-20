'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { StepIndicator } from './StepIndicator'
import { ProfileStep, type ProfileValue } from './ProfileStep'
import { GoalsStep, type GoalsValue } from './GoalsStep'
import { PreferencesStep, type PreferencesValue } from './PreferencesStep'
import { ConfirmStep } from './ConfirmStep'

export type SetupState = {
    profile: ProfileValue
    goals: GoalsValue
    preferences: PreferencesValue
}

type Props = {
    step: number
    state: SetupState
    onStateChange: (next: SetupState) => void
    onNext: () => void
    onBack: () => void
    isSubmitting?: boolean
}

const STEPS = [
    { number: 1, label: 'Profile'     },
    { number: 2, label: 'Goals'       },
    { number: 3, label: 'Preferences' },
    { number: 4, label: 'Review'      },
]

function canAdvance(step: number, state: SetupState): boolean {
    if (step === 1) return Boolean(state.profile.firstName.trim() && state.profile.lastName.trim())
    if (step === 2) return state.goals.goals.length > 0 && state.goals.experienceLevel !== null
    return true
}

export function SetupPanel({ step, state, onStateChange, onNext, onBack, isSubmitting }: Props) {
    const ready = canAdvance(step, state)
    const isLast = step === 4

    return (
        <div className="h-full flex flex-col bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors duration-300 relative">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute top-0 left-0 h-8 w-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 right-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 right-0 h-8 w-px bg-blue-500" aria-hidden />

            {/* Terminal header */}
            <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="ml-1 text-[9px] font-mono text-neutral-400 dark:text-neutral-600 tracking-widest uppercase">
                        Account Setup
                    </span>
                </div>
                <div className="pl-8">
                    <StepIndicator steps={STEPS} currentStep={step} />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 p-5 overflow-y-auto">
                {step === 1 && (
                    <ProfileStep
                        value={state.profile}
                        onChange={(profile) => onStateChange({ ...state, profile })}
                    />
                )}
                {step === 2 && (
                    <GoalsStep
                        value={state.goals}
                        onChange={(goals) => onStateChange({ ...state, goals })}
                    />
                )}
                {step === 3 && (
                    <PreferencesStep
                        value={state.preferences}
                        onChange={(preferences) => onStateChange({ ...state, preferences })}
                    />
                )}
                {step === 4 && (
                    <ConfirmStep
                        profile={state.profile}
                        goals={state.goals}
                        preferences={state.preferences}
                    />
                )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 px-5 py-4 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between gap-3">
                {step > 1 ? (
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors uppercase tracking-wider"
                    >
                        <ChevronLeft className="h-3 w-3" />
                        Back
                    </button>
                ) : (
                    <div />
                )}

                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                        {ready ? (
                            <span className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                {isLast ? 'Ready' : 'Continue'}
                            </span>
                        ) : (
                            'Fill in required fields'
                        )}
                    </span>

                    <button
                        type="button"
                        disabled={!ready || Boolean(isSubmitting)}
                        onClick={onNext}
                        className={[
                            'inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono font-semibold uppercase tracking-widest border transition-colors duration-150',
                            ready && !isSubmitting
                                ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700 hover:border-blue-600'
                                : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed',
                        ].join(' ')}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                Saving…
                            </>
                        ) : isLast ? (
                            'Finish Setup'
                        ) : (
                            'Continue'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}