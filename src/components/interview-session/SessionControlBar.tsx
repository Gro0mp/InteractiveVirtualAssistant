import React from 'react'
import { Mic, MicOff, Video, VideoOff, MessageSquare, BarChart2, PhoneOff } from 'lucide-react'

type Props = {
    isMuted: boolean
    isCameraOff: boolean
    isChatOpen: boolean
    isCompleted: boolean
    onToggleMute: () => void
    onToggleCamera: () => void
    onToggleChat: () => void
    onViewFeedback: () => void
    onEndCall: () => void
    unreadCount?: number
}

type ControlButtonProps = {
    icon: React.ReactNode
    label: string
    onClick: () => void
    active?: boolean
    danger?: boolean
    highlight?: boolean
    badge?: number
    disabled?: boolean
}

function ControlButton({ icon, label, onClick, active, danger, highlight, badge, disabled }: ControlButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={[
                'relative flex flex-col items-center gap-1.5 px-4 py-2.5 transition-all duration-150 group min-w-[60px]',
                'disabled:opacity-40 disabled:pointer-events-none',
                danger
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : highlight
                        ? 'bg-blue-600/20 hover:bg-blue-600/30 border border-blue-700/50 text-blue-400'
                        : active
                            ? 'bg-neutral-700/60 hover:bg-neutral-700 text-white border border-neutral-600'
                            : 'bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-transparent hover:border-neutral-700',
            ].join(' ')}
            aria-label={label}
        >
            <span className="relative">
                {icon}
                {badge !== undefined && badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-blue-600 text-white text-[8px] font-mono font-bold rounded-full">
                        {badge > 9 ? '9+' : badge}
                    </span>
                )}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest leading-none">
                {label}
            </span>
        </button>
    )
}

export function SessionControlBar({
                                      isMuted,
                                      isCameraOff,
                                      isChatOpen,
                                      isCompleted,
                                      onToggleMute,
                                      onToggleCamera,
                                      onToggleChat,
                                      onViewFeedback,
                                      onEndCall,
                                      unreadCount = 0,
                                  }: Props) {
    return (
        <div className="h-20 shrink-0 bg-neutral-950 border-t border-neutral-800 flex items-center justify-center gap-1 px-4 z-20 relative">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none" />

            {/* Mic */}
            <ControlButton
                icon={isMuted
                    ? <MicOff className="h-5 w-5" />
                    : <Mic className="h-5 w-5" />
                }
                label={isMuted ? 'Unmute' : 'Mute'}
                onClick={onToggleMute}
                active={!isMuted}
            />

            {/* Camera */}
            <ControlButton
                icon={isCameraOff
                    ? <VideoOff className="h-5 w-5" />
                    : <Video className="h-5 w-5" />
                }
                label={isCameraOff ? 'Start Video' : 'Stop Video'}
                onClick={onToggleCamera}
                active={!isCameraOff}
            />

            {/* Divider */}
            <div className="w-px h-8 bg-neutral-800 mx-2" />

            {/* Chat */}
            <ControlButton
                icon={<MessageSquare className="h-5 w-5" />}
                label="Chat"
                onClick={onToggleChat}
                active={isChatOpen}
                badge={!isChatOpen ? unreadCount : 0}
            />

            {/* Feedback */}
            <ControlButton
                icon={<BarChart2 className="h-5 w-5" />}
                label="Feedback"
                onClick={onViewFeedback}
                highlight={isCompleted}
                disabled={!isCompleted}
            />

            {/* Divider */}
            <div className="w-px h-8 bg-neutral-800 mx-2" />

            {/* End Call */}
            <ControlButton
                icon={<PhoneOff className="h-5 w-5" />}
                label="End"
                onClick={onEndCall}
                danger
            />

            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />
        </div>
    )
}