'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!loading && isAuthenticated && user) {
        
            if (!user.isProfileCompleted) {
                router.replace('/complete-profile');
            } else if (!user.isInterestsSelected && user.role === 'user') {
                router.replace('/interests');
            } else if (!user.isLocationCompleted && user.role === 'user') {
                router.replace('/location');
            } else {
                router.replace('/user/home');
            }
        }
    }, [isAuthenticated, loading, user, router]);

   
    if (loading || isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}