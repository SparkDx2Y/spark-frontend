'use client';

import { Plus, X, Loader2 } from "lucide-react";
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
import { uploadFile, uploadMultipleFiles } from "@/services/fileService";

export default function CompleteProfileForm() {
    const router = useRouter();

    const { register, handleSubmit, setValue, watch, setError, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(completeProfileSchema),
        defaultValues: {
            photos: []
        }
    });

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const photos = watch("photos") || [];

    const onSubmit: SubmitHandler<CompleteProfileSchemaType> = async (data) => {
        try {
            const response = await completeProfile(data);
            showSuccess(response.message);
            if (response.isCompleted) {
                router.push('/user/home');
            }
        } catch (error: any) {
            handleFormError(error, setError);
        }
    };

    const handlePhotoUpload = () => {
        if (photos.length < 6) {
            fileInputRef.current?.click();
        }
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);

        const remainingSlots = 6 - photos.length;
        if(fileArray.length > remainingSlots) {
            showError("You can only upload up to 6 photos");
            e.target.value = '';
            return;
        }

        // Reset the input so the same file can be selected again
        e.target.value = '';

        try {
            setIsUploading(true);
            const url = await uploadMultipleFiles(fileArray);
            setValue("photos", [...photos, ...url], { shouldValidate: true });
        } catch (error: any) {
            showError(error.response?.data?.message || "Failed to upload photo");
        } finally {
            setIsUploading(false);
        }
    };

    const removePhoto = (index: number) => {
        setValue("photos", photos.filter((_, i) => i !== index), { shouldValidate: true });
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

                {/* Profile Photos */}
                <div className="space-y-2">
                    <label className="text-gray-400 text-sm ml-1">Profile Photos (Min 2)</label>
                    <div className="grid grid-cols-3 gap-2">
                        {photos.map((url: string, index: number) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                <Image src={url} alt={`Photo ${index + 1}`} fill className="object-cover" unoptimized/>
                                <button
                                    type="button"
                                    onClick={() => removePhoto(index)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        {photos.length < 6 && (
                            <button
                                type="button"
                                onClick={handlePhotoUpload}
                                disabled={isUploading}
                                className="aspect-square rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 hover:text-primary hover:border-primary/50 transition-colors bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <Plus size={24} />
                                )}
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={onFileChange}
                            className="hidden"
                            accept="image/*"
                            multiple
                        />
                    </div>
                    {errors.photos?.message && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.photos.message}</p>}
                    <p className="text-xs text-gray-500 text-center">Upload 2-6 photos to complete your profile</p>
                </div>

                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Complete Profile"}
                </Button>
            </form>
        </div>
    );
}
