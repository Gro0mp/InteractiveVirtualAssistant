import React, { useRef, useEffect } from 'react';

interface TechWavesBackgroundProps {
    className?: string;
    dotColor?: string;
    dotSize?: number;
    waveCount?: number;
    speed?: number;
    opacity?: number;
}

export function TechWavesBackground({
                                        className = '',
                                        dotColor = '#1e293b',
                                        dotSize = 1.2,
                                        waveCount = 12,
                                        speed = 0.8,
                                        opacity = 0.6,
                                    }: TechWavesBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let time = 0;
        let w = 0;
        let h = 0;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.scale(dpr, dpr);
        };

        resize();
        window.addEventListener('resize', resize);

        // Parse dotColor into r,g,b once so we can use rgba() per wave
        // without concatenating strings every frame
        const tempDiv = document.createElement('div');
        tempDiv.style.color = dotColor;
        document.body.appendChild(tempDiv);
        const computed = getComputedStyle(tempDiv).color; // "rgb(r, g, b)"
        document.body.removeChild(tempDiv);
        const rgb = computed.match(/\d+/g)?.slice(0, 3).join(',') ?? '30,41,59';

        // Increase dot spacing to reduce total dot count significantly
        const DOT_SPACING = 6;
        const RIBBON_ROWS = 3; // reduced from 5

        const animate = () => {
            ctx.clearRect(0, 0, w, h);

            const centerY = h * 0.5;
            const dotsPerLine = Math.floor(w / DOT_SPACING);

            for (let wave = 0; wave < waveCount; wave++) {
                const waveOffset = (wave - waveCount / 2) * 14;
                const distFromCenter = Math.abs(wave - waveCount / 2) / (waveCount / 2);
                const bandOpacity = opacity * (1 - distFromCenter * 0.65);

                for (let row = 0; row < RIBBON_ROWS; row++) {
                    const rowOffset = (row - RIBBON_ROWS / 2) * (dotSize * 2.2);
                    const rowDistFromCenter = Math.abs(row - RIBBON_ROWS / 2) / (RIBBON_ROWS / 2);
                    const rowOpacity = bandOpacity * (1 - rowDistFromCenter * 0.5);

                    // Group all dots in this wave+row into ONE path call
                    // This is the main perf win — one fill() instead of dotsPerLine fill() calls
                    ctx.beginPath();

                    for (let i = 0; i < dotsPerLine; i++) {
                        const t = i / dotsPerLine;
                        const x = t * w;

                        const y1 = Math.sin(t * 2.5 * Math.PI + time * speed + wave * 0.28) * (55 + wave * 1.5);
                        const y2 = Math.sin(t * 4.2 * Math.PI + time * speed * 1.4 + wave * 0.45) * (20 + wave * 1.0);
                        const y3 = Math.sin(t * 8.0 * Math.PI + time * speed * 0.7 + wave * 0.18) * 7;
                        const y = centerY + y1 + y2 + y3 + waveOffset + rowOffset;

                        // Horizontal smoothstep taper: thick center, fade to edges
                        const horizontalFade = Math.min(1, (1 - Math.abs(t - 0.5) * 2) / 0.6 + 0.33);
                        const smoothFade = horizontalFade * horizontalFade * (3 - 2 * horizontalFade);

                        const currentSize = Math.max(0.1, dotSize * (0.2 + 0.8 * smoothFade));

                        ctx.moveTo(x + currentSize, y);
                        ctx.arc(x, y, currentSize, 0, Math.PI * 2);
                    }

                    // One fill call per wave row instead of one per dot
                    ctx.fillStyle = `rgba(${rgb}, ${rowOpacity})`;
                    ctx.fill();
                }
            }

            time += 0.016;
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [dotColor, dotSize, waveCount, speed, opacity]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
            style={{ zIndex: 0 }}
        />
    );
}