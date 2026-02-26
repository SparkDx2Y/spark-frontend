"use client";

import { useState } from "react";
import { Plus, Edit2, Check, X, Shield, Users, MessageSquare, Video, Eye, Heart, Infinity, Image as ImageIcon, AlertTriangle, Mic } from "lucide-react";
import type { SubscriptionPlan, SubscriptionFeatures } from "@/types/subscription";
import Modal from "@/components/ui/Modal";
import TablePagination from "./TablePagination";
import { getAllSubscriptions, createSubscription, updateSubscription, toggleSubscriptionStatus } from "@/services/adminService";
import { GetSubscriptionsResponse } from "@/types/subscription";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { planSchema, type PlanFormData } from "@/validations/subscription";

interface SubscriptionManagerProps {
    initialPlans: SubscriptionPlan[];
    initialPagination: GetSubscriptionsResponse["pagination"];
}

const defaultFeatures: SubscriptionFeatures = {
    seeWhoLikedYou: false,
    seeWhoViewedProfile: false,
    chatEnabled: false,
    dailyMessageLimit: 0,
    mediaSharingEnabled: false,
    audioEnabled: false,
    videoCallEnabled: false,
    swipeLimit: 0,
};

export default function SubscriptionManager({ initialPlans, initialPagination }: SubscriptionManagerProps) {
    const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
    const [pagination, setPagination] = useState(initialPagination);
    const [currentPage, setCurrentPage] = useState(initialPagination.page);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
    const [planToToggle, setPlanToToggle] = useState<SubscriptionPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPlans = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await getAllSubscriptions({ page, limit: pagination.limit });
            if ('plans' in response) {
                setPlans(response.plans);
                setPagination(response.pagination);
                setCurrentPage(response.pagination.page);
            } else {
                setPlans(response);
            }
        } catch (error) {
            console.error("Failed to fetch plans:", error);
            toast.error("Failed to reload plans");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchPlans(newPage);
        }
    };

    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<PlanFormData>({
        resolver: zodResolver(planSchema),
        defaultValues: {
            name: "",
            price: 0,
            durationValue: 1,
            durationUnit: "month",
            features: defaultFeatures,
            isActive: true,
        }
    });

    const watchPrice = watch("price");
    const watchChatEnabled = watch("features.chatEnabled");

    const handleOpenModal = (plan?: SubscriptionPlan) => {
        if (plan) {
            setEditingPlan(plan);
            reset({
                name: plan.name,
                price: plan.price,
                durationValue: plan.durationValue,
                durationUnit: plan.durationUnit,
                features: { ...plan.features },
                isActive: plan.isActive,
            });
        } else {
            setEditingPlan(null);
            reset({
                name: "",
                price: 0,
                durationValue: 1,
                durationUnit: "month",
                features: defaultFeatures,
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleToggleClick = (plan: SubscriptionPlan) => {
        setPlanToToggle(plan);
        setIsConfirmOpen(true);
    };

    const confirmToggleStatus = async () => {
        if (!planToToggle) return;

        setIsLoading(true);
        try {
            const updatedPlan = await toggleSubscriptionStatus(planToToggle._id);
            setPlans(currentPlans =>
                currentPlans.map(p => p._id === planToToggle._id ? updatedPlan : p)
            );
            toast.success(updatedPlan.isActive ? "Plan Activated!" : "Plan Deactivated!");
            setIsConfirmOpen(false);
        } catch (error: any) {
            console.error("Toggle error:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setIsLoading(false);
            setPlanToToggle(null);
        }
    };

    const onSubmit = async (data: PlanFormData) => {
        setIsLoading(true);
        try {
            const subData = {
                ...data,
                durationValue: data.price === 0 ? 100 : data.durationValue,
                durationUnit: data.price === 0 ? 'year' : data.durationUnit,
                features: {
                    ...data.features,
                    dailyMessageLimit: data.features.chatEnabled ? data.features.dailyMessageLimit : 0,
                }
            };

            if (editingPlan) {
                const updatedPlan = await updateSubscription(editingPlan._id, subData);
                setPlans(prev => prev.map(p => p._id === editingPlan._id ? updatedPlan : p));
                toast.success("Plan updated successfully!");
            } else {
                await createSubscription(subData);
                toast.success("New plan created successfully!");
            
                fetchPlans(currentPage);
            }
            setIsModalOpen(false);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Operation failed";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-linear-to-br from-amber-500 to-yellow-600 px-6 py-3 rounded-2xl text-[#0d0d0f] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_4px_15px_rgba(217,119,6,0.3)] hover:scale-105 hover:shadow-amber-500/40 transition-all flex items-center group active:scale-95"
                >
                    <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" />
                    Create New Plan
                </button>
            </div>

            {plans.length === 0 ? (
                <div className="py-24 text-center bg-[#0d0d0f]/40 border border-white/5 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
                    <Shield className="w-12 h-12 text-amber-500/20 mx-auto mb-4" />
                    <p className="text-stone-500 font-medium tracking-tight">No subscription plans found.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan._id}
                                className={`relative group bg-[#0d0d0f]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 shadow-2xl overflow-hidden ${!plan.isActive ? 'grayscale opacity-50' : ''}`}
                            >
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all duration-500 ${plan.isActive
                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        : 'bg-stone-500/10 text-stone-400 border-stone-500/20'
                                        }`}>
                                        {plan.isActive ? "Active" : "Deactivated"}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenModal(plan);
                                            }}
                                            title="Edit Plan"
                                            className="p-3 rounded-xl bg-white/5 border border-white/5 text-stone-400 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-90"
                                        >
                                            <Edit2 className="w-4.5 h-4.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleToggleClick(plan);
                                            }}
                                            title={plan.isActive ? "Deactivate Plan" : "Activate Plan"}
                                            className={`p-3 rounded-xl border transition-all duration-500 group/status-btn active:scale-90 ${plan.isActive
                                                ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'
                                                : 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white'
                                                }`}
                                        >
                                            {plan.isActive ? <X className="w-4.5 h-4.5 transition-transform group-hover/status-btn:rotate-90" /> : <Check className="w-4.5 h-4.5 transition-transform group-hover/status-btn:scale-110" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-10 relative z-10 h-20 flex flex-col justify-end">
                                    <h3 className="text-2xl font-black text-white tracking-tight mb-2 uppercase group-hover:text-amber-500 transition-colors leading-none">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2">
                                        {plan.price === 0 ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[#0d0d0f] bg-amber-500 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg shadow-amber-500/20">Lifetime</span>
                                                <span className="text-stone-500 font-black text-[9px] uppercase tracking-widest opacity-60 italic">No Renewal</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-5xl font-black text-white tracking-tighter">${plan.price}</span>
                                                <span className="text-stone-500 font-black text-[10px] uppercase tracking-widest italic opacity-60">/ {plan.durationValue} {plan.durationUnit}{plan.durationValue > 1 ? 's' : ''}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-3 mb-2 opacity-50">
                                        <div className="h-px flex-1 bg-amber-500/20" />
                                        <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em]">Plan Features</span>
                                        <div className="h-px flex-1 bg-amber-500/20" />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <FeatureItem label="See Who Liked You" active={plan.features.seeWhoLikedYou} icon={<Heart className="w-3.5 h-3.5" />} />
                                        <FeatureItem label="Profile Views" active={plan.features.seeWhoViewedProfile} icon={<Eye className="w-3.5 h-3.5" />} />
                                        <FeatureItem label="Unlimited Chat" active={plan.features.chatEnabled} icon={<MessageSquare className="w-3.5 h-3.5" />} />
                                        <FeatureItem label="Video Calls" active={plan.features.videoCallEnabled} icon={<Video className="w-3.5 h-3.5" />} />
                                        <FeatureItem label="Audio Messages" active={plan.features.audioEnabled} icon={<Mic className="w-3.5 h-3.5" />} />
                                        <FeatureItem label="Media Sharing" active={plan.features.mediaSharingEnabled} icon={<ImageIcon className="w-3.5 h-3.5" />} />

                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 transition-all group-hover:bg-amber-500/5 group-hover:border-amber-500/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-stone-500/5 flex items-center justify-center text-stone-500 transition-colors group-hover:text-amber-500/60 border border-white/5">
                                                    <MessageSquare className="w-4.5 h-4.5" />
                                                </div>
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Messages / Day</span>
                                            </div>
                                            <span className="text-base font-black text-white">
                                                {plan.features.dailyMessageLimit === -1 ? <Infinity className="w-5 h-5" /> : plan.features.dailyMessageLimit}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 transition-all group-hover:bg-amber-500/5 group-hover:border-amber-500/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-stone-500/5 flex items-center justify-center text-stone-500 transition-colors group-hover:text-amber-500/60 border border-white/5">
                                                    <Users className="w-4.5 h-4.5" />
                                                </div>
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Swipes / Day</span>
                                            </div>
                                            <span className="text-base font-black text-white">
                                                {plan.features.swipeLimit === -1 ? <Infinity className="w-5 h-5" /> : plan.features.swipeLimit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <TablePagination
                            pagination={pagination}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            loading={isLoading}
                            itemName="plans"
                        />
                    </div>
                </>
            )}

            {/* Main Configuration Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPlan ? "Edit Subscription Plan" : "Create New Subscription"}
                className="max-w-2xl"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-1">Plan Name</label>
                            <input
                                {...register("name")}
                                className={`w-full bg-[#121214] border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all font-bold uppercase`}
                                placeholder="e.g., GOLD MONTHLY"
                            />
                            {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-1">Price ($)</label>
                            <input
                                type="number"
                                {...register("price")}
                                className={`w-full bg-[#121214] border ${errors.price ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all font-bold`}
                            />
                            {errors.price && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.price.message}</p>}
                        </div>

                        {(watchPrice > 0 || String(watchPrice) === "") ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-1">Duration Value</label>
                                    <input
                                        type="number"
                                        {...register("durationValue")}
                                        className={`w-full bg-[#121214] border ${errors.durationValue ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all font-bold`}
                                    />
                                    {errors.durationValue && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.durationValue.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-1">Duration Unit</label>
                                    <select
                                        {...register("durationUnit")}
                                        className="w-full bg-[#121214] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all appearance-none cursor-pointer font-bold"
                                    >
                                        <option value="month">Month(s)</option>
                                        <option value="year">Year(s)</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <div className="md:col-span-2 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center gap-3">
                                <Infinity className="w-5 h-5 text-amber-500" />
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Unlimited Lifetime Access</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-amber-500/40 uppercase tracking-[0.3em] flex items-center gap-3 border-b border-white/5 pb-3">
                            Feature Settings
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Controller
                                name="features.seeWhoLikedYou"
                                control={control}
                                render={({ field }) => (
                                    <FeatureToggle
                                        icon={<Heart className="w-4 h-4" />}
                                        label="See Who Liked You"
                                        active={field.value}
                                        onClick={() => field.onChange(!field.value)}
                                    />
                                )}
                            />
                            <Controller
                                name="features.seeWhoViewedProfile"
                                control={control}
                                render={({ field }) => (
                                    <FeatureToggle
                                        icon={<Eye className="w-4 h-4" />}
                                        label="Profile Views"
                                        active={field.value}
                                        onClick={() => field.onChange(!field.value)}
                                    />
                                )}
                            />
                            <Controller
                                name="features.chatEnabled"
                                control={control}
                                render={({ field }) => (
                                    <FeatureToggle
                                        icon={<MessageSquare className="w-4 h-4" />}
                                        label="Direct Messaging"
                                        active={field.value}
                                        onClick={() => {
                                            const nextValue = !field.value;
                                            field.onChange(nextValue);
                                            if (!nextValue) {
                                                setValue("features.audioEnabled", false);
                                                setValue("features.videoCallEnabled", false);
                                                setValue("features.mediaSharingEnabled", false);
                                                setValue("features.dailyMessageLimit", 20);
                                            }
                                        }}
                                    />
                                )}
                            />

                            {watchChatEnabled && (
                                <>
                                    <Controller
                                        name="features.audioEnabled"
                                        control={control}
                                        render={({ field }) => (
                                            <FeatureToggle
                                                icon={<Mic className="w-4 h-4" />}
                                                label="Audio Messages"
                                                active={field.value}
                                                onClick={() => field.onChange(!field.value)}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="features.videoCallEnabled"
                                        control={control}
                                        render={({ field }) => (
                                            <FeatureToggle
                                                icon={<Video className="w-4 h-4" />}
                                                label="Video Calls"
                                                active={field.value}
                                                onClick={() => field.onChange(!field.value)}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="features.mediaSharingEnabled"
                                        control={control}
                                        render={({ field }) => (
                                            <FeatureToggle
                                                icon={<ImageIcon className="w-4 h-4" />}
                                                label="Media Sharing"
                                                active={field.value}
                                                onClick={() => field.onChange(!field.value)}
                                            />
                                        )}
                                    />
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {watchChatEnabled && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-1">Daily Messages (-1 for max)</label>
                                    <input
                                        type="number"
                                        {...register("features.dailyMessageLimit")}
                                        className={`w-full bg-[#121214] border ${errors.features?.dailyMessageLimit ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all font-bold`}
                                    />
                                    {errors.features?.dailyMessageLimit && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.features.dailyMessageLimit.message}</p>}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] ml-1">Daily Swipes (-1 for max)</label>
                                <input
                                    type="number"
                                    {...register("features.swipeLimit")}
                                    className={`w-full bg-[#121214] border ${errors.features?.swipeLimit ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all font-bold`}
                                />
                                {errors.features?.swipeLimit && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.features.swipeLimit.message}</p>}
                            </div>
                        </div>
                    </div>

                    {errors.features && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                            <p className="text-[10px] text-red-500 font-black uppercase tracking-wider leading-relaxed">
                                {(errors.features as any)?.message || "Please select at least one feature or limit for the plan"}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-8 border-t border-white/5">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-stone-500 hover:text-white font-bold tracking-tight text-[10px] uppercase">Cancel</button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-linear-to-br from-amber-500 to-yellow-600 px-10 py-3.5 rounded-2xl text-[#0d0d0f] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {isLoading ? "Saving..." : (editingPlan ? "Update Plan" : "Create Plan")}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirmation Modal */}
            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Confirm Plan Status Update"
                className="max-w-md"
            >
                <div className="py-6 space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-wider">Plan Status Change</h4>
                            <p className="text-xs text-stone-500 font-medium">Updating visibility for: <span className="text-amber-500 font-black">{planToToggle?.name}</span></p>
                        </div>
                    </div>

                    <p className="text-sm text-stone-400 leading-relaxed px-1">
                        Are you sure you want to {planToToggle?.isActive ? 'deactivate' : 'activate'} this subscription plan? Users will {planToToggle?.isActive ? 'no longer be able to purchase' : 'now be able to purchase'} this plan.
                    </p>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setIsConfirmOpen(false)}
                            className="flex-1 px-6 py-3 rounded-xl text-stone-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmToggleStatus}
                            disabled={isLoading}
                            className="flex-1 bg-white text-stone-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-stone-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? "Processing..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

function FeatureItem({ label, active, icon }: { label: string, active: boolean, icon: React.ReactNode }) {
    return (
        <div className={`flex items-center gap-4 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-25'}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-500 ${active ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'bg-white/5 border-white/5 text-stone-700'
                }`}>
                {icon}
            </div>
            <span className={`text-[11px] font-black uppercase tracking-wider transition-colors duration-500 ${active ? 'text-stone-200' : 'text-stone-700'}`}>{label}</span>
            <div className="ml-auto">
                {active ? <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" /> : <X className="w-3.5 h-3.5 text-stone-900" />}
            </div>
        </div>
    );
}

function FeatureToggle({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-4 p-5 rounded-3xl border transition-all duration-500 text-left group/toggle active:scale-95 ${active
                ? 'bg-amber-500/10 border-amber-500/30 text-white shadow-2xl'
                : 'bg-white/3 border-white/5 text-stone-500 hover:border-white/10'}`}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${active
                ? 'bg-amber-500 text-[#0d0d0f] shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-110'
                : 'bg-white/5 text-stone-600'}`}>
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest mb-1">{label}</span>
                <span className={`text-[9px] uppercase font-black tracking-tighter transition-colors duration-500 ${active ? 'text-amber-500' : 'text-stone-700'}`}>
                    {active ? "Active" : "Hidden"}
                </span>
            </div>
            <div className={`ml-auto w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500 ${active
                ? 'bg-amber-500 border-transparent shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'border-white/10'}`}>
                {active && <Check className="w-4 h-4 text-[#0d0d0f]" />}
            </div>
        </button>
    );
}
