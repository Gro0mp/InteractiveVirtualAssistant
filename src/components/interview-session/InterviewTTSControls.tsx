import { useEffect, useRef } from 'react';

type TTSControlsProps = {
    audioData: string | null;
    autoPlay?: boolean;
    onPlayingStateChange?: (playing: boolean) => void;
};

export function InterviewTTSControls({ audioData, autoPlay = true, onPlayingStateChange }: TTSControlsProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    /**
     * FIX: dependency array was missing autoPlay and onPlayingStateChange.
     * Omitting them caused the effect to close over stale values if either prop
     * changed after the first render (e.g. parent re-renders with a new callback ref).
     *
     * onPlayingStateChange is wrapped in a ref so that changing the callback
     * identity on the parent side doesn't needlessly restart audio playback.
     */
    const onPlayingStateChangeRef = useRef(onPlayingStateChange);
    useEffect(() => {
        onPlayingStateChangeRef.current = onPlayingStateChange;
    });

    useEffect(() => {
        if (!audioData) return;

        // Stop any audio that's already playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        try {
            const audio = new Audio(audioData);
            audioRef.current = audio;

            audio.onplay = () => onPlayingStateChangeRef.current?.(true);
            audio.onended = () => onPlayingStateChangeRef.current?.(false);
            audio.onerror = (e) => {
                console.error('Audio error:', e);
                onPlayingStateChangeRef.current?.(false);
            };

            if (autoPlay) {
                audio.play().catch((err) => console.error('Autoplay failed:', err));
            }
        } catch (err) {
            console.error('Failed to play audio:', err);
        }

        return () => {
            // Stop audio when audioData changes or component unmounts
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [audioData, autoPlay]);

    return null;
}