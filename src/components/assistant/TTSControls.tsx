import { useEffect, useRef } from 'react';

type TTSControlsProps = {
    // We pass an object so React triggers the effect even if two chunks are identical
    newAudioChunk: { url: string; id: number } | null;
    clearTrigger: number; // Increment this to instantly kill audio (e.g., user interrupts)
    onPlayingStateChange?: (playing: boolean) => void;
};

export function TTSControls({ newAudioChunk, clearTrigger, onPlayingStateChange }: TTSControlsProps) {
    const audioRef        = useRef<HTMLAudioElement | null>(null);
    const queueRef        = useRef<string[]>([]);
    const isPlayingRef    = useRef(false);
    const onPlayingStateChangeRef = useRef(onPlayingStateChange);

    // Keep the callback ref fresh without re-triggering effects
    useEffect(() => {
        onPlayingStateChangeRef.current = onPlayingStateChange;
    });

    // 1. Add incoming chunks to the queue, then try to start playback
    useEffect(() => {
        if (!newAudioChunk) return;
        queueRef.current.push(newAudioChunk.url);
        playNext();
    }, [newAudioChunk]);

    // 2. Handle user interruptions — clear queue and stop current audio immediately
    useEffect(() => {
        if (clearTrigger <= 0) return;
        queueRef.current = [];
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.removeAttribute('src');
            audioRef.current = null;
        }
        if (isPlayingRef.current) {
            isPlayingRef.current = false;
            onPlayingStateChangeRef.current?.(false);
        }
    }, [clearTrigger]);

    // 3. Internal playback loop
    const playNext = () => {
        if (isPlayingRef.current || queueRef.current.length === 0) return;

        const nextUrl = queueRef.current.shift();
        if (!nextUrl) return;

        isPlayingRef.current = true;
        onPlayingStateChangeRef.current?.(true);

        const audio = new Audio(nextUrl);
        audioRef.current = audio;

        // FIX: Pre-load the next chunk in the queue while this one plays.
        // Creating the Audio object triggers the browser to start fetching
        // the resource immediately, so there's no gap between sentences.
        if (queueRef.current.length > 0) {
            new Audio(queueRef.current[0]);
        }

        audio.onended = () => {
            isPlayingRef.current = false;
            audioRef.current = null;

            if (queueRef.current.length === 0) {
                onPlayingStateChangeRef.current?.(false);
            } else {
                playNext();
            }
        };

        audio.onerror = (e) => {
            console.error('Audio chunk error:', e);
            isPlayingRef.current = false;
            audioRef.current = null;
            playNext(); // Skip broken chunk and continue
        };

        audio.play().catch((err) => {
            console.error('Autoplay blocked or failed:', err);
            isPlayingRef.current = false;
            audioRef.current = null;
            onPlayingStateChangeRef.current?.(false);
        });
    };

    return null;
}