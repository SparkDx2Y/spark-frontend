'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocketContext } from '@/contexts/SocketContext';
import { Heart, MessageCircle, X } from 'lucide-react';

interface MatchData {
    type: string;
    message: string;
    matchId: string;
    data?: unknown;
}

export default function MatchModal() {
    const { socket } = useSocketContext();
    const [showModal, setShowModal] = useState(false);
    const [matchData, setMatchData] = useState<MatchData | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!socket) return;

        socket.on('match', (data: MatchData) => {
            setMatchData(data);
            setShowModal(true);
        });

        return () => {
            socket.off('match');
        };
    }, [socket]);

    const handleSendMessage = () => {
        if (matchData?.matchId) {
            router.push(`/user/messages?matchId=${matchData.matchId}`);
            setShowModal(false);
        }
    };

    const handleKeepSwiping = () => {
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-linear-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-md w-full relative overflow-hidden animate-scaleIn">
                {/* Decorative gradient blobs */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

                {/* Close button */}
                <button
                    onClick={handleKeepSwiping}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="relative z-10 text-center">
                    {/* Animated heart icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <Heart className="w-20 h-20 text-primary fill-primary animate-heartbeat" />
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-shimmer">
                        It's a Match!
                    </h1>

                    {/* Message */}
                    <p className="text-gray-300 mb-8">
                        {matchData?.message || "You and someone special liked each other!"}
                    </p>

                    {/* Action buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSendMessage}
                            className="w-full py-4 bg-linear-to-r from-primary to-purple-500 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 group"
                        >
                            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition" />
                            Send a Message
                        </button>

                        <button
                            onClick={handleKeepSwiping}
                            className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition"
                        >
                            Keep Swiping
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scaleIn {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes heartbeat {
                    0%, 100% {
                        transform: scale(1);
                    }
                    25% {
                        transform: scale(1.1);
                    }
                    50% {
                        transform: scale(1);
                    }
                    75% {
                        transform: scale(1.1);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% center;
                    }
                    100% {
                        background-position: 200% center;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }

                .animate-heartbeat {
                    animation: heartbeat 1.5s ease-in-out infinite;
                }

                .animate-shimmer {
                    background-size: 200% auto;
                    animation: shimmer 3s linear infinite;
                }
            `}</style>
        </div>
    );
}
