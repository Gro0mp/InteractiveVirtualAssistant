import React from 'react'
import { MicOff } from 'lucide-react'

type Props = {
    username: string
    isMuted: boolean
    isCameraOff: boolean
    className?: string
}

export function SessionSelfView({ username, isMuted, isCameraOff, className = '' }: Props) {
    const initial = username.charAt(0).toUpperCase()

    return (
        <div className={[
            'relative bg-neutral-900 ring-1 ring-neutral-800 overflow-hidden flex flex-col',
            className,
        ].join(' ')}>
            {/* Camera off — show avatar */}
            <div className="flex-1 flex items-center justify-center">
                {isCameraOff ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                            <span className="text-xl font-mono font-bold text-neutral-400">{initial}</span>
                        </div>
                        <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Camera off</p>
                    </div>
                ) : (
                    // Placeholder for future webcam integration
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                        <div className="w-12 h-12 bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                            <span className="text-xl font-mono font-bold text-neutral-400">{initial}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2.5 py-2 bg-gradient-to-t from-neutral-950/80 to-transparent">
                <span className="text-[10px] font-mono font-semibold text-white truncate">{username}</span>
                {isMuted && (
                    <div className="w-5 h-5 flex items-center justify-center bg-red-600/80 shrink-0">
                        <MicOff className="h-2.5 w-2.5 text-white" />
                    </div>
                )}
            </div>
        </div>
    )
}