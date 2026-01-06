'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import SwipeCard from '@/components/discover/SwipeCard';
import { getMatchFeed, swipeAction } from '@/services/matchService';
import { ProfileResponse } from '@/types/profile/response';
import Button from '@/components/ui/Button';
import { showError, showSuccess } from '@/utils/toast';

export default function UserHomePage() {
    const [profiles, setProfiles] = useState<ProfileResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfiles = async () => {
        try {
            setIsLoading(true);
            const data = await getMatchFeed();
            setProfiles(data);
        } catch (error) {
            console.error("Failed to fetch profiles", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleSwipe = async (direction: 'left' | 'right') => {
        // Assume the ACTIVE card is the last one in the list
        const activeProfile = profiles[profiles.length - 1];
        if (!activeProfile) return;

        // Optimistic UI Update: Remove the card immediately
        setProfiles(prev => {
            const newProfiles = [...prev];
            newProfiles.pop();
            return newProfiles;
        });

        const action = direction === 'right' ? 'like' : 'pass';

        try {
            const response = await swipeAction(activeProfile.userId, action);

            if (response.isMatch) {
                showSuccess("It's a Match! 🎉");
                // TODO: Show Match Modal
            }
        } catch (error) {
            console.error("Swipe action failed", error);
            // Ideally we might want to revert the UI state here if it fails critically
            showError("Something went wrong");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[80vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] overflow-hidden relative">

            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-b from-black/80 to-black z-10" />
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-sm aspect-3/4 h-[65vh]">

                <AnimatePresence>
                    {profiles.length > 0 ? (
                        profiles.map((profile, index) => (
                            <SwipeCard
                                key={profile.id || profile.userId} // Fallback to userId if id is missing
                                profile={profile}
                                active={index === profiles.length - 1}
                                onSwipe={handleSwipe}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-sm">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-2">
                                <RefreshCw className="w-10 h-10 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">No more profiles</h3>
                                <p className="text-gray-400">
                                    Check back later for new people nearby.
                                </p>
                            </div>
                            <Button onClick={fetchProfiles} className="mt-4">
                                Refresh Feed
                            </Button>

                        </div>
                    )}
                </AnimatePresence>
            </div>

            {profiles.length > 0 && (
                <p className="mt-8 text-gray-500 text-sm animate-pulse z-10 font-medium">
                    Swipe right to like • Swipe left to pass
                </p>
            )}
        </div>
    );
}
