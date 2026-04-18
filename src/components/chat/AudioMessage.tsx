'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';

interface AudioMessageProps {
    src: string;
    isOwn: boolean;
    isUploading?: boolean;
}

export default function AudioMessage({ src, isOwn, isUploading }: AudioMessageProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current || isUploading) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`flex items-center gap-3 min-w-[200px] py-1 ${isUploading ? 'opacity-80' : ''}`}>
            <button
                onClick={togglePlay}
                disabled={isUploading}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isOwn ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/20 hover:bg-primary/30'} transition-colors ${isUploading ? 'cursor-not-allowed' : ''}`}
            >
                {isUploading ? (
                    <Loader2 className={`w-5 h-5 animate-spin ${isOwn ? 'text-white' : 'text-primary'}`} />
                ) : isPlaying ? (
                    <Pause className={`w-5 h-5 ${isOwn ? 'text-white' : 'text-primary'}`} />
                ) : (
                    <Play className={`w-5 h-5 ${isOwn ? 'text-white' : 'text-primary'}`} />
                )}
            </button>
            <div className="flex-1 space-y-2">
                <div className={`h-1.5 w-full rounded-full ${isOwn ? 'bg-white/20' : 'bg-white/10'}`}>
                    <div
                        className={`h-full rounded-full ${isOwn ? 'bg-white' : 'bg-primary'} transition-all`}
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] opacity-70">
                    <span>{formatTime(currentTime)}</span>
                    <span>{isUploading ? 'Sending...' : formatTime(duration)}</span>
                </div>
            </div>
            <audio ref={audioRef} src={src} className="hidden" preload="metadata" />
        </div>
    );
}
