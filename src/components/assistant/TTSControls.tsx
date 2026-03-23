import { useEffect, useRef } from "react";

type TTSControlsProps = {
    audioData: string | null;
    autoPlay?: boolean;
    onPlayingStateChange?: (playing: boolean) => void;
};

export function TTSControls({
                                audioData,
                                autoPlay = true,
                                onPlayingStateChange
                            }: TTSControlsProps) {

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {

        if (!audioData) return;

        // Stop previous audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        try {

            const audio = new Audio(audioData);
            audioRef.current = audio;

            audio.onplay = () => {
                onPlayingStateChange?.(true);
            };

            audio.onended = () => {
                onPlayingStateChange?.(false);
            };

            audio.onerror = (e) => {
                console.error("Audio error:", e);
                onPlayingStateChange?.(false);
            };

            if (autoPlay) {
                audio.play().catch(err => {
                    console.error("Autoplay failed:", err);
                });
            }

        } catch (err) {
            console.error("Failed to play audio:", err);
        }

    }, [audioData]);

    return null;
}