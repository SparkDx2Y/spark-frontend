'use client';

import { useState, useRef, useEffect } from "react";
import { X, Play, Pause, Scissors, Timer, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";

interface VideoTrimmerModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoFile: File | null;
    onComplete: (startTime: number) => void;
}

export default function VideoTrimmerModal({ 
    isOpen, 
    onClose, 
    videoFile, 
    onComplete 
}: VideoTrimmerModalProps) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [duration, setDuration] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const LIMIT = 15;

    useEffect(() => {
        if (videoFile) {
            const url = URL.createObjectURL(videoFile);
            setVideoUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [videoFile]);

    const handleLoadedMetadata = () => {
        if (videoRef.current) setDuration(videoRef.current.duration);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const time = videoRef.current.currentTime;
            setCurrentTime(time);
            if (time >= startTime + LIMIT) {
                videoRef.current.currentTime = startTime;
            }
        }
    };

    const handleDrag = (_: any, info: any) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const percentage = (info.point.x - rect.left) / rect.width;
        let newStart = percentage * duration;
        newStart = Math.max(0, Math.min(newStart, duration - LIMIT));
        setStartTime(newStart);
        if (videoRef.current) videoRef.current.currentTime = newStart;
    };

    if (!videoUrl) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Clip Your Vibe" className="max-w-[340px] p-0 overflow-hidden bg-black/95 backdrop-blur-2xl">
            <div className="flex flex-col">
                {/* Compact Media View */}
                <div className="relative w-full aspect-4/5 bg-black overflow-hidden group">
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        playsInline
                        onClick={togglePlay}
                    />

                    {/* Minimal Overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
                        <Timer className="w-2.5 h-2.5 text-primary" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">15s</span>
                    </div>

                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20" onClick={togglePlay}>
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl">
                                <Play className="w-5 h-5 fill-white ml-0.5" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Micro Control Panel */}
                <div className="p-4 space-y-5">
                    {/* Tiny Timeline */}
                    <div className="space-y-2.5">
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2 text-zinc-500 font-bold text-[8px] uppercase tracking-widest">
                                <Activity className="w-3 h-3 text-primary/60" /> Sequence
                            </div>
                            <span className="text-primary text-[9px] font-black">{startTime.toFixed(1)}s</span>
                        </div>

                        <div 
                            ref={timelineRef}
                            className="relative h-6 bg-white/3 rounded-full border border-white/5 overflow-hidden"
                        >
                            {/* The Selection Handle */}
                            <motion.div
                                drag="x"
                                dragConstraints={timelineRef}
                                dragElastic={0}
                                dragMomentum={false}
                                onDrag={handleDrag}
                                style={{ 
                                    left: `${(startTime / duration) * 100}%`,
                                    width: `${(LIMIT / duration) * 100}%`
                                }}
                                className="absolute top-0 bottom-0 bg-primary border-x-2 border-white/30 z-20 cursor-grab active:cursor-grabbing shadow-[0_0_15px_rgba(255,75,125,0.4)]"
                            />
                            
                            {/* Progress bar */}
                            <motion.div 
                                className="absolute inset-y-0 w-0.5 bg-white z-30 pointer-events-none"
                                style={{ left: `${(currentTime / duration) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Small Action Strip */}
                    <div className="flex gap-2.5 pt-1">
                        <button
                            onClick={onClose}
                            className="flex-1 h-10 rounded-xl bg-zinc-900 text-zinc-400 font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-zinc-800"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => onComplete(startTime)}
                            className="flex-2 h-10 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <Scissors className="w-3.5 h-3.5" />
                            Trim Clip
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
