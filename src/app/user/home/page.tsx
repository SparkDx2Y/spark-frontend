'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import SwipeCard from '@/components/discover/SwipeCard';
import { getMatchFeed, swipeAction } from '@/services/matchService';
import { ProfileResponse } from '@/types/profile/response';
import Button from '@/components/ui/Button';
import { showError, showSuccess } from '@/utils/toast';
import { useAppSelector } from '@/store/hooks';

export default function UserHomePage() {
    const [profiles, setProfiles] = useState<ProfileResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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
        if (!isAuthenticated) return;
        fetchProfiles();
    }, [isAuthenticated]);


    const handleSwipe = async (direction: 'left' | 'right') => {
        if (!isAuthenticated) return;

        // ACTIVE card is the last one in the list
        const activeProfile = profiles[profiles.length - 1];
        if (!activeProfile) return;

        //  remove the card immediately once swipe is triggered
        setProfiles(prev => {
            const newProfiles = [...prev];
            newProfiles.pop();
            return newProfiles;
        });

        const action = direction === 'right' ? 'like' : 'pass';

        try {
            const response = await swipeAction({ targetId: activeProfile.userId, action });

            if (response.isMatch) {
                showSuccess("It's a Match!");
                // TODO: Show Match Modal
            }
        } catch (error) {
            console.error("Swipe action failed", error);
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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] md:h-[calc(100vh-80px)] overflow-hidden relative p-4 md:p-0">

            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-b from-black/80 to-black z-10" />
                <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-[min(90vw,400px)] aspect-[3/4.5] md:aspect-3/4 max-h-[70vh] md:h-[65vh]">

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
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 bg-white/5 rounded-3xl border border-white/10 p-6 md:p-8 backdrop-blur-sm">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mb-2">
                                <RefreshCw className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No more profiles</h3>
                                <p className="text-sm md:text-base text-gray-400">
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
                <p className="mt-6 md:mt-8 text-gray-500 text-xs md:text-sm animate-pulse z-10 font-medium">
                    Swipe right to like • Swipe left to pass
                </p>
            )}
        </div>
    );
}
