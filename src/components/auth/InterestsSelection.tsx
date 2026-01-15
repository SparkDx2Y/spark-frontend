'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { getInterests, updateInterests } from '@/services/profileService';
import { InterestCategoryWithInterests, InterestResponse } from '@/types/profile/response';
import { showSuccess, showError } from '@/utils/toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials } from '@/store/features/auth/authSlice';

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
                const data = await getInterests();
                setInterests(data);
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
                        isInterestsSelected: response.isInterestsSelected
                    }
                }));
            }

            showSuccess('Preferences saved!');
            router.push('/user/home');
        } catch (error: any) {
            showError(error.response?.data?.message || 'Failed to save interests');
        } finally {
            setSaving(false);
        }
    };

    // Flatten all interests for a simple "Cloud" view
    const allInterests = interests;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
                <p className="mt-6 text-gray-400 font-medium animate-pulse">Curating matches for you...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-4 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent"
                >
                    What are you into?
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-lg"
                >
                    Select at least 3 interests to find your perfect match.
                </motion.p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-16">
                {allInterests.map((interest, index) => (
                    <motion.button
                        key={interest.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => toggleInterest(interest.id)}
                        className={`
                            px-6 py-3 rounded-full border transition-all duration-300 text-sm font-medium flex items-center gap-2
                            ${selectedInterests.includes(interest.id)
                                ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] scale-105'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/10'
                            }
                        `}
                    >
                        {selectedInterests.includes(interest.id) && (
                            <Check className="w-4 h-4" />
                        )}
                        {interest.name}
                    </motion.button>
                ))}
            </div>

            <div className="flex flex-col items-center gap-8">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saving || selectedInterests.length < 3}
                    className="px-12 py-4 bg-primary text-white rounded-full font-bold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {saving ? 'Saving...' : 'Continue to Spark'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium tracking-wide uppercase">
                    <Sparkles className="w-4 h-4 text-primary/60" />
                    <span>Personalizing your Spark experience</span>
                </div>
            </div>
        </div>
    );
}
