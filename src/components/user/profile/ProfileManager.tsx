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
import { MapPin, Sparkles, X, Check, Edit2 } from "lucide-react";


interface ProfileManagerProps {
    initialProfile: ProfileResponse;
}

export default function ProfileManager({ initialProfile }: ProfileManagerProps) {
    //  Initialize state WITH the server-fetched data
    const [profile, setProfile] = useState<ProfileResponse>(initialProfile);
    const [saving, setSaving] = useState({ avatar: false, cover: false, gallery: false, location: false, interests: false, bio: false });
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [tempBio, setTempBio] = useState(initialProfile.bio || "");

    // Interests state
    const [showInterestModal, setShowInterestModal] = useState(false);
    const [allInterests, setAllInterests] = useState<InterestResponse[]>([]);
    const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);
    const [loadingInterests, setLoadingInterests] = useState(false);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);


    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);

    /**
     * One-time sync with Redux on mount to ensure Header/Sidebar matches the server data.
     */
    useEffect(() => {
        if (initialProfile.profilePhoto && authUser && authUser.profilePhoto !== initialProfile.profilePhoto) {
            dispatch(setCredentials({
                user: { ...authUser, profilePhoto: initialProfile.profilePhoto }
            }));
        }
    }, []);

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
                    <Image src={profile.coverPhoto} alt="Cover" fill className="object-cover" unoptimized />
                ) : (
                    <div className="w-full h-full bg-linear-to-r from-primary/20 to-purple-600/20" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
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
            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24 relative z-20">
                <div className="bg-zinc-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 p-6 md:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />

                    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                        <div className="relative w-32 h-32 md:w-44 md:h-44 mx-auto md:mx-0 rounded-[2.5rem] border-4 border-neutral-900 overflow-hidden shadow-2xl bg-neutral-800 shrink-0">
                            {profile.profilePhoto || profile.photos?.[0] ? (
                                <Image
                                    src={profile.profilePhoto || profile.photos?.[0]}
                                    alt="Profile photo"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                                    {profile.name?.[0]?.toUpperCase() || "U"}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={saving.avatar}
                                className="absolute bottom-2 right-2 rounded-full bg-primary text-white p-2 shadow-lg hover:scale-105 transition"
                            >
                                {saving.avatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                            </button>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleAvatarChange(file);
                                    e.target.value = "";
                                }}
                            />
                        </div>

                        <div className="flex-1 space-y-3 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 flex-wrap">
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{authUser?.name || profile.name}</h1>
                                <div className="flex gap-2 w-full justify-center md:w-auto md:justify-start">
                                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs md:text-sm border border-white/10 whitespace-nowrap">
                                        {profile.age ? `${profile.age} yrs` : "Age not set"}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs md:text-sm border border-primary/30 whitespace-nowrap">
                                        {profile.gender || "Gender not set"}
                                    </span>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-200 text-xs md:text-sm border border-purple-500/30">
                                    Interested in {profile.interestedIn || "—"}
                                </span>
                            </div>

                            {/* Bio Section */}
                            <div className="relative pt-2">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">About Me</h3>
                                    {!isEditingBio && (
                                        <button
                                            onClick={() => setIsEditingBio(true)}
                                            className="p-1 hover:bg-white/10 rounded-full text-primary transition-colors"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {isEditingBio ? (
                                    <div className="space-y-3 max-w-lg mx-auto md:mx-0">
                                        <textarea
                                            value={tempBio}
                                            onChange={(e) => setTempBio(e.target.value)}
                                            placeholder="Write something interesting about yourself..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all resize-none min-h-[100px]"
                                            maxLength={500}
                                        />
                                        <div className="flex justify-center md:justify-start gap-2 text-xs text-gray-400 mb-1">
                                            {tempBio.length}/500 characters
                                        </div>
                                        <div className="flex justify-center md:justify-start gap-3">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    setIsEditingBio(false);
                                                    setTempBio(profile.bio || "");
                                                }}
                                                className="text-xs py-1.5 px-4 h-auto"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSaveBio}
                                                disabled={saving.bio}
                                                className="text-xs py-1.5 px-6 h-auto min-w-[100px]"
                                            >
                                                {saving.bio ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save Bio"}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-300 text-sm leading-relaxed max-w-lg mx-auto md:mx-0 italic">
                                        {profile.bio ? `"${profile.bio}"` : "Click the edit icon to add a bio and tell others about yourself!"}
                                    </p>
                                )}
                            </div>

                            <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 text-sm pt-2">
                                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                                Keep your photos updated for better visibility.
                            </p>
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
                            <Image src={url} alt={`Photo ${index + 1}`} fill className="object-cover" unoptimized />

                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/60 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(index)}
                                        disabled={saving.gallery}
                                        className="p-2 rounded-xl bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-red-500 transition-all active:scale-95 shadow-lg disabled:opacity-50"
                                        title="Remove photo"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 left-2">
                                    <span className="text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg uppercase tracking-widest border border-white/5">
                                        Photo {index + 1}
                                    </span>
                                </div>
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

        </div>
    );
}

