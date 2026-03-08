import React from "react"

interface ScrollingGridBackgroundProps {
    className?: string
}

export function ScrollingGridBackground({ className = '' }: ScrollingGridBackgroundProps) {
    return (
        <div
            className={`hero-grid-bg absolute inset-0 w-full h-full ${className}`}
            aria-hidden="true"
        >
            {/* Radial vignette — fades grid edges into the page background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(242,242,242,0.25) 60%, rgba(242,242,242,0.92) 100%)',
                }}
            />
        </div>
    )
}