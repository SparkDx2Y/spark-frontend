'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { X, Heart, MapPin, Loader2, Flag, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';
import ReportModal from './ReportModal';
import { ProfileResponse, InterestResponse } from '@/types/profile/response';
import { getPublicProfile } from '@/services/profileService';
import { swipeAction } from '@/services/matchService';
import { useAppSelector } from '@/store/hooks';
import { showSuccess, handleApiError } from '@/utils/toast';

interface ProfilePreviewModalProps {
    userId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfilePreviewModal({ userId, isOpen, onClose }: ProfilePreviewModalProps) {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [swiping, setSwiping] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const currentUser = useAppSelector((state) => state.auth.user);
    const myInterests = currentUser?.interests || [];

    useEffect(() => {
        if (isOpen && userId) {
            const fetchProfile = async () => {
                try {
                    setLoading(true);
                    const response = await getPublicProfile(userId);
                    setProfile(response.data);
                } catch (error: unknown) {
                    console.error("Failed to fetch profile", error);
                    handleApiError(error, "Failed to load profile details");
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
        const allPhotos = [
            ...(profile.profilePhoto ? [profile.profilePhoto] : []),
            ...(profile.photos || [])
        ];
        // Filter out duplicates (important if profilePhoto is also in photos array)
        return Array.from(new Set(allPhotos));
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
                const name = (interest as unknown as InterestResponse).name;
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
        } catch (error: unknown) {
            console.error("Swipe action failed", error);
            handleApiError(error, "Something went wrong");
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

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
    };

    const nextLightboxPhoto = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex < displayPhotos.length - 1) {
            setLightboxIndex(prev => prev + 1);
        }
    };

    const prevLightboxPhoto = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex > 0) {
            setLightboxIndex(prev => prev - 1);
        }
    };

    // Keyboard support for Lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;

            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowRight') nextLightboxPhoto();
            if (e.key === 'ArrowLeft') prevLightboxPhoto();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, lightboxIndex, displayPhotos.length]);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
                <div
                    className="relative -m-8 h-[70vh] md:h-[65vh] overflow-hidden bg-gray-900 group"
                    onClick={(e) => e.stopPropagation()}
                >
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
                                <div className="absolute top-4 right-4 z-110">
                                    <button
                                        onClick={onClose}
                                        className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all border border-white/10"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Report Button */}
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="absolute top-4 left-4 p-2 bg-black/40 hover:bg-red-500/60 backdrop-blur-md rounded-full text-white transition-all z-50 border border-white/10 hover:border-red-500/50"
                                    title="Report User"
                                >
                                    <Flag className="w-5 h-5" />
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

                                <div className="absolute inset-0 flex z-30">
                                    <div className="w-1/2 h-full cursor-pointer" onClick={prevPhoto} title="Previous Photo" />
                                    <div className="w-1/2 h-full cursor-pointer" onClick={nextPhoto} title="Next Photo" />
                                </div>



                                {/* Info Section */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-40 space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between w-full">
                                            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                                                {profile.name}, <span className="font-medium opacity-90">{profile.age}</span>
                                            </h2>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openLightbox(currentPhotoIndex);
                                                }}
                                                className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl text-white transition-all border border-white/10 group/zoom shadow-xl"
                                                title="Expand Photos"
                                            >
                                                <ZoomIn className="w-5 h-5 group-hover/zoom:scale-110 transition" />
                                            </button>
                                        </div>
                                        <p className="text-gray-200 flex items-center gap-2 text-sm font-medium mt-1">
                                            <MapPin className="w-4 h-4" />
                                            {profile.distanceKm || 'Nearby'}
                                        </p>
                                    </div>

                                    {/* Bio Section */}
                                    {profile.bio && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <p className="text-sm text-gray-200 leading-relaxed italic line-clamp-3">
                                                "{profile.bio}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Photo Gallery Thumbnails */}
                                    {displayPhotos.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150">
                                            {displayPhotos.map((photo, i) => (
                                                <button
                                                    key={i}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentPhotoIndex(i);
                                                    }}
                                                    className={`relative w-12 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-300 ${i === currentPhotoIndex ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-white/10 hover:border-white/30'}`}
                                                >
                                                    <Image
                                                        src={photo}
                                                        alt={`Gallery ${i}`}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}

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
                <ReportModal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    reportedUserId={userId}
                />
            </Modal>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-1000 bg-black/98 flex flex-col items-center justify-center p-4 md:p-8 select-none"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition z-1010 backdrop-blur-xl border border-white/10 shadow-2xl"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Main Image Container */}
                        <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
                            <motion.div
                                key={lightboxIndex}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={displayPhotos[lightboxIndex]}
                                    alt={`Lightbox ${lightboxIndex}`}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                    priority
                                />
                            </motion.div>

                            {/* Click areas for navigation */}
                            <div className="absolute inset-0 flex">
                                <div
                                    className="w-1/2 h-full cursor-pointer"
                                    onClick={prevLightboxPhoto}
                                    title="Previous"
                                />
                                <div
                                    className="w-1/2 h-full cursor-pointer"
                                    onClick={nextLightboxPhoto}
                                    title="Next"
                                />
                            </div>

                            {/* Navigation Buttons */}
                            {displayPhotos.length > 1 && (
                                <>
                                    <button
                                        onClick={prevLightboxPhoto}
                                        disabled={lightboxIndex === 0}
                                        className={`absolute left-0 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition ${lightboxIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={nextLightboxPhoto}
                                        disabled={lightboxIndex === displayPhotos.length - 1}
                                        className={`absolute right-0 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition ${lightboxIndex === displayPhotos.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Counter and Gallery Strip */}
                        <div className="mt-8 flex flex-col items-center gap-4 w-full">
                            <span className="text-sm font-medium text-white/60 tracking-widest uppercase">
                                {lightboxIndex + 1} / {displayPhotos.length}
                            </span>

                            <div className="flex gap-2 overflow-x-auto max-w-full pb-2 no-scrollbar px-4">
                                {displayPhotos.map((photo, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setLightboxIndex(i)}
                                        className={`relative w-12 h-16 rounded-md overflow-hidden shrink-0 border-2 transition-all duration-300 ${i === lightboxIndex ? 'border-primary scale-110 shadow-[0_0_15px_rgba(255,51,102,0.5)]' : 'border-white/10 hover:border-white/30 opcaity-60 hover:opacity-100'}`}
                                    >
                                        <Image
                                            src={photo}
                                            alt={`Gallery ${i}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
