import { useEffect, useRef } from 'react';

type AudioDataInput =
    | string
    | Uint8Array
    | ArrayBuffer
    | number[]
    | null
    | undefined;

type TTSControlsProps = {
    audioData: AudioDataInput;
    autoPlay?: boolean;
    onPlayingStateChange?: (isPlaying: boolean) => void;
};

function toUint8Array(data: Exclude<AudioDataInput, null | undefined>): Uint8Array {
    if (typeof data === 'string') {
        // Some backends include a data URL prefix; handle both.
        const base64 = data.includes('base64,') ? data.split('base64,')[1] : data;
        const binaryString = atob(base64);
        const out = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            out[i] = binaryString.charCodeAt(i);
        }
        return out;
    }

    if (data instanceof Uint8Array) {
        return data;
    }

    if (data instanceof ArrayBuffer) {
        return new Uint8Array(data);
    }

    // number[] (or array-like)
    return new Uint8Array(data);
}

export function TTSControls({
    audioData,
    autoPlay = true,
    onPlayingStateChange
}: TTSControlsProps) {
    // Refs to manage audio element and state
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const processedAudioRef = useRef<AudioDataInput>(null); // Track which audio we've already processed

    // Track the current object URL so we can revoke it reliably
    const objectUrlRef = useRef<string | null>(null);

    // Effect to handle audio data changes
    useEffect(() => {
        // If audio is not valid, exit.
        if (!audioData || (typeof audioData !== 'string' && 'length' in audioData && audioData.length === 0)) {
            return;
        }

        // Prevent processing the same audio data twice
        if (audioData === processedAudioRef.current) {
            console.log('Audio already processed, skipping...');
            return;
        }

        // Begin processing new audio data
        processedAudioRef.current = audioData;

        // Clean up any prior audio/url before creating the next one.
        const prevAudio = audioRef.current;
        if (prevAudio) {
            prevAudio.pause();
            prevAudio.onplay = null;
            prevAudio.onended = null;
            prevAudio.onpause = null;
            prevAudio.onerror = null;
            audioRef.current = null;
        }

        const prevUrl = objectUrlRef.current;
        if (prevUrl) {
            URL.revokeObjectURL(prevUrl);
            objectUrlRef.current = null;
        }

        try {
            const rawBytes = toUint8Array(audioData);

            console.log('Creating audio blob, size:', rawBytes.length, 'bytes');

            // Build a BlobPart that TS is always happy with.
            // Copy ensures it's backed by a plain ArrayBuffer at runtime too.
            const blobBytes = new Uint8Array(rawBytes);
            const audioBlob = new Blob([blobBytes], { type: 'audio/mpeg' });

            const audioUrl = URL.createObjectURL(audioBlob);
            objectUrlRef.current = audioUrl;

            console.log('Audio URL created:', audioUrl);

            const audio: HTMLAudioElement = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onloadeddata = () => {
                console.log('Audio loaded successfully, duration:', audio.duration);
            };

            audio.onplay = () => {
                console.log('Audio started playing');
                onPlayingStateChange?.(true);
            };

            audio.onended = () => {
                console.log('Audio playback finished');
                const url = objectUrlRef.current;
                if (url) {
                    URL.revokeObjectURL(url);
                    objectUrlRef.current = null;
                }
                onPlayingStateChange?.(false);
            };

            audio.onpause = () => {
                // Only notify if audio naturally paused (not during cleanup)
                if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
                    console.log('Audio paused at', audio.currentTime);
                    onPlayingStateChange?.(false);
                }
            };

            audio.onerror = (e) => {
                console.error('Error playing audio:', e);
                console.error('Audio error details:', audio.error);
                const url = objectUrlRef.current;
                if (url) {
                    URL.revokeObjectURL(url);
                    objectUrlRef.current = null;
                }
                onPlayingStateChange?.(false);
            };

            if (autoPlay) {
                const audioToPlay = audio; // capture reference at this point in time
                setTimeout(() => {
                    // Only play if this audio instance is still the active one
                    if (audioRef.current !== audioToPlay) return;

                    audioToPlay
                        .play()
                        .then(() => {
                            console.log('Audio playing...');
                        })
                        .catch((err) => {
                            if (err.name === 'AbortError') return; // safely ignore interruption
                            console.error('Failed to auto-play audio:', err);
                            onPlayingStateChange?.(false);
                        });
                }, 100);
            }
        } catch (error) {
            console.error('Error processing audio data:', error);
            onPlayingStateChange?.(false);
        }
    }, [audioData, autoPlay, onPlayingStateChange]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log('TTSControls unmounting, cleaning up audio');

            const audio = audioRef.current;
            if (audio) {
                audio.pause();
                audio.onplay = null;
                audio.onended = null;
                audio.onpause = null;
                audio.onerror = null;
                audioRef.current = null;
            }

            const url = objectUrlRef.current;
            if (url) {
                URL.revokeObjectURL(url);
                objectUrlRef.current = null;
            }

            onPlayingStateChange?.(false);
        };
    }, [onPlayingStateChange]);

    return null;
}