import { useRef, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff, PhoneIncoming, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoCall } from '@/hooks/useVideoCall';

interface VideoCallModalProps {
    isOpen: boolean;
    onClose: () => void;
    socket: any;
    currentUser: any;
    otherUser: { id: string; name: string; profilePhoto?: string };
    isIncomingInitial?: boolean;
    callerSignalInitial?: any;
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
    }, [localStream]);

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
                <div className="relative w-full h-full flex flex-col bg-gray-900 overflow-hidden">

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
                            <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-purple-900/20 to-gray-900">
                                <div className="relative mb-8">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                                        <img src={otherUser.profilePhoto || '/default-avatar.png'} alt={otherUser.name} className="w-full h-full object-cover" />
                                    </div>
                                    {!isIncoming && !callAccepted && (
                                        <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                                    )}
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{otherUser.name}</h3>
                                <p className="text-gray-400 text-lg animate-pulse">
                                    {isIncoming ? 'Incoming video call...' : 'Calling...'}
                                </p>
                            </div>
                        )}

                        {/* Incoming Call Overlay */}
                        {isIncoming && !callAccepted && (
                            <div className="absolute inset-0 flex flex-col items-center justify-end md:justify-center bg-black/80 z-40 backdrop-blur-sm pb-32 md:pb-0">
                               
                                <div className="flex gap-8 items-center mt-12">
                                    <button
                                        onClick={endCall}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="p-6 rounded-full bg-red-500 hover:bg-red-600 transition-all shadow-lg group-hover:scale-110 group-hover:shadow-red-500/50">
                                            <PhoneOff className="w-8 h-8 text-white" />
                                        </div>
                                        <span className="text-white text-sm font-medium">Decline</span>
                                    </button>

                                    <button
                                        onClick={answerCall}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="p-6 rounded-full bg-green-500 hover:bg-green-600 transition-all shadow-lg group-hover:scale-110 group-hover:shadow-green-500/50 animate-bounce">
                                            <PhoneIncoming className="w-8 h-8 text-white" />
                                        </div>
                                        <span className="text-white text-sm font-medium">Accept</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Local Video (PiP) */}
                        {localStream && (
                            <motion.div
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                dragElastic={0.1}
                                className="absolute top-6 right-6 w-32 h-44 md:w-56 md:h-80 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-30 cursor-grab active:cursor-grabbing hover:shadow-purple-500/20 transition-shadow"
                            >
                                <video
                                    playsInline
                                    muted
                                    ref={myVideoRef}
                                    autoPlay
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                                {isVideoOff && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white/50">
                                        <VideoOff className="w-8 h-8" />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Bottom Controls Bar (Floating) */}
                    {!isIncoming && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
                            <div className="flex items-center gap-6 px-8 py-4 bg-gray-900/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                                <button
                                    onClick={toggleAudio}
                                    className={`p-4 rounded-full transition-all duration-300 ${isMuted
                                            ? 'bg-white text-gray-900 hover:bg-gray-200'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                </button>

                                <button
                                    onClick={endCall}
                                    className="p-5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-red-500/30"
                                >
                                    <PhoneOff className="w-8 h-8" />
                                </button>

                                <button
                                    onClick={toggleVideo}
                                    className={`p-4 rounded-full transition-all duration-300 ${isVideoOff
                                            ? 'bg-white text-gray-900 hover:bg-gray-200'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
