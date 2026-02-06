'use client';

import { Camera, Loader2, X } from "lucide-react";
import Image from "next/image";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { CompleteProfileSchemaType, completeProfileSchema } from "@/validations/profile/complete-profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { completeProfile } from "@/services/profileService";
import { handleFormError } from "@/utils/handleFormError";
import { showSuccess, showError } from "@/utils/toast";
import { useRef, useState } from "react";
import { uploadFile } from "@/services/fileService";

import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/features/auth/authSlice";
import { getCurrentUser } from "@/services/authService";

export default function CompleteProfileForm() {
    const router = useRouter();
    const dispatch = useDispatch();

    const { register, handleSubmit, setValue, watch, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(completeProfileSchema),
        defaultValues: {
            profilePhoto: ""
        }
    });

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const profilePhoto = watch("profilePhoto") || "";

    const onSubmit: SubmitHandler<CompleteProfileSchemaType> = async (data) => {
        try {
            const response = await completeProfile(data);
            showSuccess(response.message);

            if (response.isCompleted) {
                // Fetch updated user data
                const userResponse = await getCurrentUser();

                dispatch(setCredentials({
                    user: userResponse.user
                }));

                if (!userResponse.user.isInterestsSelected) {
                    router.push('/interests');
                } else {
                    router.push('/user/home');
                }
            }
        } catch (error: unknown) {
            handleFormError(error, setError);
        }
    };

    const handlePhotoUpload = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset the input
        e.target.value = '';

        try {
            setIsUploading(true);
            const url = await uploadFile(file);
            setValue("profilePhoto", url, { shouldValidate: true });
        } catch (error: any) {
            showError(error.response?.data?.message || "Failed to upload photo");
        } finally {
            setIsUploading(false);
        }
    };

    const removePhoto = () => {
        setValue("profilePhoto", "", { shouldValidate: true });
    };

    return (
        <div className='space-y-6'>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Complete Profile</h2>
                <p className="text-gray-400">Tell us a bit more about yourself</p>
            </div>

            {errors.root?.message && (
                <p className="text-red-500 text-sm text-center">{errors.root.message}</p>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {/* Age & Gender Row */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Age"
                        type="number"
                        {...register("age", { valueAsNumber: true })}
                        error={errors.age?.message}
                    />

                    <div className="relative w-full group">
                        <select
                            {...register("gender")}
                            className="w-full px-4 pt-6 pb-2 border border-white/10 rounded-xl text-gray-100 bg-transparent outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 appearance-none"
                        >
                            <option value="" disabled className="bg-gray-900">Select Gender</option>
                            <option value="male" className="bg-gray-900">Male</option>
                            <option value="female" className="bg-gray-900">Female</option>
                        </select>
                        <label className="absolute left-4 top-2 text-gray-400 text-xs pointer-events-none">
                            Gender
                        </label>
                        {errors.gender?.message && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.gender.message}</p>}
                    </div>
                </div>

                {/* Interested In */}
                <div className="relative w-full group">
                    <select
                        {...register("interestedIn")}
                        className="w-full px-4 pt-6 pb-2 border border-white/10 rounded-xl text-gray-100 bg-transparent outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 appearance-none"
                    >
                        <option value="" disabled className="bg-gray-900">Select Preference</option>
                        <option value="male" className="bg-gray-900">Men</option>
                        <option value="female" className="bg-gray-900">Women</option>
                    </select>
                    <label className="absolute left-4 top-2 text-gray-400 text-xs pointer-events-none">
                        Interested In
                    </label>
                    {errors.interestedIn?.message && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.interestedIn.message}</p>}
                </div>

                {/* Profile Photo */}
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm ml-1">Profile Photo</label>
                    <div className="flex flex-col items-center gap-4">
                        {profilePhoto ? (
                            <div className="relative w-40 h-40 rounded-2xl overflow-hidden group">
                                <Image src={profilePhoto} alt="Profile" fill className="object-cover" unoptimized />
                                <button
                                    type="button"
                                    onClick={removePhoto}
                                    className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handlePhotoUpload}
                                disabled={isUploading}
                                className="w-40 h-40 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 hover:text-primary hover:border-primary/50 transition-colors bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading ? (
                                    <Loader2 className="animate-spin" size={32} />
                                ) : (
                                    <>
                                        <Camera size={32} className="mb-2" />
                                        <span className="text-sm">Upload Photo</span>
                                    </>
                                )}
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={onFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    {errors.profilePhoto?.message && <p className="text-red-500 text-[10px] mt-1 ml-1 text-center">{errors.profilePhoto.message}</p>}
                    <p className="text-xs text-gray-500 text-center">This will be your main profile photo</p>
                </div>

                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Complete Profile"}
                </Button>
            </form>
        </div>
    );
}
