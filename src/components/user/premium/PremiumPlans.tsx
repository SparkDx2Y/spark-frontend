"use client";

import { motion } from "framer-motion";
import { Check, Heart, Eye, MessageSquare, Video, Mic, Image as ImageIcon, Infinity, Star, ArrowRight } from "lucide-react";
import type { SubscriptionPlan } from "@/types/subscription";

interface PremiumPlansProps {
    plans: SubscriptionPlan[];
    currentPlanId?: string;
}

export default function PremiumPlans({ plans, currentPlanId }: PremiumPlansProps) {
    const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

    const handleSubscribe = (planId: string) => {

    };

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
                >
                    Elevate Your <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-yellow-600">Spark Experience</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-stone-400 text-lg max-w-2xl mx-auto font-medium"
                >
                    Unlock exclusive features designed to help you find more meaningful connections.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {sortedPlans.map((plan, index) => (
                    <PlanCard
                        key={plan._id}
                        plan={plan}
                        index={index}
                        isCurrentPlan={plan._id === currentPlanId}
                        onSubscribe={() => handleSubscribe(plan._id)}
                    />
                ))}
            </div>
        </div>
    );
}

function PlanCard({ plan, index, isCurrentPlan, onSubscribe }: {
    plan: SubscriptionPlan,
    index: number,
    isCurrentPlan: boolean,
    onSubscribe: () => void,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex flex-col p-8 rounded-[3rem] border transition-all duration-500 overflow-hidden group shadow-2xl ${isCurrentPlan
                ? 'border-amber-500/50 bg-[#0d0d0f]'
                : 'border-white/5 bg-[#0d0d0f]/60 hover:border-white/20'
                }`}
        >
            {isCurrentPlan && (
                <div className="absolute inset-0 bg-linear-to-b from-amber-500/5 to-transparent pointer-events-none" />
            )}

            <div className="mb-10">
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tracking-tighter">₹{plan.price}</span>
                    {!(plan.price === 0 && plan.durationValue >= 100) && (
                        <span className="text-stone-500 font-bold text-sm uppercase tracking-widest leading-none">
                            / {plan.durationValue} {plan.durationUnit}{plan.durationValue > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 space-y-6 mb-10">
                <div className="space-y-4">
                    <FeatureRow label="See who liked you" active={plan.features.seeWhoLikedYou} icon={<Heart className="w-4 h-4" />} />
                    <FeatureRow label="Profile views" active={plan.features.seeWhoViewedProfile} icon={<Eye className="w-4 h-4" />} />
                    <FeatureRow label="Direct messaging" active={plan.features.chatEnabled} icon={<MessageSquare className="w-4 h-4" />} />
                    <FeatureRow label="Video calling" active={plan.features.videoCallEnabled} icon={<Video className="w-4 h-4" />} />
                    <FeatureRow label="Audio messages" active={plan.features.audioEnabled} icon={<Mic className="w-4 h-4" />} />
                    <FeatureRow label="Media sharing" active={plan.features.mediaSharingEnabled} icon={<ImageIcon className="w-4 h-4" />} />
                    <LimitRow label="Daily Messages" limit={plan.features.dailyMessageLimit} icon={<MessageSquare className="w-4 h-4" />} />
                    <LimitRow label="Daily Swipes" limit={plan.features.swipeLimit} icon={<Star className="w-4 h-4" />} />
                </div>
            </div>

            <button
                onClick={onSubscribe}
                disabled={isCurrentPlan}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center mt-auto ${isCurrentPlan
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 cursor-default'
                    : 'group/btn active:scale-95 bg-white/5 text-white border border-white/10 hover:bg-white/10'
                    }`}
            >
                {isCurrentPlan ? 'Your Current Plan' : 'Get Started'}
                {!isCurrentPlan && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
            </button>
        </motion.div>
    );
}

function FeatureRow({ label, active, icon }: { label: string, active: boolean, icon: React.ReactNode }) {
    return (
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-stone-500'}`}>
                {icon}
            </div>
            <span className="text-sm font-bold text-stone-300 tracking-tight">{label}</span>
            <div className="ml-auto">
                {active ? (
                    <Check className="w-4 h-4 text-amber-500 font-bold" />
                ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                )}
            </div>
        </div>
    );
}

function LimitRow({ label, limit, icon }: { label: string, limit: number, icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 text-stone-500">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-stone-300 tracking-tight">{label}</span>
            </div>
            <span className="ml-auto text-sm font-black text-white uppercase tracking-widest">
                {limit === -1 ? <Infinity className="w-4 h-4 text-amber-500" /> : limit}
            </span>
        </div>
    );
}
