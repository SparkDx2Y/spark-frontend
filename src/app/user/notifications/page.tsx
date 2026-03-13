'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/services/notificationService';
import { NotificationResponse } from '@/types/notification/response';
import { useSocketContext } from '@/contexts/SocketContext';

import { Heart, MessageCircle, Bell, Check, ShieldCheck, ShieldX, User, Lock, Crown } from 'lucide-react';
import ProfilePreviewModal from '@/components/user/ProfilePreviewModal';


export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewUser, setPreviewUser] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    
    const router = useRouter();
    const { socket, unreadCount, setUnreadCount } = useSocketContext();
    const LIMIT = 5;

    useEffect(() => {
        loadNotifications(1, true);

        if (socket) {
            socket.on('notification', () => {
                loadNotifications(1, true);
            });

            return () => {
                socket.off('notification');
            };
        }
    }, [socket]);

    // Load notifications from the database
    const loadNotifications = async (pageNumber: number, replace: boolean = false) => {
        if (pageNumber > 1) setLoadingMore(true);
        else setLoading(true);

        try {
            const response = await getNotifications(pageNumber, LIMIT);
            const newData = response.data;

            if (replace) {
                setNotifications(newData);
            } else {
                setNotifications((prev: NotificationResponse[]) => [...prev, ...newData]);
            }

            setHasMore(newData.length === LIMIT);
            setPage(pageNumber);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            loadNotifications(page + 1);
        }
    };

    // Mark a notification as read
    const handleRead = async (notificationId: string, isRead: boolean) => {
        if (isRead) return;

        try {
            await markNotificationAsRead(notificationId);
            setNotifications((prev: NotificationResponse[]) =>
                prev.map((n: NotificationResponse) => n.id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount((prev: number) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark read:', error);
        }
    };

    // Mark all notifications as read
    const handleReadAll = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications((prev: NotificationResponse[]) => prev.map((n: NotificationResponse) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all read:', error);
        }
    };

    // Handle notification click
    const handleNotificationClick = async (notification: NotificationResponse) => {
        await handleRead(notification.id, notification.isRead);

        if (notification.isPremiumLocked) {
            router.push('/user/premium');
            return;
        }

        if (notification.type === 'match' && notification.matchId) {
            router.push(`/user/messages?matchId=${notification.matchId}`);
        } else if (notification.type === 'message' && notification.matchId) {
            router.push(`/user/messages?matchId=${notification.matchId}`);
        } else if ((notification.type === 'like' || notification.type === 'profile_view') && notification.fromUser?.userId) {
            setPreviewUser(notification.fromUser.userId);
        } else if (notification.type === 'subscription_expired' || notification.type === 'subscription_expiring_soon') {
            router.push('/user/premium');
        }
    };



    const getIcon = (type: string) => {
        switch (type) {
            case 'like':
                return <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />;
            case 'match':
                return <Heart className="w-5 h-5 text-purple-500 fill-purple-500" />;
            case 'message':
                return <MessageCircle className="w-5 h-5 text-blue-500" />;
            case 'report_resolved':
                return <ShieldCheck className="w-5 h-5 text-green-500" />;
            case 'report_dismissed':
                return <ShieldX className="w-5 h-5 text-stone-500" />;
            case 'profile_view':
                return <User className="w-5 h-5 text-cyan-500" />;
            case 'subscription_expired':
                return <Crown className="w-5 h-5 text-red-400" />;
            case 'subscription_expiring_soon':
                return <Crown className="w-5 h-5 text-amber-400" />;
            default:
                return <Bell className="w-5 h-5 text-yellow-500" />;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Loading state for notifications skeleton
    if (loading) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Notifications</h1>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white/5 h-20 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-gray-400">See who likes you and your latest updates</p>
                </div>

                {(unreadCount > 0 || notifications.some(n => !n.isRead)) && (
                    <button
                        onClick={handleReadAll}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition text-sm font-medium"
                    >
                        <Check className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No notifications yet</h3>
                    <p className="text-gray-400 mb-6">When you get matches or messages, they will appear here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`
                                group flex items-center gap-4 p-4 rounded-xl border border-white/5 cursor-pointer transition-all duration-300
                                ${notification.isRead ? 'bg-black/20 hover:bg-white/5' : 'bg-white/10 hover:bg-white/15 border-l-4 border-l-primary'}
                            `}
                        >
                            <div className="relative">
                                {notification.isPremiumLocked ? (
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-500/20 to-yellow-600/40 flex items-center justify-center shrink-0 border border-yellow-500/50 backdrop-blur-md">
                                        <Lock className="w-5 h-5 text-yellow-500" />
                                    </div>
                                ) : notification.type === 'subscription_expired' ? (
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-red-500/20 to-red-600/40 flex items-center justify-center shrink-0 border border-red-500/50">
                                        <Crown className="w-6 h-6 text-red-400" />
                                    </div>
                                ) : notification.type === 'subscription_expiring_soon' ? (
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-500/20 to-amber-600/40 flex items-center justify-center shrink-0 border border-amber-500/50">
                                        <Crown className="w-6 h-6 text-amber-400" />
                                    </div>
                                ) : notification.fromUser?.profilePhoto ? (
                                    <div className="relative w-12 h-12 overflow-hidden shrink-0">
                                        <Image
                                            src={notification.fromUser.profilePhoto}
                                            alt={notification.fromUser.name || 'User'}
                                            fill
                                            className="rounded-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                                        <User className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}

                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                                    {getIcon(notification.type)}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-semibold ${notification.isPremiumLocked ? 'text-yellow-500' : notification.isRead ? 'text-gray-300' : 'text-white'}`}>
                                    {notification.type === 'subscription_expired' ? 'Subscription Expired' :
                                     notification.type === 'subscription_expiring_soon' ? 'Subscription Expiring Soon' :
                                     notification.fromUser?.name || 'Someone'}
                                </h3>
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                        {formatTime(notification.createdAt)}
                                    </span>
                                </div>
                                <p className={`text-sm ${notification.isPremiumLocked ? 'text-yellow-500/80 font-medium' : notification.isRead ? 'text-gray-500' : 'text-gray-300'}`}>
                                    {notification.isPremiumLocked ? (
                                        <>Upgrade to Premium to see who it is!</>
                                    ) : (
                                        <>
                                            {notification.type === 'like' && `liked your profile!`}
                                            {notification.type === 'match' && `It's a match! Start a conversation.`}
                                            {notification.type === 'message' && `sent you a message.`}
                                            {notification.type === 'report_resolved' && `We've reviewed your report and taken action. Thank you for keeping Spark safe.`}
                                            {notification.type === 'report_dismissed' && `We've reviewed your report and found it doesn't violate our safety guidelines at this time.`}
                                            {notification.type === 'profile_view' && `viewed your profile.`}
                                            {notification.type === 'subscription_expired' && `Your Premium subscription has expired. Upgrade to continue enjoying Premium features!`}
                                            {notification.type === 'subscription_expiring_soon' && `Your Premium subscription is expiring in 3 days. Renew now to avoid losing access!`}
                                        </>
                                    )}
                                </p>
                            </div>

                            {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                        </div>
                    ))}
                    {hasMore && (
                        <div className="flex justify-center mt-8 pb-8">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition disabled:opacity-50"
                            >
                                {loadingMore ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            <ProfilePreviewModal
                isOpen={!!previewUser}
                userId={previewUser}
                onClose={() => setPreviewUser(null)}
            />
        </div>
    );
}

