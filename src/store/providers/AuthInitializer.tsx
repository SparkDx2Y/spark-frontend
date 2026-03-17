'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { getCurrentUser } from '@/services/authService';
import { setCredentials, setLoading } from '@/store/features/auth/authSlice';
import { useAppSelector } from '@/store/hooks';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (user) {
            setIsInitialized(true);
            return;
        }


        const initAuth = async () => {
            try {
                dispatch(setLoading(true));
                const response = await getCurrentUser();

                if (response.data && response.data.user) {
                    dispatch(setCredentials({
                        user: {
                            ...response.data.user,
                            interests: response.data.user.interests || []
                        }
                    }));
                }
            } catch (error) {
                console.error('AuthInitializer: Failed to fetch user', error);
            } finally {
                dispatch(setLoading(false));
                setIsInitialized(true);
            }
        };

        initAuth();
    }, [isAuthenticated, dispatch, user]);

    //  show a global loader while loading
    if (!isInitialized) {
        return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>;
    }

    return <>{children}</>;
}
