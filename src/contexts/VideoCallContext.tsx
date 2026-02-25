'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSocketContext } from './SocketContext';
import { useAppSelector } from '@/store/hooks';
import VideoCallModal from '@/components/user/messages/VideoCallModal';
import { User } from '@/store/features/auth/authSlice';

interface CallDetails {
    otherUser: { id: string; name: string; profilePhoto?: string };
    isIncoming: boolean;
    signal?: RTCSessionDescriptionInit;
}

interface IncomingCallPayload {
    from: {
        id?: string;
        userId?: string;
        _id?: string;
        name?: string;
        username?: string;
        profilePhoto?: string | null;
        image?: string;
        avatar?: string;
    };
    signalData: RTCSessionDescriptionInit;
    signal?: RTCSessionDescriptionInit; // Backend might send either
}

interface VideoCallContextType {
    startCall: (user: { id: string; name: string; profilePhoto?: string }) => void;
    isOpen: boolean;
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined);

export const VideoCallProvider = ({ children }: { children: ReactNode }) => {
    const { socket } = useSocketContext();
    const currentUser = useAppSelector((state) => state.auth.user);

    const [isOpen, setIsOpen] = useState(false);
    const [callDetails, setCallDetails] = useState<CallDetails | null>(null);

    const startCall = (user: { id: string; name: string; profilePhoto?: string }) => {
        setCallDetails({
            otherUser: user,
            isIncoming: false
        });
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setCallDetails(null);
    };

    // Global Listener for Incoming Calls
    useEffect(() => {
        if (!socket) return;

        const handleIncomingCall = (data: IncomingCallPayload) => {
            // data.from should contain user details (id, name, photo)
            const caller = data.from;
            setCallDetails({
                otherUser: {
                    id: caller.id || caller.userId || caller._id || 'unknown',
                    name: (caller.name || caller.username || 'Unknown Caller') as string,
                    profilePhoto: (caller.profilePhoto || caller.image || caller.avatar || undefined) as string | undefined
                },
                isIncoming: true,
                signal: data.signalData || data.signal
            });
            setIsOpen(true);
        };

        socket.on('call_user', handleIncomingCall);

        return () => {
            socket.off('call_user', handleIncomingCall);
        };
    }, [socket]);

    return (
        <VideoCallContext.Provider value={{ startCall, isOpen }}>
            {children}

            {isOpen && callDetails && currentUser && socket && (
                <VideoCallModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    socket={socket}
                    currentUser={currentUser}
                    otherUser={callDetails.otherUser}
                    isIncomingInitial={callDetails.isIncoming}
                    callerSignalInitial={callDetails.signal}
                />
            )}
        </VideoCallContext.Provider>
    );
};

export const useVideoCallContext = () => {
    const context = useContext(VideoCallContext);
    if (!context) {
        throw new Error('useVideoCallContext must be used within a VideoCallProvider');
    }
    return context;
};
