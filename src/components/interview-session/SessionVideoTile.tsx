import React from 'react'

type Props = {
    label: string
    sublabel?: string
    isSpeaking?: boolean
    isThinking?: boolean
    isSelf?: boolean
    className?: string
    children: React.ReactNode   // the 3D canvas or avatar content
    cornerAccent?: 'tl' | 'tr' | 'br' | 'bl'
}

export function SessionVideoTile({
                                     label,
                                     sublabel,
                                     isSpeaking,
                                     isThinking,
                                     isSelf,
                                     className = '',
                                     children,
                                     cornerAccent = 'tl',
                                 }: Props) {
    const speaking = isSpeaking && !isThinking

    return (
        <div
            className={[
                'relative overflow-hidden bg-neutral-950 flex flex-col transition-all duration-300',
                // Active speaker ring — matches Zoom yellow but in blue to fit our palette
                speaking
                    ? 'ring-2 ring-blue-500 ring-offset-0'
                    : 'ring-1 ring-neutral-800',
                className,
            ].join(' ')}
        >
            {/* Corner accents — only on main tile */}
            {!isSelf && (
                <>
                    <span className="absolute top-0 left-0 w-8 h-px bg-blue-500 z-10" aria-hidden />
                    <span className="absolute top-0 left-0 h-8 w-px bg-blue-500 z-10" aria-hidden />
                    <span className="absolute bottom-0 right-0 w-8 h-px bg-blue-500/40 z-10" aria-hidden />
                    <span className="absolute bottom-0 right-0 h-8 w-px bg-blue-500/40 z-10" aria-hidden />
                </>
            )}

            {/* Terminal top bar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 py-2 bg-gradient-to-b from-neutral-950/90 to-transparent pointer-events-none">
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                </div>
                {isThinking && (
                    <span className="inline-flex items-center gap-1 border border-amber-700/50 px-1.5 py-0.5 ml-1">
                        <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest">Thinking</span>
                    </span>
                )}
                {speaking && (
                    <span className="inline-flex items-center gap-1 border border-blue-700/50 px-1.5 py-0.5 ml-1">
                        <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[8px] font-mono text-blue-400 uppercase tracking-widest">Speaking</span>
                    </span>
                )}
            </div>

            {/* Content (3D canvas / avatar) */}
            <div className="flex-1 min-h-0 relative">
                {children}
            </div>

            {/* Bottom name tag — like Zoom's name label */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between px-3 py-2.5 bg-gradient-to-t from-neutral-950/80 to-transparent pointer-events-none">
                <div className="flex items-center gap-2">
                    {/* Speaking bars — 3 animated vertical lines */}
                    {speaking && (
                        <div className="flex items-end gap-px h-3">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className="w-0.5 bg-blue-400 rounded-full"
                                    style={{
                                        height: `${30 + i * 20}%`,
                                        animation: `speakingBar ${0.5 + i * 0.15}s ease-in-out infinite alternate`,
                                        animationDelay: `${i * 0.1}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    <div>
                        <p className="text-[11px] font-mono font-semibold text-white leading-none">
                            {label}
                        </p>
                        {sublabel && (
                            <p className="text-[9px] font-mono text-neutral-400 mt-0.5">{sublabel}</p>
                        )}
                    </div>
                </div>
                {isSelf && (
                    <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">You</span>
                )}
            </div>

            {/* Speaking bar keyframe injected inline */}
            <style>{`
                @keyframes speakingBar {
                    from { transform: scaleY(0.4); }
                    to   { transform: scaleY(1); }
                }
            `}</style>
        </div>
    )
}