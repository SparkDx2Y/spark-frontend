'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead
} from '@/services/notificationService';
import { NotificationResponse } from '@/types/notification/response';
import { useSocketContext } from '@/contexts/SocketContext';

import { Heart, MessageCircle, Bell, Check, ShieldCheck, ShieldAlert, ShieldX, User } from 'lucide-react';
import ProfilePreviewModal from '@/components/user/ProfilePreviewModal';


export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewUser, setPreviewUser] = useState<string | null>(null);
    const router = useRouter();
    const { socket, unreadCount, setUnreadCount } = useSocketContext();


    // Load notifications from the database on mount and when socket receives a notification
    useEffect(() => {
        loadNotifications();

        if (socket) {
            socket.on('notification', (data) => {
                loadNotifications();
            });

            return () => {
                socket.off('notification');
            };
        }
    }, [socket]);

    // Load notifications from the database
    const loadNotifications = async () => {
        try {
            const response = await getNotifications();
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mark a notification as read
    const handleRead = async (notificationId: string, isRead: boolean) => {
        if (isRead) return;

        try {
            await markNotificationAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark read:', error);
        }
    };

    // Mark all notifications as read
    const handleReadAll = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all read:', error);
        }
    };

    // Handle notification click
    const handleNotificationClick = async (notification: NotificationResponse) => {
        await handleRead(notification.id, notification.isRead);

        if (notification.type === 'match' && notification.matchId) {
            router.push(`/user/messages?matchId=${notification.matchId}`);
        } else if (notification.type === 'message' && notification.matchId) {
            router.push(`/user/messages?matchId=${notification.matchId}`);
        } else if (notification.type === 'like' && notification.fromUser?.userId) {
            setPreviewUser(notification.fromUser.userId);
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
                                {notification.fromUser?.profilePhoto ? (
                                    <img
                                        src={notification.fromUser.profilePhoto}
                                        alt={notification.fromUser.name || 'User'}
                                        className="w-12 h-12 rounded-full object-cover shrink-0"
                                    />
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
                                    <h3 className={`font-semibold ${notification.isRead ? 'text-gray-300' : 'text-white'}`}>
                                        {notification.fromUser?.name || 'Someone'}
                                    </h3>
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                        {formatTime(notification.createdAt)}
                                    </span>
                                </div>
                                <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-300'}`}>
                                    {notification.type === 'like' && `liked your profile!`}
                                    {notification.type === 'match' && `It's a match! Start a conversation.`}
                                    {notification.type === 'message' && `sent you a message.`}
                                    {notification.type === 'report_resolved' && `We've reviewed your report and taken action. Thank you for keeping Spark safe.`}
                                    {notification.type === 'report_dismissed' && `We've reviewed your report and found it doesn't violate our safety guidelines at this time.`}
                                    {/* Handle other types if needed */}
                                </p>
                            </div>

                            {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                        </div>
                    ))}
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

