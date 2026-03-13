'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getMatches } from '@/services/messageService';
import { MatchResponse } from '@/types/message/response';
import { useSocketContext } from '@/contexts/SocketContext';
import { useAppSelector } from '@/store/hooks';
import { MessageCircle, Heart } from 'lucide-react';
import ProfilePreviewModal from '@/components/user/ProfilePreviewModal';

export default function MatchesPage() {
    const [matches, setMatches] = useState<MatchResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewUserId, setPreviewUserId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const router = useRouter();
    const { socket } = useSocketContext();
    const currentUser = useAppSelector((state) => state.auth.user);
    const LIMIT = 3;

    useEffect(() => {
        loadMatches(1, true);

        if (socket) {
            socket.on('match', () => {
                loadMatches(1, true);
            });

            return () => {
                socket.off('match');
            };
        }
    }, [socket]);

    const loadMatches = async (pageNumber: number, replace: boolean = false) => {
        if (pageNumber > 1) setLoadingMore(true);
        else setLoading(true);

        try {
            const response = await getMatches(pageNumber, LIMIT);
            const newData = response.data;

            if (replace) {
                setMatches(newData);
            } else {
                setMatches((prev: MatchResponse[]) => [...prev, ...newData]);
            }

            setHasMore(newData.length === LIMIT);
            setPage(pageNumber);
        } catch (error) {
            console.error('Failed to load matches:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            loadMatches(page + 1);
        }
    };

    const handleChatClick = (matchId: string) => {
        router.push(`/user/messages?matchId=${matchId}`);
    };

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
                            <div className="w-full aspect-square bg-white/10 rounded-lg mb-4" />
                            <div className="h-6 bg-white/10 rounded mb-2" />
                            <div className="h-4 bg-white/10 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
                <Heart className="w-16 h-16 text-primary/30 mb-4" />
                <h1 className="text-3xl font-bold mb-2">No Matches Yet</h1>
                <p className="text-gray-400 mb-6">Start swiping to find your perfect match!</p>
                <button
                    onClick={() => router.push('/user/home')}
                    className="px-6 py-3 bg-linear-to-r from-primary to-purple-500 rounded-lg font-semibold hover:opacity-90 transition"
                >
                    Start Swiping
                </button>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Your Matches</h1>
                <span className="text-gray-400">{matches.length} {matches.length === 1 ? 'match' : 'matches'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => {
                    const otherUser = match.users.find(u => u.userId !== currentUser?.id) || match.users[0];


                    return (
                        <div
                            key={match.id}
                            className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300"
                        >
                            {/* Profile Photo */}
                            <div
                                onClick={() => setPreviewUserId(otherUser.userId)}
                                className="relative aspect-square overflow-hidden bg-gray-900 cursor-pointer"
                            >
                                <Image
                                    src={otherUser.profilePhoto || '/default-avatar.png'}
                                    alt={otherUser.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                                {/* View Profile hint on hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/20">
                                        View Profile
                                    </div>
                                </div>

                                {/* Name overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-xl font-bold text-white">{otherUser.name}</h3>
                                    {match.lastMessageAt && (
                                        <p className="text-sm text-gray-300">
                                            Last message: {new Date(match.lastMessageAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>



                            {/* Action Button */}
                            <button
                                onClick={() => handleChatClick(match.id)}
                                className="w-full p-4 bg-linear-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 transition-all flex items-center justify-center gap-2 font-semibold"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Send Message
                            </button>
                        </div>
                    );
                })}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-12 mb-8">
                    <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition disabled:opacity-50"
                    >
                        {loadingMore ? 'Loading...' : 'Load More Matches'}
                    </button>
                </div>
            )}

            <ProfilePreviewModal
                isOpen={!!previewUserId}
                userId={previewUserId}
                onClose={() => setPreviewUserId(null)}
            />
        </div>
    );
}
