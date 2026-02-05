import { useEffect, useState, useCallback} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '@/store/hooks';
import { showSuccess, showInfo } from '@/utils/toast';
import { getNotificationCount } from '@/services/notificationService';

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [typingUsers, setTypingUsers] = useState<{ [matchId: string]: string[] }>({});
    const [unreadCount, setUnreadCount] = useState(0);

    const user = useAppSelector((state) => state.auth.user);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    // useEffect to handle socket connection
    useEffect(() => {
        if (!isAuthenticated || !user) {
            // Disconnect if user logs out
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Connect to Socket.IO server
        // Extract base URL from API_BASE_URL (remove /api/v1)
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
        const socketUrl = apiBaseUrl.replace('/api/v1', '');

        const newSocket = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        // Initial fetch of unread count
        const fetchUnreadCount = async () => {
            try {
                const count = await getNotificationCount();
                setUnreadCount(count);
            } catch (error) {
                console.error('Failed to fetch unread count:', error);
            }
        };

        fetchUnreadCount();


        // Connection events(registering the user in socket)
        newSocket.on('connect', () => {
            setIsConnected(true);
            // Register user with their ID
            newSocket.emit('register', user.id);
        });

        newSocket.on('connected', (data) => {
            console.log('Registered as user:', data.userId);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        // Listen for notifications
        newSocket.on('notification', (data) => {
            setUnreadCount(prev => prev + 1);
            if (data.type === 'like') {
                showInfo('Someone liked you!');
            } else if (data.type === 'message') {
                showInfo(data.message || 'New message received');
            }
        });

        newSocket.on('match', (data) => {
            setUnreadCount(prev => prev + 1);
            showSuccess("It's a Match!");
        });


        // Listen for typing indicators
        newSocket.on('typing', (data: { matchId: string; userId: string; isTyping: boolean }) => {
            setTypingUsers(prev => {
                const currentMatchTyping = prev[data.matchId] || [];

                if (data.isTyping) {
                    // Add user if not already in list
                    if (!currentMatchTyping.includes(data.userId)) {
                        return {
                            ...prev,
                            [data.matchId]: [...currentMatchTyping, data.userId]
                        };
                    }
                } else {
                    // Remove user
                    return {
                        ...prev,
                        [data.matchId]: currentMatchTyping.filter(id => id !== data.userId)
                    };
                }
                return prev;
            });
        });

        // Listen for online status updates
        newSocket.on('user_online', (userId: string) => {
            setOnlineUsers(prev => [...Array.from(new Set([...prev, userId]))]); // Ensure uniqueness
        });

        newSocket.on('user_offline', (userId: string) => {
            setOnlineUsers(prev => prev.filter(id => id !== userId));
            // Also clean up typing status if user goes offline
            setTypingUsers(prev => {
                const newState = { ...prev };
                Object.keys(newState).forEach(matchId => {
                    newState[matchId] = newState[matchId].filter(id => id !== userId);
                });
                return newState;
            });
        });

        newSocket.on('online_users', (users: string[]) => {
            setOnlineUsers(users);
        });


        setSocket(newSocket);

        return () => {
            console.log('Cleaning up socket connection');
            newSocket.disconnect();
        };
    }, [isAuthenticated, user]);

    // Helper function to emit typing indicator
    const emitTyping = useCallback((matchId: string, isTyping: boolean) => {
        if (socket && user) {
            socket.emit('typing', {
                matchId,
                userId: user.id,
                isTyping
            });
        }
    }, [socket, user]);

    return {
        socket,
        isConnected,
        onlineUsers,
        typingUsers,
        unreadCount,
        setUnreadCount,
        emitTyping
    };



};
