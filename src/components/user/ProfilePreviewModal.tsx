'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';
import { ProfileResponse } from '@/types/profile/response';
import { getPublicProfile } from '@/services/profileService';
import { swipeAction } from '@/services/matchService';
import { useAppSelector } from '@/store/hooks';
import { showSuccess, showError } from '@/utils/toast';

interface ProfilePreviewModalProps {
    userId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfilePreviewModal({ userId, isOpen, onClose }: ProfilePreviewModalProps) {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [swiping, setSwiping] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const currentUser = useAppSelector((state) => state.auth.user);
    const myInterests = currentUser?.interests || [];

    useEffect(() => {
        if (isOpen && userId) {
            const fetchProfile = async () => {
                try {
                    setLoading(true);
                    const response = await getPublicProfile(userId);
                    setProfile(response.data);
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                    showError("Failed to load profile details");
                    onClose();
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        } else {
            setProfile(null);
            setCurrentPhotoIndex(0);
        }
    }, [isOpen, userId, onClose]);

    const displayPhotos = useMemo(() => {
        if (!profile) return [];
        return [
            ...(profile.profilePhoto ? [profile.profilePhoto] : []),
            ...(profile.photos || [])
        ];
    }, [profile]);

    const sortedInterests = useMemo(() => {
        if (!profile?.interests || profile.interests.length === 0) return [];
        const shared: string[] = [];
        const others: string[] = [];

        profile.interests.forEach(interest => {
            if (typeof interest === 'string') {
                if (myInterests.includes(interest)) shared.push(interest);
                else others.push(interest);
            } else if (interest && typeof interest === 'object' && 'name' in interest) {
                // If it's the interest object from backend
                const name = (interest as any).name;
                if (myInterests.includes(name)) shared.push(name);
                else others.push(name);
            }
        });

        return [...shared, ...others];
    }, [profile, myInterests]);

    const handleAction = async (action: 'like' | 'pass') => {
        if (!userId || swiping) return;

        try {
            setSwiping(true);
            const response = await swipeAction({ targetId: userId, action });

            if (action === 'like') {
                if (response.data.isMatch) {
                    showSuccess("It's a Match!");
                } else {
                    showSuccess("Liked!");
                }
            } else {
                showSuccess("Passed");
            }
            onClose();
        } catch (error) {
            console.error("Swipe action failed", error);
            showError("Something went wrong");
        } finally {
            setSwiping(false);
        }
    };

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (displayPhotos.length > 1 && currentPhotoIndex < displayPhotos.length - 1) {
            setCurrentPhotoIndex(prev => prev + 1);
        }
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex(prev => prev - 1);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
            <div className="relative -m-8 h-[70vh] md:h-[65vh] overflow-hidden bg-gray-900 group">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : profile ? (
                    <>
                        {/* Profile Photo */}
                        <div className="relative h-full w-full">
                            <Image
                                src={displayPhotos[currentPhotoIndex] || "/placeholder-user.png"}
                                alt={profile.name}
                                fill
                                className="object-cover"
                                unoptimized
                            />

                            {/* Navigation Overlays */}
                            <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/60 to-transparent pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />


                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all z-50 border border-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Photo Indicators */}
                            {displayPhotos.length > 1 && (
                                <div className="absolute top-4 inset-x-4 flex gap-1.5 z-40 px-10">
                                    {displayPhotos.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i === currentPhotoIndex ? "bg-white" : "bg-white/30"}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Click areas for photos */}
                            <div className="absolute inset-0 flex z-30">
                                <div className="w-1/2 h-full cursor-pointer" onClick={prevPhoto} />
                                <div className="w-1/2 h-full cursor-pointer" onClick={nextPhoto} />
                            </div>

                            {/* Info Section */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-40 space-y-3">
                                <div>
                                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                                        {profile.name}, <span className="font-medium opacity-90">{profile.age}</span>
                                    </h2>
                                    <p className="text-gray-200 flex items-center gap-2 text-sm font-medium">
                                        <MapPin className="w-4 h-4" />
                                        {profile.distanceKm || 'Nearby'}
                                    </p>
                                </div>

                                {/* Interests */}
                                {sortedInterests.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {sortedInterests.slice(0, 4).map((interest) => {
                                            const isShared = myInterests.includes(interest);
                                            return (
                                                <span
                                                    key={interest}
                                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isShared
                                                        ? 'bg-primary/20 border-primary/40 text-primary'
                                                        : 'bg-white/10 border-white/20 text-white'
                                                        }`}
                                                >
                                                    {interest}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {!profile.hasSwiped && (
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            disabled={swiping}
                                            onClick={() => handleAction('pass')}
                                            className="flex-1 py-3 bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 rounded-xl transition-all duration-300 group/btn"
                                        >
                                            <X className="w-6 h-6 mx-auto text-white group-hover/btn:scale-110 transition" />
                                        </button>
                                        <button
                                            disabled={swiping}
                                            onClick={() => handleAction('like')}
                                            className="flex-2 py-3 bg-linear-to-r from-primary to-purple-600 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,51,102,0.4)] flex items-center justify-center gap-2 group/btn"
                                        >
                                            {swiping ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Heart className="w-5 h-5 fill-white group-hover/btn:scale-110 transition" />
                                                    <span className="font-bold text-sm uppercase tracking-wider">Like Back</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}


                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </Modal>
    );
}
