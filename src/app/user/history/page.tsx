'use client';

import { useEffect, useState, useMemo } from 'react';
import { getActivity } from '@/services/matchService';
import { ActivityResponse, MatchAction } from '@/types/match/response';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Clock, CheckCircle2, Timer, UserX, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProfilePreviewModal from '@/components/user/ProfilePreviewModal';
import { getCurrentPlan } from '@/services/subscriptionService';
import type { SubscriptionPlan } from '@/types/subscription';

type TabType = 'liked' | 'received' | 'passed' | 'viewedYou';

export default function ActivityPage() {
    const [activity, setActivity] = useState<ActivityResponse | null>(null);
    const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('liked');
    const [previewUser, setPreviewUser] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadActivity();
    }, []);

    const loadActivity = async () => {
        try {
            const [activityRes, planRes] = await Promise.all([
                getActivity(),
                getCurrentPlan()
            ]);
            setActivity(activityRes.data);
            setCurrentPlan(planRes.plan);
        } catch (error) {
            console.error('Failed to load activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentData = useMemo(() => {
        if (!activity) return [];
        switch (activeTab) {
            case 'liked': return activity.liked;
            case 'passed': return activity.passed;
            case 'received': return activity.received;
            case 'viewedYou': return activity.viewedYou;
            default: return [];
        }
    }, [activity, activeTab]);

    // Check for matches (Mutual likes)
    const getStatus = (item: MatchAction, type: TabType) => {
        if (type === 'passed') return { label: 'Passed', icon: UserX, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' };
        if (type === 'received') return { label: 'Likes You', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' };
        if (type === 'viewedYou') return { label: 'Viewed', icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };

        const isMatch = activity?.received.some(r => r.fromUserId._id === item.toUserId._id);
        if (isMatch) {
            return { label: 'Matched', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' };
        }

        const isPassed = activity?.passedBy?.some(r => r.fromUserId._id === item.toUserId._id);
        if (isPassed) {
            return { label: 'Passed', icon: UserX, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
        }

        return { label: 'Pending', icon: Timer, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen text-white pb-24 relative overflow-hidden">
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-b from-black/80 to-black z-10" />
                <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 pt-8 md:pt-12 relative z-10">
                <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6">Swipe History</h1>

                    {/* Consistent Tab Navigation */}
                    <div className="flex p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-fit">
                        <TabButton
                            active={activeTab === 'liked'}
                            onClick={() => setActiveTab('liked')}
                            label="Sent"
                            count={activity?.liked.length}
                        />
                        <TabButton
                            active={activeTab === 'received'}
                            onClick={() => setActiveTab('received')}
                            label="Received"
                            count={activity?.received.length}
                        />
                        <TabButton
                            active={activeTab === 'passed'}
                            onClick={() => setActiveTab('passed')}
                            label="Passed"
                            count={activity?.passed.length}
                        />
                        <TabButton
                            active={activeTab === 'viewedYou'}
                            onClick={() => setActiveTab('viewedYou')}
                            label="Viewed You"
                            count={activity?.viewedYou.length}
                        />
                    </div>
                </header>

                {/* Profile List Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {currentData.length > 0 ? (
                            currentData.map((item, idx) => {
                                const status = getStatus(item, activeTab);
                                const targetUser = (activeTab === 'received' || activeTab === 'viewedYou') ? item.fromUserId : item.toUserId;

                                return (
                                    <ProfileCard
                                        key={item._id}
                                        user={targetUser}
                                        status={status}
                                        date={item.createdAt}
                                        index={idx}
                                        onClick={() => setPreviewUser(targetUser._id)}
                                    />
                                );
                            })
                        ) : (
                            (activeTab === 'received' && currentPlan && !currentPlan.features.seeWhoLikedYou) || (activeTab === 'viewedYou' && currentPlan && !currentPlan.features.seeWhoViewedProfile) ? (
                                <div className="col-span-full py-24 flex flex-col items-center justify-center text-center max-w-md mx-auto relative group">
                                    {/* Locked Glow Effect */}
                                    <div className="absolute inset-0 bg-amber-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                                    <div className="relative z-10 space-y-6">
                                        <div className="w-20 h-20 bg-linear-to-b from-amber-500/10 to-amber-500/5 rounded-4xl flex items-center justify-center mx-auto border border-amber-500/20 group-hover:border-amber-500/40 transition-colors shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                                            <Lock className="w-8 h-8 text-amber-500" />
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-2xl font-black text-white tracking-tight">{activeTab === 'received' ? 'Unlock Your Likes!' : 'Unlock Your Stalkers!'}</h3>
                                            <p className="text-stone-400 font-medium whitespace-pre-line">
                                                {activeTab === 'received' ? 'You have hidden likes.\nUpgrade to Premium to see who is interested in you and match instantly.' : 'You have hidden viewers.\nUpgrade to Premium to see exactly who is checking out your profile.'}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => router.push('/user/premium')}
                                            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black uppercase tracking-widest transition-all duration-300 transform active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
                                        >
                                            Upgrade to Premium
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                        <Search className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p className="text-gray-400">No profiles found in this category.</p>
                                    <button
                                        onClick={() => router.push('/user/home')}
                                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition"
                                    >
                                        Go to Discover
                                    </button>
                                </div>
                            )
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <ProfilePreviewModal
                isOpen={!!previewUser}
                userId={previewUser}
                onClose={() => setPreviewUser(null)}
            />
        </div>
    );
}

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    label: string;
    count?: number;
}

function TabButton({ active, onClick, label, count }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${active ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
        >
            {active && (
                <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            <span className="relative z-10 flex items-center gap-2">
                {label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${active ? 'bg-white text-black' : 'bg-white/10 text-gray-400'
                    }`}>
                    {count || 0}
                </span>
            </span>
        </button>
    );
}

interface ProfileCardProps {
    user: { name: string; profilePhoto?: string };
    status: { label: string; icon: React.ElementType; color: string; bg: string };
    date: string;
    index: number;
    onClick: () => void;
}

function ProfileCard({ user, status, date, index, onClick }: ProfileCardProps) {
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            className="group relative bg-[#121212]/80 backdrop-blur-sm border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                {/* Avatar */}
                {user.profilePhoto ? (
                    <div className="w-16 h-16 rounded-full border border-white/10 overflow-hidden relative">
                        <Image
                            src={user.profilePhoto}
                            alt={user.name}
                            fill
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                    </div>
                ) : (
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-xl font-bold text-white/30 group-hover:text-white/80 transition-colors">
                        {user.name[0]}
                    </div>
                )}

                {/* Status Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.bg} ${status.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">{status.label}</span>
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {user.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(date).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Interactive Shine */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-white/10 transition-all pointer-events-none" />
        </motion.div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-black p-6 md:p-12 max-w-6xl mx-auto space-y-8">
            <div className="h-10 w-48 bg-white/10 rounded-xl animate-pulse" />
            <div className="flex gap-2">
                <div className="h-10 w-32 bg-white/10 rounded-xl animate-pulse" />
                <div className="h-10 w-32 bg-white/10 rounded-xl animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />
                ))}
            </div>
        </div>
    );
}
