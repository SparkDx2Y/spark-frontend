'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@/hooks/useSocket';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    onlineUsers: string[];
    typingUsers: { [matchId: string]: string[] };
    unreadCount: number;
    setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
    emitTyping: (matchId: string, isTyping: boolean) => void;
}


const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const socketData = useSocket();

    return (
        <SocketContext.Provider value={socketData}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
};
