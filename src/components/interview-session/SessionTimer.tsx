import React, { useEffect, useRef, useState } from 'react'

type Props = {
    running: boolean
    className?: string
}

function pad(n: number) {
    return String(n).padStart(2, '0')
}

export function SessionTimer({ running, className = '' }: Props) {
    const [seconds, setSeconds] = useState(0)
    const ref = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (running) {
            ref.current = setInterval(() => setSeconds(s => s + 1), 1000)
        } else {
            if (ref.current) clearInterval(ref.current)
        }
        return () => { if (ref.current) clearInterval(ref.current) }
    }, [running])

    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    return (
        <span className={`font-mono tabular-nums ${className}`}>
            {h > 0 && <>{pad(h)}:</>}{pad(m)}:{pad(s)}
        </span>
    )
}