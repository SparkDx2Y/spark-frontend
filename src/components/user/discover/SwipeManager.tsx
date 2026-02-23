'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import SwipeCard from './SwipeCard';
import { swipeAction, getMatchFeed } from '@/services/matchService';
import { ProfileResponse } from '@/types/profile/response';
import Button from '@/components/ui/Button';
import { showError } from '@/utils/toast';
import { useAppSelector } from '@/store/hooks';

interface SwipeManagerProps {
    initialProfiles: ProfileResponse[];
}

export default function SwipeManager({ initialProfiles }: SwipeManagerProps) {
    const [profiles, setProfiles] = useState<ProfileResponse[]>(initialProfiles);
    const [isLoading, setIsLoading] = useState(false);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    // Refresh feed
    const refreshFeed = async () => {
        try {
            setIsLoading(true);
            const response = await getMatchFeed();
            setProfiles(response.data);
        } catch (error) {
            console.error("Failed to fetch profiles", error);
            showError("Failed to refresh feed");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle swipe action
    const handleSwipe = async (direction: 'left' | 'right') => {
        if (!isAuthenticated) return;

        const activeProfile = profiles[profiles.length - 1];
        if (!activeProfile) return;

        // Remove card immediately
        setProfiles(prev => {
            const newProfiles = [...prev];
            newProfiles.pop();
            return newProfiles;
        });

        const action = direction === 'right' ? 'like' : 'pass';

        try {
             await swipeAction({ targetId: activeProfile.userId, action });

        } catch (error) {
            console.error("Swipe action failed", error);
            showError("Something went wrong");
        }
    };

    return (
        <div className="relative z-10 w-full max-w-[min(90vw,400px)] aspect-[3/4.5] md:aspect-3/4 max-h-[70vh] md:h-[65vh]">
            <AnimatePresence mode="popLayout">
                {profiles.length > 0 ? (
                    profiles.map((profile, index) => (
                        <SwipeCard
                            key={profile.userId}
                            profile={profile}
                            active={index === profiles.length - 1}
                            onSwipe={handleSwipe}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 bg-white/5 rounded-3xl border border-white/10 p-6 md:p-8 backdrop-blur-sm animate-in fade-in duration-500">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mb-2">
                            <RefreshCw className={`w-8 h-8 md:w-10 md:h-10 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No more profiles</h3>
                            <p className="text-sm md:text-base text-gray-400">
                                Check back later for new people nearby.
                            </p>
                        </div>
                        <Button onClick={refreshFeed} disabled={isLoading} className="mt-4">
                            {isLoading ? 'Refreshing...' : 'Refresh Feed'}
                        </Button>
                    </div>
                )}
            </AnimatePresence>

            {profiles.length > 0 && (
                <div className="absolute -bottom-16 left-0 right-0 text-center">
                    <p className="text-stone-500 text-xs md:text-sm animate-pulse font-medium">
                        Swipe right to like • Swipe left to pass
                    </p>
                </div>
            )}
        </div>
    );
}
