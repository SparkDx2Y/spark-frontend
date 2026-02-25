'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Heart } from 'lucide-react';
import { getInterests, updateInterests } from '@/services/profileService';
import { InterestResponse } from '@/types/profile/response';
import { showSuccess, showError, handleApiError } from '@/utils/toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials } from '@/store/features/auth/authSlice';
import Button from '@/components/ui/Button';

export default function InterestsSelection() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [interests, setInterests] = useState<InterestResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await getInterests();
                setInterests(response.data);
            } catch (error) {
                showError('Failed to load interests');
            } finally {
                setLoading(false);
            }
        };
        fetchInterests();
    }, []);

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (selectedInterests.length < 3) {
            showError('Please select at least 3 interests');
            return;
        }

        setSaving(true);
        try {
            const response = await updateInterests(selectedInterests);

            if (user) {
                dispatch(setCredentials({
                    user: {
                        ...user,
                        isInterestsSelected: response.data.isInterestsSelected
                    }
                }));
            }

            showSuccess('Preferences saved!');
            router.push('/location');
        } catch (error: unknown) {
            handleApiError(error, 'Failed to save interests');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Heart className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
                </div>
                <p className="mt-6 text-gray-400 font-medium animate-pulse italic">Curating matches for you...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            <div className="text-center space-y-3">
                <div className="space-y-1">

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-extrabold bg-linear-to-b from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tight"
                    >
                        What are you into?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-sm md:text-base max-w-sm mx-auto font-medium opacity-80"
                    >
                        You like what you like. Now, let everyone know.
                    </motion.p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto px-1 py-4 custom-scrollbar">
                {interests.map((interest, index) => (
                    <motion.button
                        key={interest.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01 }}
                        onClick={() => toggleInterest(interest.id)}
                        className={`
                            group relative px-4 py-3.5 rounded-xl border transition-all duration-500 text-xs font-semibold flex items-center justify-center gap-2
                            backdrop-blur-xl
                            ${selectedInterests.includes(interest.id)
                                ? 'bg-primary border-primary text-white shadow-[0_10px_25px_-5px_rgba(255,75,125,0.5)] scale-[1.02]'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/10 hover:text-white hover:shadow-xl'
                            }
                        `}
                    >
                        <AnimatePresence mode="wait">
                            {selectedInterests.includes(interest.id) && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 45 }}
                                >
                                    <Check className="w-3.5 h-3.5 stroke-3" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <span className="relative z-10">{interest.name}</span>

                        {!selectedInterests.includes(interest.id) && (
                            <div className="absolute inset-0 rounded-xl bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="space-y-8 pt-4">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`h-1.5 w-8 rounded-full transition-all duration-500 ${selectedInterests.length >= step ? 'bg-primary w-12 shadow-[0_0_10px_rgba(255,75,125,0.5)]' : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${selectedInterests.length >= 3 ? 'text-primary' : 'text-gray-500'}`}>
                        {selectedInterests.length} / 3 selected
                    </span>
                </div>

                <div className="max-w-md mx-auto w-full">
                    <Button
                        onClick={handleSave}
                        disabled={saving || selectedInterests.length < 3}
                    >
                        {saving ? 'Saving...' : `Save & Continue`}
                    </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-medium tracking-widest uppercase opacity-40">
                    <div className="h-px w-8 bg-white/10" />
                    <span>Personalizing your experience</span>
                    <div className="h-px w-8 bg-white/10" />
                </div>
            </div>
        </div>
    );

}

