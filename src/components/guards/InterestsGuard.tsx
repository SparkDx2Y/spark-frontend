'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function InterestsGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!loading && isAuthenticated && user) {
            if (!user.isProfileCompleted) {
                router.replace('/complete-profile');
            } else if (!user.isInterestsSelected && user.role === 'user') {
                router.replace('/interests');
            }
        }
    }, [user, isAuthenticated, loading, router]);

    return <>{children}</>;
}
