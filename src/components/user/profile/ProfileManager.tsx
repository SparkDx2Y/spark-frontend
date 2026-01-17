'use client';

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { updateProfile } from "@/services/profileService";
import { uploadFile, uploadMultipleFiles } from "@/services/fileService";
import { ProfileResponse } from "@/types/profile/response";
import { showError, showSuccess } from "@/utils/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/features/auth/authSlice";

interface ProfileManagerProps {
    initialProfile: ProfileResponse;
}

export default function ProfileManager({ initialProfile }: ProfileManagerProps) {
    // ✅ Initialize state WITH the server-fetched data
    const [profile, setProfile] = useState<ProfileResponse>(initialProfile);
    const [saving, setSaving] = useState({ avatar: false, cover: false, gallery: false });

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

    const getErrorMessage = (error: unknown) => {
        if (typeof error === "object" && error !== null) {
            const maybeResponse = error as { response?: { data?: { message?: string } } };
            if (maybeResponse.response?.data?.message) {
                return maybeResponse.response.data.message;
            }
        }
        if (error instanceof Error) {
            return error.message;
        }
        return "Unexpected error occurred";
    };

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
                ...response.profile,
                photos: response.profile.photos ?? prev.photos ?? []
            }));

            updateAuthPhoto(url);
            showSuccess("Profile photo updated");
        } catch (error: unknown) {
            showError(getErrorMessage(error));
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
                ...response.profile,
                photos: response.profile.photos ?? prev.photos ?? []
            }));
            showSuccess("Cover photo updated");
        } catch (error: unknown) {
            showError(getErrorMessage(error));
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
                ...response.profile,
                photos: response.profile.photos ?? prev.photos ?? []
            }));
            showSuccess("Gallery updated");
        } catch (error: unknown) {
            showError(getErrorMessage(error));
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
                ...response.profile,
                photos: response.profile.photos ?? prev.photos ?? []
            }));

            showSuccess("Photo removed");
        } catch (error: unknown) {
            showError(getErrorMessage(error));
        } finally {
            setSaving((prev) => ({ ...prev, gallery: false }));
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
                            <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 text-sm">
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
        </div>
    );
}
