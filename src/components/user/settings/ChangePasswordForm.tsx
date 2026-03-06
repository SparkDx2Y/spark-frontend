"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { KeyRound, ShieldCheck, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

import { changePasswordSchema, ChangePasswordFormData } from "@/validations/auth/change-password.schema";
import { changePassword } from "@/services/authService";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export const ChangePasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { user } = useAppSelector((state) => state.auth);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        setIsLoading(true);
        try {
            const response = await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });
            toast.success(response.message || "Password changed successfully");
            reset();
            setIsExpanded(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.hasPassword === false) {
        return (
            <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 text-center">
                <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
                <h2 className="text-lg font-bold text-white mb-2">Social Login Account</h2>
                <p className="text-sm text-gray-400">You signed in using a social provider (e.g., Google). You don't have a customized password to change.</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-300">
            {/* Header / Toggle Button */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors text-left group"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl group-hover:scale-105 transition-transform">
                        <KeyRound className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Change Password</h2>
                        <p className="text-sm text-gray-400 mt-0.5 max-w-[250px] md:max-w-none">Update your password to keep your account secure.</p>
                    </div>
                </div>
                <div className="p-2 text-gray-400 group-hover:text-white transition-colors shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </button>

            {/* Expandable Form */}
            <div
                className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
            >
                <div className="p-6 pt-0">
                    <div className="border-t border-white/10 pt-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <Input
                                    label="Current Password"
                                    type="password"
                                    placeholder="Enter current password"
                                    {...register("oldPassword")}
                                    error={errors.oldPassword?.message}
                                    className="bg-black/40 border-white/10 focus:bg-black/60 transition-all rounded-xl"
                                />

                                <div className="pt-2 space-y-4">
                                    <Input
                                        label="New Password"
                                        type="password"
                                        placeholder="Enter new password"
                                        {...register("newPassword")}
                                        error={errors.newPassword?.message}
                                        className="bg-black/40 border-white/10 focus:bg-black/60 transition-all rounded-xl"
                                    />

                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        placeholder="Confirm new password"
                                        {...register("confirmPassword")}
                                        error={errors.confirmPassword?.message}
                                        className="bg-black/40 border-white/10 focus:bg-black/60 transition-all rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="flex items-center gap-2 text-xs text-zinc-500">
                                    <ShieldCheck className="w-4 h-4 shrink-0" />
                                    Encrypted and securely stored.
                                </p>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto px-8 py-2.5 rounded-xl transition-all active:scale-95 bg-primary hover:bg-primary/90 text-white font-semibold"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        "Save Password"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
