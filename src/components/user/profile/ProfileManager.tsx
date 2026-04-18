'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { updateProfile } from "@/services/profileService";
import { uploadFile, uploadMultipleFiles } from "@/services/fileService";
import { ProfileResponse } from "@/types/profile/response";
import { showError, showSuccess, handleApiError } from "@/utils/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/features/auth/authSlice";
import { getInterests, updateInterests, updateLocation } from "@/services/profileService";
import { InterestResponse } from "@/types/profile/response";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, X, Check, Edit2, ChevronLeft, ChevronRight, Video, CameraIcon } from "lucide-react";
import VideoRecorderModal from "./VideoRecorderModal";
import VideoTrimmerModal from "./VideoTrimmerModal";


interface ProfileManagerProps {
    initialProfile: ProfileResponse;
}

export default function ProfileManager({ initialProfile }: ProfileManagerProps) {
    //  Initialize state WITH the server-fetched data
    const [profile, setProfile] = useState<ProfileResponse>(initialProfile);
    const [saving, setSaving] = useState({ avatar: false, cover: false, gallery: false, location: false, interests: false, bio: false, vibe: false });
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [tempBio, setTempBio] = useState(initialProfile.bio || "");

    // Interests state
    const [showInterestModal, setShowInterestModal] = useState(false);
    const [allInterests, setAllInterests] = useState<InterestResponse[]>([]);
    const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);
    const [loadingInterests, setLoadingInterests] = useState(false);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const [isRecorderOpen, setIsRecorderOpen] = useState(false);
    const [isVibeSelectionOpen, setIsVibeSelectionOpen] = useState(false);
    const [isTrimmerOpen, setIsTrimmerOpen] = useState(false);
    const [trimmerFile, setTrimmerFile] = useState<File | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const vibeInputRef = useRef<HTMLInputElement>(null);


    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (initialProfile.profilePhoto && authUser && authUser.profilePhoto !== initialProfile.profilePhoto) {
            dispatch(setCredentials({
                user: { ...authUser, profilePhoto: initialProfile.profilePhoto }
            }));
        }
    }, [authUser, dispatch, initialProfile.profilePhoto]);

    const updateAuthPhoto = (photoUrl: string | null) => {
        if (!authUser) return;
        dispatch(setCredentials({ user: { ...authUser, profilePhoto: photoUrl } }));
    };

    const handleAvatarChange = async (file: File) => {
        try {
            setSaving((prev) => ({ ...prev, avatar: true }));
            const url = await uploadFile(file);
            const response = await updateProfile({ profilePhoto: url });

            setProfile((prev) => ({
                ...prev,
                ...response.data.profile,
                photos: response.data.profile.photos ?? prev.photos ?? []
            }));

            updateAuthPhoto(url);
            showSuccess("Profile photo updated");
        } catch (error: unknown) {
            handleApiError(error, "Failed to update profile photo");
        } finally {
            setSaving((prev) => ({ ...prev, avatar: false }));
        }
    };

    const handleCoverChange = async (file: File) => {
        try {
            setSaving((prev) => ({ ...prev, cover: true }));
            const url = await uploadFile(file);
            const response = await updateProfile({ coverPhoto: url });
            setProfile((prev) => ({
                ...prev,
                ...response.data.profile,
                photos: response.data.profile.photos ?? prev.photos ?? []
            }));
            showSuccess("Cover photo updated");
        } catch (error: unknown) {
            handleApiError(error, "Failed to update cover photo");
        } finally {
            setSaving((prev) => ({ ...prev, cover: false }));
        }
    };

    const handleVibeChange = async (file: File) => {
        // Standard size check (50MB)
        if (file.size > 50 * 1024 * 1024) return showError("Video must be under 50MB");

        try {
            // Check Duration
            const duration = await new Promise<number>((resolve) => {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = () => {
                    URL.revokeObjectURL(video.src);
                    resolve(video.duration);
                };
                video.src = URL.createObjectURL(file);
            });

            // If video is long, open trimmer
            if (duration > 16) { 
                setTrimmerFile(file);
                setIsTrimmerOpen(true);
                return;
            }

            // Otherwise upload directly
            setSaving((prev) => ({ ...prev, vibe: true }));
            const url = await uploadFile(file);
            const response = await updateProfile({ vibeVideo: url });
            
            setProfile((prev) => ({
                ...prev,
                ...response.data.profile
            }));
            
            showSuccess("Vibe clip updated!");
        } catch (error: unknown) {
            handleApiError(error, "Failed to update vibe clip");
        } finally {
            setSaving((prev) => ({ ...prev, vibe: false }));
        }
    };

    const handleTrimComplete = async (startTime: number) => {
        if (!trimmerFile) return;
        
        try {
            setIsTrimmerOpen(false);
            setSaving((prev) => ({ ...prev, vibe: true }));
            
            const url = await uploadFile(trimmerFile, startTime);
            const response = await updateProfile({ vibeVideo: url });
            
            setProfile((prev) => ({
                ...prev,
                ...response.data.profile
            }));
            
            showSuccess("Vibe clip trimmed and updated!");
            setTrimmerFile(null);
        } catch (error: unknown) {
            handleApiError(error, "Failed to save trimmed video");
        } finally {
            setSaving((prev) => ({ ...prev, vibe: false }));
        }
    };

    const handleRemoveVibe = async () => {
        try {
            setSaving((prev) => ({ ...prev, vibe: true }));
            const response = await updateProfile({ vibeVideo: "" });
            
            setProfile((prev) => ({
                ...prev,
                ...response.data.profile
            }));
            
            showSuccess("Vibe clip removed");
        } catch (error: unknown) {
            handleApiError(error, "Failed to remove vibe clip");
        } finally {
            setSaving((prev) => ({ ...prev, vibe: false }));
        }
    };

    const handleRecordComplete = async (videoBlob: Blob) => {
        try {
            setSaving((prev) => ({ ...prev, vibe: true }));
            // Convert blob to file for standard upload
            const file = new File([videoBlob], `vibe_${Date.now()}.webm`, { type: 'video/webm' });
            const url = await uploadFile(file);
            const response = await updateProfile({ vibeVideo: url });
            
            setProfile((prev) => ({
                ...prev,
                ...response.data.profile
            }));
            
            showSuccess("Vibe clip recorded!");
        } catch (error: unknown) {
            handleApiError(error, "Failed to save transition");
        } finally {
            setSaving((prev) => ({ ...prev, vibe: false }));
        }
    };

    const handleGalleryAdd = async (files: FileList) => {
        const currentCount = profile.photos?.length || 0;
        const remainingSlots = Math.max(0, 6 - currentCount);

        if (remainingSlots === 0) {
            showError("You can only keep up to 6 photos");
            return;
        }

        const selectedFiles = Array.from(files).slice(0, remainingSlots);
        if (selectedFiles.length === 0) return;

        try {
            setSaving((prev) => ({ ...prev, gallery: true }));
            const urls = await uploadMultipleFiles(selectedFiles);
            const updatedPhotos = [...(profile.photos || []), ...urls];

            const response = await updateProfile({ photos: updatedPhotos });

            setProfile((prev) => ({
                ...prev,
                ...response.data.profile,
                photos: response.data.profile.photos ?? prev.photos ?? []
            }));
            showSuccess("Gallery updated");
        } catch (error: unknown) {
            handleApiError(error, "Failed to update gallery");
        } finally {
            setSaving((prev) => ({ ...prev, gallery: false }));
        }
    };

    const handleRemovePhoto = async (index: number) => {
        const updatedPhotos = profile.photos?.filter((_, i) => i !== index) || [];

        try {
            setSaving((prev) => ({ ...prev, gallery: true }));
            const response = await updateProfile({ photos: updatedPhotos });

            setProfile((prev) => ({
                ...prev,
                ...response.data.profile,
                photos: response.data.profile.photos ?? prev.photos ?? []
            }));

            showSuccess("Photo removed");
        } catch (error: unknown) {
            handleApiError(error, "Failed to remove photo");
        } finally {
            setSaving((prev) => ({ ...prev, gallery: false }));
        }
    };

    // ------------------------------------------
    // Location Logic
    // ------------------------------------------
    const handleUpdateLocation = () => {
        if (!navigator.geolocation) {
            showError("Geolocation is not supported by your browser");
            return;
        }

        setSaving(prev => ({ ...prev, location: true }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    await updateLocation(latitude, longitude);
                    showSuccess("Location updated successfully!");
                } catch (error: unknown) {
                    handleApiError(error, "Failed to update location");
                } finally {
                    setSaving(prev => ({ ...prev, location: false }));
                }
            },
            (error) => {
                console.error(error);
                showError("Please enable location access to continue");
                setSaving(prev => ({ ...prev, location: false }));
            }
        );
    };

    // ------------------------------------------
    // Interests Logic
    // ------------------------------------------
    const openInterestModal = async () => {
        setShowInterestModal(true);
        if (allInterests.length === 0) {
            setLoadingInterests(true);
            try {
                const response = await getInterests();
                setAllInterests(response.data);

                // Map current profile interest names to IDs
                const currentInterestNames = profile.interests || [];
                const currentIds = response.data
                    .filter(i => currentInterestNames.includes(i.name))
                    .map(i => i.id);

                setSelectedInterestIds(currentIds);
            } catch (error: unknown) {
                handleApiError(error, "Failed to load interests");
            } finally {
                setLoadingInterests(false);
            }
        } else {
            // Reset selection to current profile state if re-opening without saving
            const currentInterestNames = profile.interests || [];
            const currentIds = allInterests
                .filter(i => currentInterestNames.includes(i.name))
                .map(i => i.id);
            setSelectedInterestIds(currentIds);
        }
    };

    const toggleInterest = (id: string) => {
        setSelectedInterestIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSaveInterests = async () => {
        if (selectedInterestIds.length < 3) {
            showError('Please select at least 3 interests');
            return;
        }

        setSaving(prev => ({ ...prev, interests: true }));
        try {
            const response = await updateInterests(selectedInterestIds);

            setProfile(prev => ({
                ...prev,
                ...response.data.profile,
                interests: response.data.profile.interests ?? prev.interests ?? []
            }));

            // Sync with Redux if needed
            if (authUser) {
                dispatch(setCredentials({
                    user: {
                        ...authUser,
                        isInterestsSelected: true,
                        interests: response.data.profile.interests
                    }
                }));
            }

            showSuccess('Interests updated!');
            setShowInterestModal(false);
        } catch (error: unknown) {
            handleApiError(error, "Failed to update interests");
        } finally {
            setSaving(prev => ({ ...prev, interests: false }));
        }
    };

    const handleSaveBio = async () => {
        if (tempBio === profile.bio) {
            setIsEditingBio(false);
            return;
        }

        try {
            setSaving(prev => ({ ...prev, bio: true }));
            const response = await updateProfile({ bio: tempBio });

            setProfile(prev => ({
                ...prev,
                bio: response.data.profile.bio
            }));

            setIsEditingBio(false);
            showSuccess("Bio updated!");
        } catch (error) {
            handleApiError(error, "Failed to update bio");
        } finally {
            setSaving(prev => ({ ...prev, bio: false }));
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white">
            <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-black pointer-events-none" />

            {/* Cover section */}
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-b-3xl border border-white/5">
                {profile.coverPhoto ? (
                    <Image
                        src={profile.coverPhoto}
                        alt="Cover"
                        fill
                        className="object-cover hover:scale-[1.02] transition-transform duration-700"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-r from-primary/20 to-purple-600/20" />
                )}
                <div 
                    className={`absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent ${profile.coverPhoto ? 'cursor-pointer' : ''}`} 
                    onClick={() => {
                        if (profile.coverPhoto) {
                            setPreviewImage(profile.coverPhoto);
                            setPreviewIndex(null);
                        }
                    }}
                />
                <div className="absolute top-6 right-6 z-30">
                    <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={saving.cover}
                        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-primary backdrop-blur-3xl border border-white/20 text-white rounded-full transition-all active:scale-90 shadow-2xl group"
                        title="Change cover photo"
                    >
                        {saving.cover ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5 transition-transform group-hover:rotate-12" />}
                    </button>
                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCoverChange(file);
                            e.target.value = "";
                        }}
                    />
                </div>
            </div>

            {/* Profile header */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-20 md:-mt-28 relative z-30">
                <div className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]">
                    {/* Animated background accent */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-5 md:p-8">
                        {/* Hero Media Section (The "Identity Slot") */}
                        <div className="relative w-full md:w-52 lg:w-56 shrink-0">
                            {/* Main Vibe Container */}
                            <div className="relative aspect-4/5 rounded-[1.75rem] overflow-hidden bg-zinc-800/50 border border-white/5 shadow-2xl group/hero">
                                {profile.vibeVideo ? (
                                    <video
                                        src={profile.vibeVideo || undefined}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/2 text-white/20 gap-3 border-2 border-dashed border-white/5 rounded-[1.75rem]">
                                        <div className="p-3 rounded-full bg-white/5">
                                            <Video className="w-6 h-6 opacity-30" />
                                        </div>
                                        <p className="text-[9px] uppercase tracking-[0.2em] font-bold">Add Vibe</p>
                                    </div>
                                )}

                                {saving.vibe && (
                                    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center backdrop-blur-2xl bg-white/5">
                                        <div className="relative w-12 h-12">
                                            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                                        </div>
                                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white animate-pulse text-center px-4 drop-shadow-lg">Processing Vibe...</p>
                                    </div>
                                )}

                                {/* Tap-to-Preview Vibe Trigger (Background layer) */}
                                <div 
                                    className="absolute inset-0 cursor-pointer z-10" 
                                    onClick={() => {
                                        setPreviewImage(profile.vibeVideo || null);
                                        setPreviewIndex(null);
                                    }}
                                />

                                {/* Floating Vibe Controls (Hover Triggered) */}
                                <div className="absolute top-4 right-4 flex flex-col items-end gap-2 opacity-100 md:opacity-0 md:group-hover/hero:opacity-100 transition-all duration-300 z-50">
                                    <div className="flex flex-row-reverse items-center gap-2">
                                        <div className="pointer-events-auto">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsVibeSelectionOpen(!isVibeSelectionOpen);
                                                }}
                                                className="h-10 w-10 rounded-full bg-black/60 hover:bg-primary backdrop-blur-3xl border border-white/20 text-white shadow-xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center"
                                                title="Add Vibe"
                                            >
                                                <Video className="w-5 h-5 shadow-sm" />
                                            </button>
                                        </div>

                                        {/* Selection Dropdown (Miniature - Compact) */}
                                        <AnimatePresence mode="wait">
                                            {isVibeSelectionOpen && (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="h-8 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-full px-2 shadow-2xl flex items-center gap-1 pointer-events-auto mr-0"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setIsVibeSelectionOpen(false);
                                                            setIsRecorderOpen(true);
                                                        }}
                                                        className="flex items-center gap-1.5 px-2 h-6 rounded-full hover:bg-white/10 text-white transition-all whitespace-nowrap group/btn"
                                                    >
                                                        <CameraIcon className="w-2.5 h-2.5 text-primary transition-transform group-hover/btn:scale-110" />
                                                        <span className="text-[8px] font-black uppercase tracking-widest">Cam</span>
                                                    </button>
                                                    <div className="w-px h-2.5 bg-white/5" />
                                                    <button
                                                        onClick={() => {
                                                            setIsVibeSelectionOpen(false);
                                                            vibeInputRef.current?.click();
                                                        }}
                                                        className="flex items-center gap-1.5 px-2 h-6 rounded-full hover:bg-white/10 text-white transition-all whitespace-nowrap group/btn"
                                                    >
                                                        <Plus className="w-2.5 h-2.5 text-gray-400 transition-transform group-hover/btn:scale-110" />
                                                        <span className="text-[8px] font-black uppercase tracking-widest">File</span>
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    
                                    {profile.vibeVideo && !isVibeSelectionOpen && (
                                        <div className="pointer-events-auto">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveVibe();
                                                }}
                                                className="h-10 w-10 rounded-full bg-black/60 hover:bg-red-500 backdrop-blur-3xl border border-white/20 text-white shadow-xl hover:scale-110 active:scale-90 transition-all flex items-center justify-center"
                                                title="Remove Vibe"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Static Avatar Overlay (Picture-in-Picture) */}
                            <div className="absolute -bottom-3 -right-3 w-20 h-20 md:w-28 md:h-28 group/avatar z-40">
                                {/* Clipped Image Container */}
                                <div className="relative w-full h-full rounded-full border-4 border-zinc-900 overflow-hidden shadow-2xl bg-neutral-800">
                                    {profile.profilePhoto ? (
                                        <Image
                                            src={profile.profilePhoto}
                                            alt="Static Profile"
                                            fill
                                            className="object-cover cursor-pointer hover:scale-110 transition-transform duration-700"
                                            unoptimized
                                            onClick={() => {
                                                setPreviewImage(profile.profilePhoto || null);
                                                setPreviewIndex(null);
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-2xl font-bold text-white/20">
                                            {profile.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Separate Floating Edit Icon (Outside the clip mask) */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        avatarInputRef.current?.click();
                                    }}
                                    className="absolute bottom-0 right-0 w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center border-2 border-zinc-900 opacity-100 md:opacity-0 md:group-hover/avatar:opacity-100 transition-all hover:scale-110 active:scale-90 z-50"
                                    title="Change Photo"
                                >
                                    {saving.avatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Hidden Inputs */}
                            <input ref={vibeInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleVibeChange(file);
                                e.target.value = "";
                            }} />
                            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleAvatarChange(file);
                                e.target.value = "";
                            }} />
                        </div>

                        {/* Profile Info Section */}
                        <div className="flex-1 flex flex-col justify-center pt-1 md:pl-4">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                                        {authUser?.name || profile.name}
                                    </h1>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold border border-white/10 uppercase tracking-widest text-gray-300">
                                            {profile.age} Years Old
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/30 uppercase tracking-widest">
                                            {profile.gender}
                                        </span>
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div className="space-y-3">
                                    {isEditingBio ? (
                                        <div className="space-y-4">
                                            <textarea
                                                value={tempBio}
                                                onChange={(e) => setTempBio(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-gray-200 focus:outline-none focus:border-primary/50 transition-all resize-none min-h-[120px] shadow-inner"
                                                maxLength={500}
                                                placeholder="What's your story?"
                                            />
                                            <div className="flex justify-end gap-3">
                                                <Button variant="ghost" onClick={() => setIsEditingBio(false)} className="text-xs">Cancel</Button>
                                                <Button onClick={handleSaveBio} disabled={saving.bio} className="text-xs px-8">Save</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="group/bio relative">
                                            <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light italic max-w-2xl">
                                                {profile.bio ? `"${profile.bio}"` : "Add a bio to complete your vibe..."}
                                            </p>
                                            <button
                                                onClick={() => setIsEditingBio(true)}
                                                className="absolute -top-1 -right-8 p-2 bg-white/5 hover:bg-primary/20 rounded-full opacity-0 group-hover/bio:opacity-100 transition-all text-primary"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Integrated Interests (Fills the 'Empty' space with valid profile content) */}
                                {profile.interests && profile.interests.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-2 max-w-xl">
                                        {profile.interests?.slice(0, 5).map((interest, i) => (
                                            <span 
                                                key={i} 
                                                className="text-[10px] font-bold uppercase tracking-widest text-white/40 border border-white/5 px-2.5 py-1 rounded-lg bg-white/2"
                                            >
                                                {interest}
                                            </span>
                                        ))}
                                        {(profile.interests?.length || 0) > 5 && (
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40 px-2 py-1">
                                                +{(profile.interests?.length || 0) - 5} More
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Gallery Section */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6 md:mt-10 pb-24 md:pb-16 relative z-10">
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">Gallery</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                    {(profile.photos || []).map((url, index) => (
                        <div key={url + index} className="relative group aspect-3/4 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-xl transition-transform duration-500 hover:scale-[1.02]">
                            <Image
                                src={url}
                                alt={`Photo ${index + 1}`}
                                fill
                                className="object-cover cursor-pointer"
                                unoptimized
                                onClick={() => {
                                    setPreviewImage(url);
                                    setPreviewIndex(index);
                                }}
                            />

                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemovePhoto(index);
                                    }}
                                    disabled={saving.gallery}
                                    className="p-2 rounded-xl bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-red-500 transition-all active:scale-95 shadow-lg disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {(profile.photos?.length || 0) < 6 && (
                        <button
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={saving.gallery}
                            className={`
                                aspect-3/4 rounded-2xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-4 relative group/add
                                ${saving.gallery ? 'border-white/5 bg-white/2 cursor-not-allowed' : 'border-white/10 bg-white/3 hover:border-primary/50 hover:bg-primary/5 cursor-pointer shadow-xl'}
                            `}
                        >
                            <input
                                ref={galleryInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        handleGalleryAdd(e.target.files);
                                        e.target.value = "";
                                    }
                                }}
                            />
                            <div className="absolute inset-0 bg-primary/0 group-hover/add:bg-primary/5 blur-3xl transition-all duration-700 pointer-events-none" />
                            <div className={`p-4 rounded-full transition-all duration-500 ${saving.gallery ? 'bg-white/5' : 'bg-primary/10 group-hover/add:bg-primary group-hover/add:scale-110 shadow-[0_0_20px_rgba(255,75,125,0.2)]'}`}>
                                {saving.gallery ? <Loader2 className="w-6 h-6 animate-spin text-gray-500" /> : <Plus className="w-6 h-6 text-primary group-hover/add:text-white" />}
                            </div>
                            <div className="text-center z-10">
                                <p className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${saving.gallery ? 'text-gray-600' : 'text-gray-400 group-hover/add:text-white'}`}>
                                    {saving.gallery ? 'Uploading...' : 'Add Photo'}
                                </p>
                            </div>
                        </button>
                    )}


                    <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files) {
                                handleGalleryAdd(e.target.files);
                                e.target.value = "";
                            }
                        }}
                    />
                </div>

                {profile.photos?.length === 0 && (
                    <div className="border border-dashed border-white/10 rounded-3xl p-16 text-center bg-white/2 mt-8">
                        <Camera className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-gray-500 font-medium italic">Create your story—add your first gallery photo.</h3>
                    </div>
                )}
            </div>

            {/* Layout for Interests & Location */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Interests Section */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            Interests
                        </h2>
                        <button
                            onClick={openInterestModal}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors text-primary"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {profile.interests && profile.interests.length > 0 ? (
                            profile.interests.map((interest, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-200"
                                >
                                    {interest}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500 italic text-sm">No interests selected yet.</p>
                        )}
                    </div>
                </div>

                {/* Location Section */}
                <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-400" />
                        Location
                    </h2>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">
                                Update your location to find matches near you.
                            </p>
                        </div>
                        <Button
                            onClick={handleUpdateLocation}
                            disabled={saving.location}
                            variant="outline"
                            className="w-full border-blue-500/30 hover:bg-blue-500/10 text-blue-400"
                        >
                            {saving.location ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                                </span>
                            ) : (
                                "Update Location"
                            )}
                        </Button>
                    </div>
                </div>

            </div>

            {/* Interest Selection Modal */}
            <AnimatePresence>
                {showInterestModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowInterestModal(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900 z-10">
                                <div>
                                    <h3 className="text-xl font-bold">Edit Interests</h3>
                                    <p className="text-sm text-gray-400">Select at least 3 interests</p>
                                </div>
                                <button
                                    onClick={() => setShowInterestModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                {loadingInterests ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {allInterests.map((interest) => (
                                            <button
                                                key={interest.id}
                                                onClick={() => toggleInterest(interest.id)}
                                                className={`
                                                    relative px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium flex items-center gap-2 text-left
                                                    ${selectedInterestIds.includes(interest.id)
                                                        ? 'bg-primary/20 border-primary text-primary'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                                                    }
                                                `}
                                            >
                                                {selectedInterestIds.includes(interest.id) && (
                                                    <Check className="w-4 h-4 shrink-0" />
                                                )}
                                                <span className="truncate">{interest.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/5 bg-zinc-900/50 backdrop-blur-md flex justify-end gap-3 z-10">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowInterestModal(false)}
                                    className="hover:bg-white/5"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveInterests}
                                    disabled={saving.interests || selectedInterestIds.length < 3}
                                    className="min-w-[120px]"
                                >
                                    {saving.interests ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-black/98">
                        {/* Immersive Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 cursor-default"
                            onClick={() => {
                                setPreviewImage(null);
                                setPreviewIndex(null);
                            }}
                        />

                        {/* Top Controls - Just Close Button */}
                        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-end z-110 bg-linear-to-b from-black/50 to-transparent">
                            <button
                                onClick={() => {
                                    setPreviewImage(null);
                                    setPreviewIndex(null);
                                }}
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div 
                            className="relative w-full flex-1 flex items-center justify-center p-4 cursor-default"
                            onClick={() => {
                                setPreviewImage(null);
                                setPreviewIndex(null);
                            }}
                        >
                            <AnimatePresence>
                                <motion.div
                                    key={previewImage}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative w-full h-full max-w-6xl flex items-center justify-center z-10 pointer-events-none"
                                >
                                    <div className="relative w-full h-full pointer-events-auto">
                                        {previewImage === profile.vibeVideo ? (
                                            <video
                                                src={previewImage || undefined}
                                                className="w-full h-full object-contain"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        ) : (
                                            <Image
                                                src={previewImage || ""}
                                                alt="Preview"
                                                fill
                                                className="object-contain"
                                                unoptimized
                                                priority
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Center Navigation Arrows */}
                            {previewIndex !== null && profile.photos && profile.photos.length > 1 && (
                                <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-4 md:px-10 z-20 pointer-events-none">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (previewIndex !== null && profile.photos) {
                                                const prevIdx = (previewIndex - 1 + profile.photos.length) % profile.photos.length;
                                                setPreviewIndex(prevIdx);
                                                setPreviewImage(profile.photos[prevIdx]);
                                            }
                                        }}
                                        className="pointer-events-auto p-4 rounded-full bg-black/40 hover:bg-white/10 text-white backdrop-blur-md border border-white/5 transition-all outline-none hover:scale-110 active:scale-90"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (previewIndex !== null && profile.photos) {
                                                const nextIdx = (previewIndex + 1) % profile.photos.length;
                                                setPreviewIndex(nextIdx);
                                                setPreviewImage(profile.photos[nextIdx]);
                                            }
                                        }}
                                        className="pointer-events-auto p-4 rounded-full bg-black/40 hover:bg-white/10 text-white backdrop-blur-md border border-white/5 transition-all outline-none hover:scale-110 active:scale-90"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Live Recorder Modal */}
            <VideoRecorderModal 
                isOpen={isRecorderOpen}
                onClose={() => setIsRecorderOpen(false)}
                onComplete={handleRecordComplete}
            />
            <VideoTrimmerModal 
                isOpen={isTrimmerOpen}
                onClose={() => setIsTrimmerOpen(false)}
                videoFile={trimmerFile}
                onComplete={handleTrimComplete}
            />
        </div>
    );
}

