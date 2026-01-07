'use client';

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { getMyProfile, updateProfile } from "@/services/profileService";
import { uploadFile, uploadMultipleFiles } from "@/services/fileService";
import { ProfileResponse } from "@/types/profile/response";
import { showError, showSuccess } from "@/utils/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/features/auth/authSlice";

export default function UserProfilePage() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState({ avatar: false, cover: false, gallery: false });

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);

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

    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getMyProfile();
            setProfile({ ...data, photos: data.photos || [] });
        } catch (error: unknown) {
            console.error("Failed to load profile", error);
            showError(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateAuthPhoto = (photoUrl: string | null) => {
        if (!authUser) return;
        dispatch(setCredentials({ user: { ...authUser, profilePhoto: photoUrl } }));
    };

    const handleAvatarChange = async (file: File) => {
        if (!profile) return;
        try {
            setSaving((prev) => ({ ...prev, avatar: true }));
            const url = await uploadFile(file);

            // Add new photo to the front of gallery and set as profile photo
            const updatedPhotos = [url, ...(profile.photos || [])].slice(0, 6); // Keep max 6 photos

            const response = await updateProfile({
                profilePhoto: url,
                photos: updatedPhotos,
                coverPhoto: profile.coverPhoto // Preserve cover photo
            });
            setProfile({ ...response.profile, photos: response.profile.photos || [] });
            updateAuthPhoto(url);
            showSuccess("Profile photo updated");
        } catch (error: unknown) {
            console.error("Failed to update profile photo", error);
            showError(getErrorMessage(error));
        } finally {
            setSaving((prev) => ({ ...prev, avatar: false }));
        }
    };

    const handleCoverChange = async (file: File) => {
        if (!profile) return;
        try {
            setSaving((prev) => ({ ...prev, cover: true }));
            const url = await uploadFile(file);
            const response = await updateProfile({ coverPhoto: url });
            setProfile({ ...response.profile, photos: response.profile.photos || [] });
            showSuccess("Cover photo updated");
        } catch (error: unknown) {
            console.error("Failed to update cover photo", error);
            showError(getErrorMessage(error));
        } finally {
            setSaving((prev) => ({ ...prev, cover: false }));
        }
    };

    const handleGalleryAdd = async (files: FileList) => {
        if (!profile) return;
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
            // Preserve existing coverPhoto to prevent backend from auto-overwriting it
            const response = await updateProfile({
                photos: updatedPhotos,
                coverPhoto: profile.coverPhoto // ✅ Explicitly preserve cover photo
            });
            setProfile({ ...response.profile, photos: response.profile.photos || [] });
            // keep auth avatar in sync with first photo
            updateAuthPhoto(response.profile.profilePhoto || response.profile.photos?.[0] || null);
            showSuccess("Gallery updated");
        } catch (error: unknown) {
            console.error("Failed to update gallery", error);
            showError(getErrorMessage(error));
        } finally {
            setSaving((prev) => ({ ...prev, gallery: false }));
        }
    };

    const handleRemovePhoto = async (index: number) => {
        if (!profile) return;
        if (!profile.photos || profile.photos.length <= 1) {
            showError("At least one photo is required");
            return;
        }

        const updatedPhotos = profile.photos.filter((_, i) => i !== index);

        try {
            setSaving((prev) => ({ ...prev, gallery: true }));
            const response = await updateProfile({
                photos: updatedPhotos,
                profilePhoto: updatedPhotos[0],
                coverPhoto: profile.coverPhoto // ✅ Explicitly preserve cover photo
            });
            setProfile({ ...response.profile, photos: response.profile.photos || [] });
            updateAuthPhoto(response.profile.profilePhoto || response.profile.photos?.[0] || null);
            showSuccess("Photo removed");
        } catch (error: unknown) {
            console.error("Failed to remove photo", error);
            showError(getErrorMessage(error));
        } finally {
            setSaving((prev) => ({ ...prev, gallery: false }));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-400">Profile not found</p>
            </div>
        );
    }

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
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-r from-primary/20 to-purple-600/20" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 right-4">
                    <Button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={saving.cover}
                        className="flex items-center gap-2 w-auto px-4 py-2"
                    >
                        {saving.cover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                        Change cover
                    </Button>
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
            <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 lg:p-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                        <div className="relative w-32 h-32 rounded-3xl border-4 border-black/60 overflow-hidden shadow-xl bg-black">
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

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl md:text-4xl font-bold">{profile.name || authUser?.name}</h1>
                                <span className="px-3 py-1 rounded-full bg-white/10 text-sm border border-white/10">
                                    {profile.age ? `${profile.age} yrs` : "Age not set"}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/30">
                                    {profile.gender || "Gender not set"}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-200 text-sm border border-purple-500/30">
                                    Interested in {profile.interestedIn || "—"}
                                </span>
                            </div>
                            <p className="text-gray-400 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-400" />
                                Keep your photos updated to get better matches.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery */}
            <div className="max-w-5xl mx-auto px-6 mt-10 pb-16 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">Photo gallery</h2>
                        <p className="text-gray-400 text-sm">Add up to 6 photos. First photo is used as your profile image.</p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={saving.gallery || (profile.photos?.length || 0) >= 6}
                        className="flex items-center gap-2"
                    >
                        {saving.gallery ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add photos
                    </Button>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(profile.photos || []).map((url, index) => (
                        <div key={url + index} className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                            <div className="aspect-4/5 relative">
                                <Image src={url} alt={`Photo ${index + 1}`} fill className="object-cover" unoptimized />
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end">
                                <div className="w-full flex justify-between items-center p-3">
                                    <span className="text-sm text-white/80">Photo {index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(index)}
                                        disabled={saving.gallery}
                                        className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {profile.photos?.length === 0 && (
                    <div className="border border-dashed border-white/20 rounded-2xl p-10 text-center text-gray-400 bg-white/5 mt-4">
                        No photos yet. Add your first photo to build your gallery.
                    </div>
                )}
            </div>
        </div>
    );
}

