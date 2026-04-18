'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, RefreshCw, Circle, CheckCircle2, AlertCircle, Loader2, Video, Camera as CameraIcon, Timer, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface VideoRecorderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (videoBlob: Blob) => void;
}

export default function VideoRecorderModal({ isOpen, onClose, onComplete }: VideoRecorderModalProps) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recording, setRecording] = useState(false);
    const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const MAX_DURATION = 15;

    const startCamera = async () => {
        try {
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    aspectRatio: 4/5,
                    facingMode: 'user',
                    width: { ideal: 720 },
                    height: { ideal: 900 }
                },
                audio: true
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera access failed", err);
            setError("Camera access is required for Vibe clips.");
        }
    };

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (timerRef.current) clearInterval(timerRef.current);
    }, [stream]);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
            setRecordedUrl(null);
            setRecordedBlob(null);
            setDuration(0);
        }
        return () => stopCamera();
    }, [isOpen]);

    const startRecording = () => {
        if (!stream) return;

        chunksRef.current = [];
        const recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9,opus'
        });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setRecordedUrl(url);
            setRecordedBlob(blob);
            setRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setRecording(true);
        setDuration(0);

        timerRef.current = setInterval(() => {
            setDuration(prev => {
                if (prev >= MAX_DURATION) {
                    stopRecording();
                    return MAX_DURATION;
                }
                return prev + 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
        }
    };

    const handleSave = () => {
        if (recordedBlob) {
            onComplete(recordedBlob);
            onClose();
        }
    };

    const handleRetake = () => {
        setRecordedUrl(null);
        setRecordedBlob(null);
        setDuration(0);
        startCamera();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Capture Vibe" className="max-w-[340px] p-0 overflow-hidden bg-black/95 backdrop-blur-2xl">
            <div className="flex flex-col">
                {/* Immersive Viewfinder */}
                <div className="relative w-full aspect-4/5 bg-zinc-900 overflow-hidden">
                    {recordedUrl ? (
                        <video 
                            src={recordedUrl} 
                            autoPlay 
                            loop 
                            muted 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover -scale-x-100"
                        />
                    )}

                    {/* Pro Indicators */}
                    <div className="absolute inset-x-0 top-0 p-3 flex justify-between items-start pointer-events-none z-20">
                        <div className="flex gap-1.5">
                            <div className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                                <Timer className="w-2.5 h-2.5 text-primary" />
                                <span className="text-[9px] font-black text-white uppercase tracking-wider">{duration}s</span>
                            </div>
                        </div>

                        {recording && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="px-2 py-1 rounded-md bg-red-500/80 backdrop-blur-md border border-red-400/20 flex items-center gap-1.5"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                <span className="text-[9px] font-black text-white uppercase tracking-wider">REC</span>
                            </motion.div>
                        )}
                    </div>

                    {/* Micro Progress Line */}
                    {recording && (
                        <div className="absolute top-0 inset-x-0 h-0.5 bg-white/10 z-30">
                            <motion.div 
                                className="h-full bg-primary shadow-[0_0_10px_rgba(255,75,125,0.8)]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(duration / MAX_DURATION) * 100}%` }}
                                transition={{ duration: 1, ease: "linear" }}
                            />
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950/90 backdrop-blur-md z-40">
                            <div className="p-4 rounded-full bg-red-500/10 mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-sm font-medium text-white mb-6 px-4">{error}</p>
                            <button 
                                onClick={startCamera}
                                className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                            >
                                Grant Access
                            </button>
                        </div>
                    )}
                </div>

                {/* Micro Action Panel */}
                <div className="p-4 bg-zinc-950/50">
                    {!recordedUrl ? (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                                {recording ? "RECORDING LIVE" : "READY TO SHOOT"}
                            </div>
                            
                            <button
                                onClick={recording ? stopRecording : startRecording}
                                className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 group ${
                                    recording ? 'bg-white/10' : 'bg-white/5'
                                }`}
                            >
                                <div className={`rounded-full transition-all duration-300 ${
                                    recording 
                                        ? 'w-6 h-6 bg-red-500 rounded-sm' 
                                        : 'w-10 h-10 bg-white shadow-xl group-hover:scale-105 shadow-white/10'
                                }`} />
                                
                                {recording && (
                                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
                                )}
                            </button>

                            <div className="flex-1 flex justify-end">
                                <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center">
                                    <Zap className="w-3.5 h-3.5 text-zinc-600" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2.5">
                            <button
                                onClick={handleRetake}
                                className="flex-1 h-11 rounded-xl bg-zinc-900 text-zinc-400 font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-zinc-800 flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Retake
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-2 h-11 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Post Vibe
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
