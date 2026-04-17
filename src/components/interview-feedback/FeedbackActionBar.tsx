import React, { useState } from 'react'
import { ArrowLeft, RotateCcw, Share2, Check, LayoutDashboard } from 'lucide-react'
import { Button } from '../ui/Button'

type Props = {
    sessionTitle: string
    onBack: () => void
    onRetry: () => void
    onBackToDashboard: () => void
}

export function FeedbackActionBar({ sessionTitle, onBack, onRetry, onBackToDashboard }: Props) {
    const [copied, setCopied] = useState(false)

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative transition-colors duration-300">
            {/* Thin blue top rule */}
            <div className="h-px bg-blue-500 w-full" />

            <div className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
                {/* Left: session breadcrumb */}
                <div className="flex items-center gap-2 min-w-0">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 uppercase tracking-wider transition-colors shrink-0"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Back
                    </button>
                    <span className="text-neutral-200 dark:text-neutral-800 text-[10px]">/</span>
                    <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate">
                        {sessionTitle}
                    </span>
                    <span className="text-neutral-200 dark:text-neutral-800 text-[10px]">/</span>
                    <span className="text-[10px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">
                        Feedback
                    </span>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBackToDashboard}
                        leftIcon={<LayoutDashboard className="h-3.5 w-3.5" />}
                    >
                        Dashboard
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        leftIcon={copied
                            ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                            : <Share2 className="h-3.5 w-3.5" />
                        }
                    >
                        {copied ? 'Copied!' : 'Share'}
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onRetry}
                        leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                    >
                        Practice again
                    </Button>
                </div>
            </div>
        </div>
    )
}