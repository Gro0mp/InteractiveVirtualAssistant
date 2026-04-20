import React from 'react'

type Step = {
    number: number
    label: string
}

type Props = {
    steps: Step[]
    currentStep: number
}

export function StepIndicator({ steps, currentStep }: Props) {
    return (
        <div className="flex flex-wrap items-center gap-y-2">
            {steps.map((step, i) => {
                const isCompleted = step.number < currentStep
                const isActive = step.number === currentStep
                const isLast = i === steps.length - 1

                return (
                    <React.Fragment key={step.number}>
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Dot / number */}
                            <div
                                className={[
                                    'w-5 h-5 flex items-center justify-center text-[9px] font-mono font-semibold transition-colors duration-200',
                                    isCompleted
                                        ? 'bg-blue-500 text-white'
                                        : isActive
                                            ? 'border border-blue-500 text-blue-500'
                                            : 'border border-neutral-300 dark:border-neutral-700 text-neutral-400 dark:text-neutral-600',
                                ].join(' ')}
                            >
                                {isCompleted ? (
                                    <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <span>{step.number}</span>
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={[
                                    'text-[9px] font-mono uppercase tracking-widest',
                                    isActive
                                        ? 'text-neutral-700 dark:text-neutral-300'
                                        : isCompleted
                                            ? 'text-neutral-500 dark:text-neutral-500'
                                            : 'text-neutral-400 dark:text-neutral-600',
                                ].join(' ')}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Connector */}
                        {!isLast && (
                            <div
                                className={[
                                    'h-px w-4 sm:w-6 mx-1.5 sm:mx-2 transition-colors duration-300 shrink-0',
                                    isCompleted
                                        ? 'bg-blue-500'
                                        : 'bg-neutral-200 dark:bg-neutral-800',
                                ].join(' ')}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}