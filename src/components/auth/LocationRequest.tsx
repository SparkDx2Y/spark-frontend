'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { updateLocation } from '@/services/profileService';
import { showSuccess, showError } from '@/utils/toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials } from '@/store/features/auth/authSlice';
import Button from '@/components/ui/Button';

export default function LocationRequest() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);

    const handleEnableLocation = () => {
        setLoading(true);
        if (!navigator.geolocation) {
            showError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await updateLocation(latitude, longitude);

                    if (user) {
                        dispatch(setCredentials({
                            user: {
                                ...user,
                                isLocationCompleted: response.isLocationCompleted
                            }
                        }));
                    }

                    showSuccess("Location enabled successfully!");
                    router.push('/user/home');
                } catch (error: any) {
                    showError(error.response?.data?.message || "Failed to update location");
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error(error);
                showError("Please enable location access to continue");
                setLoading(false);
            }
        );
    };

    return (
        <div className="w-full space-y-6 flex flex-col items-center text-center">

            <div className="space-y-4">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-linear-to-tr from-primary/20 via-primary/10 to-transparent rounded-full flex items-center justify-center mx-auto ring-1 ring-primary/30 shadow-[0_0_40px_-10px_rgba(255,75,125,0.3)]"
                >
                    <MapPin className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(255,75,125,0.5)]" />
                </motion.div>

                <div className="space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-extrabold bg-linear-to-b from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tight"
                    >
                        Enable Location
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-sm md:text-base max-w-sm mx-auto font-medium opacity-80"
                    >
                        We need your location to find matches near you. You can change this later in settings.
                    </motion.p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-md w-full space-y-4"
            >
                <Button
                    onClick={handleEnableLocation}
                    disabled={loading}
                    className="w-full group relative overflow-hidden"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? 'Enabling...' : 'Enable Location'}
                        {!loading && <Navigation className="w-4 h-4 transition-transform group-hover:rotate-45" />}
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>

                <p className="text-xs text-gray-600 font-medium">
                    Your location is only used to suggest potential matches.
                </p>
            </motion.div>
        </div>
    );
}
