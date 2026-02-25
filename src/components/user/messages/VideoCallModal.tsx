import { useRef, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff, PhoneIncoming } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoCall } from '@/hooks/useVideoCall';
import { Socket } from 'socket.io-client';
import { User } from '@/store/features/auth/authSlice';

interface VideoCallModalProps {
    isOpen: boolean;
    onClose: () => void;
    socket: Socket;
    currentUser: User;
    otherUser: { id: string; name: string; profilePhoto?: string };
    isIncomingInitial?: boolean;
    callerSignalInitial?: RTCSessionDescriptionInit | null;
}

export default function VideoCallModal({ isOpen, onClose, socket, currentUser, otherUser, isIncomingInitial = false, callerSignalInitial = null }: VideoCallModalProps) {
    const { localStream, remoteStream, callAccepted, isIncoming, isMuted, isVideoOff, answerCall, endCall, toggleAudio, toggleVideo, error } = useVideoCall(socket, currentUser, otherUser.id, isIncomingInitial, callerSignalInitial, onClose);

    const myVideoRef = useRef<HTMLVideoElement>(null);
    const userVideoRef = useRef<HTMLVideoElement>(null);

    // Sync Streams to Video Elements
    useEffect(() => {
        if (myVideoRef.current && localStream) {
            myVideoRef.current.srcObject = localStream;
        }
    }, [localStream, callAccepted, isIncoming]);

    useEffect(() => {
        if (userVideoRef.current && remoteStream) {
            userVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);


    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
            >
                {/* Full Screen Layout */}
                <div className="relative w-full h-full flex flex-col bg-black overflow-hidden">

                    {/* Error Toast */}
                    {error && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-60 bg-red-500/90 text-white px-6 py-3 rounded-full backdrop-blur-md font-medium shadow-xl animate-in slide-in-from-top-full duration-300">
                            {error}
                        </div>
                    )}

                    {/* Main Video Area (Remote or Placeholder) */}
                    <div className="relative flex-1 w-full h-full bg-black">
                        {callAccepted && remoteStream ? (
                            <video
                                playsInline
                                ref={userVideoRef}
                                autoPlay
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                {/* Ambient Background Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

                                <div className="relative mb-8 z-10">
                                    {/* Spinner Container */}
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center">

                                        {/* Spinning Tail (The Border) */}
                                        {!isIncoming && !callAccepted && (
                                            <div className="absolute -inset-[3px] rounded-full overflow-hidden">
                                                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_40%,var(--color-primary)_50%,transparent_60%,transparent_100%)]" />
                                            </div>
                                        )}

                                        {/* Avatar Image (Masks the center) */}
                                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-black z-10 bg-black">
                                            <img
                                                src={otherUser.profilePhoto || '/default-avatar.png'}
                                                alt={otherUser.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight z-10">{otherUser.name}</h3>
                                <p className="text-gray-400 text-lg animate-pulse z-10">
                                    {isIncoming ? 'Incoming video call...' : 'Calling...'}
                                </p>
                            </div>
                        )}

                        {/* Incoming Call Controls */}
                        {isIncoming && !callAccepted && (
                            <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
                                <div className="flex gap-8 items-center px-10 py-5 bg-dark-card/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
                                    <button
                                        onClick={endCall}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="p-4 md:p-5 rounded-full bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:shadow-red-500/30">
                                            <PhoneOff className="w-6 h-6 md:w-8 md:h-8" />
                                        </div>
                                        <span className="text-gray-300 text-xs font-medium group-hover:text-white transition-colors">Decline</span>
                                    </button>

                                    <button
                                        onClick={answerCall}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="p-4 md:p-5 rounded-full bg-green-500/20 text-green-500 border border-green-500/50 hover:bg-green-500 hover:text-white transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:shadow-green-500/30 animate-pulse hover:animate-none">
                                            <PhoneIncoming className="w-6 h-6 md:w-8 md:h-8" />
                                        </div>
                                        <span className="text-gray-300 text-xs font-medium group-hover:text-white transition-colors">Accept</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Local Video (PiP) */}
                        {localStream && (!isIncoming || callAccepted) && (
                            <motion.div
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                dragElastic={0.1}
                                className="absolute top-6 right-6 w-32 h-44 md:w-56 md:h-80 bg-dark-card rounded-2xl overflow-hidden shadow-2xl border-gradient z-30 cursor-grab active:cursor-grabbing hover:shadow-primary/20 transition-shadow"
                            >
                                <video
                                    playsInline
                                    muted
                                    ref={myVideoRef}
                                    autoPlay
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                                {isVideoOff && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-dark-card text-white/50">
                                        <VideoOff className="w-8 h-8" />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Bottom Controls Bar (Floating) */}
                    {!isIncoming && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
                            <div className="flex items-center gap-4 p-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl overflow-hidden">

                                <button
                                    onClick={toggleAudio}
                                    className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-all duration-300 ${isMuted
                                        ? 'bg-white text-black'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {isMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
                                </button>

                                <button
                                    onClick={endCall}
                                    className="w-20 h-12 md:w-24 md:h-14 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 shadow-lg shadow-red-500/20"
                                >
                                    <PhoneOff className="w-6 h-6 md:w-8 md:h-8" />
                                </button>

                                <button
                                    onClick={toggleVideo}
                                    className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-all duration-300 ${isVideoOff
                                        ? 'bg-white text-black'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {isVideoOff ? <VideoOff className="w-5 h-5 md:w-6 md:h-6" /> : <VideoIcon className="w-5 h-5 md:w-6 md:h-6" />}
                                </button>

                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
