'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getMatches, getMessages, sendMessage, markMessagesAsRead, getUnreadMessageCount } from '@/services/messageService';
import { MatchResponse, MessageResponse } from '@/types/message/response';
import { useSocketContext } from '@/contexts/SocketContext';
import { useAppSelector } from '@/store/hooks';
import { Send, ArrowLeft } from 'lucide-react';


export default function MessagesPage() {
    const searchParams = useSearchParams();
    const matchIdFromUrl = searchParams.get('matchId');

    const [matches, setMatches] = useState<MatchResponse[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<MatchResponse | null>(null);
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { socket, emitTyping, onlineUsers, typingUsers, setUnreadMessageCount, joinChat, leaveChat } = useSocketContext();

    const currentUser = useAppSelector((state) => state.auth.user);


    // Load matches
    useEffect(() => {
        loadMatches();
    }, []);

    // Auto-select match from URL
    useEffect(() => {
        if (matchIdFromUrl && matches.length > 0) {
            const match = matches.find(m => m.id === matchIdFromUrl);
            if (match) {
                handleSelectMatch(match);
            }
        }
    }, [matchIdFromUrl, matches]);

    // Join/Leave chat room
    useEffect(() => {
        if (selectedMatch) {
            joinChat(selectedMatch.id);
            return () => {
                leaveChat(selectedMatch.id);
            };
        }
    }, [selectedMatch, joinChat, leaveChat]);

    // Listen for real-time messages
    useEffect(() => {
        if (!socket || !selectedMatch) return;

        const handleNewMessage = (data: any) => {
            if (data.matchId === selectedMatch.id) {
                setMessages(prev => [...prev, data.message]);
                scrollToBottom();

                // Mark as read
                markMessagesAsRead(selectedMatch.id).then(async () => {
                    const count = await getUnreadMessageCount();
                    setUnreadMessageCount(count);
                });
            }
        };

        socket.on('message', handleNewMessage);

        return () => {
            socket.off('message', handleNewMessage);
        };
    }, [socket, selectedMatch]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load matches
    const loadMatches = async () => {
        try {
            const data = await getMatches();
            setMatches(data);
        } catch (error) {
            console.error('Failed to load matches:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle select match for messages page
    const handleSelectMatch = async (match: MatchResponse) => {
        setSelectedMatch(match);
        setMessages([]);

        try {
            const msgs = await getMessages(match.id, 50);
            setMessages(msgs);
            await markMessagesAsRead(match.id);
            const count = await getUnreadMessageCount();
            setUnreadMessageCount(count);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    // Handle send message for messages page
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedMatch || sending) return;

        setSending(true);
        try {
            const message = await sendMessage({
                matchId: selectedMatch.id,
                content: newMessage.trim()
            });

            setMessages(prev => [...prev, message]);
            setNewMessage('');
            emitTyping(selectedMatch.id, false);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    // Handle typing for messages page
    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (selectedMatch) {
            emitTyping(selectedMatch.id, e.target.value.length > 0);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-80px)]">
                <div className="w-full md:w-80 border-r border-white/10 p-4 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 p-3 mb-2 bg-white/5 rounded-lg">
                            <div className="w-12 h-12 bg-white/10 rounded-full" />
                            <div className="flex-1">
                                <div className="h-4 bg-white/10 rounded mb-2" />
                                <div className="h-3 bg-white/10 rounded w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-0px)] md:h-screen pt-4 md:pt-0">
            {/* Matches List - Left Sidebar */}
            <div className={`${selectedMatch ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-white/10 bg-black shrink-0 h-full`}>
                <div className="p-4 border-b border-white/10 pl-6">
                    <h2 className="text-xl font-bold">Messages</h2>
                    <p className="text-sm text-gray-400">{matches.length} conversations</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {matches.length === 0 ? (
                        <div className="p-8 text-center pt-20">
                            <p className="text-gray-400">No matches yet</p>
                        </div>
                    ) : (
                        // Render matches
                        <div className="divide-y divide-white/5">
                            {matches.map((match) => {
                                const otherUser = match.users.find(u => u.userId !== currentUser?.id) || match.users[0];
                                const isSelected = selectedMatch?.id === match.id;


                                return (
                                    <button
                                        key={match.id}
                                        onClick={() => handleSelectMatch(match)}
                                        className={`w-full flex items-center gap-3 p-4 pl-6 hover:bg-white/5 transition ${isSelected ? 'bg-white/10' : ''}`}
                                    >
                                        <img
                                            src={otherUser.profilePhoto || '/default-avatar.png'}
                                            alt={otherUser.name}
                                            className="w-12 h-12 rounded-full object-cover shrink-0"
                                        />
                                        <div className="flex-1 text-left min-w-0">

                                            <h3 className="font-semibold truncate">{otherUser.name}</h3>
                                            {match.lastMessageAt && (
                                                <p className="text-sm text-gray-400 truncate">
                                                    {new Date(match.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area - Right Side */}
            {selectedMatch ? (
                <div className="flex-1 flex flex-col h-full bg-black/50 backdrop-blur-sm">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-black/40">
                        <button
                            onClick={() => setSelectedMatch(null)}
                            className="md:hidden p-2 hover:bg-white/5 rounded-lg text-gray-300"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        {(() => {
                            const otherUser = selectedMatch.users.find(u => u.userId !== currentUser?.id) || selectedMatch.users[0];
                            const isOnline = onlineUsers.includes(otherUser.userId);

                            return (
                                <>
                                    <img
                                        src={otherUser.profilePhoto || '/default-avatar.png'}
                                        alt={otherUser.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold">{otherUser.name}</h3>

                                        {isOnline && (
                                            <p className="text-xs text-green-400 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                Active now
                                            </p>
                                        )}
                                    </div>
                                </>
                            );
                        })()}

                    </div>


                    {/* Messages  (rendering messages) */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => {
                            // Check if the message is from the current user
                            const isOwn = msg.senderId === currentUser?.id;

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    {/* Message bubble  where the message is displayed like left side and right side for user*/}
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${isOwn
                                            ? 'bg-linear-to-r from-primary to-purple-600 text-white rounded-tr-sm'
                                            : 'bg-white/10 text-white rounded-tl-sm'
                                            }`}
                                    >
                                        <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                                        <p className={`text-[10px] mt-1 text-right ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing Indicator */}
                        {(() => {
                            const otherUser = selectedMatch.users.find(u => u.userId !== currentUser?.id) || selectedMatch.users[0];
                            const isTyping = typingUsers[selectedMatch.id]?.includes(otherUser.userId);

                            if (!isTyping) return null;

                            return (
                                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm border border-white/5">
                                        <div className="flex gap-1 items-center">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0s]" />
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium ml-1 italic">{otherUser.name} is typing...</span>
                                    </div>
                                </div>
                            );
                        })()}

                        <div ref={messagesEndRef} />
                    </div>


                    {/* Message Input */}
                    <div className="p-4 border-t border-white/10 bg-black/40">
                        <div className="flex gap-2 max-w-4xl mx-auto">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={handleTyping}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a message..."
                                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-primary/50 focus:bg-white/10 transition px-6"
                                disabled={sending}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || sending}
                                className="p-3 bg-linear-to-r from-primary to-purple-500 rounded-full hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 aspect-square flex items-center justify-center transform hover:scale-105 active:scale-95"
                            >
                                <Send className="w-5 h-5 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 items-center justify-center text-gray-500 bg-black/20">
                    <div className="text-center p-8 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/5 max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                            <Send className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-300 mb-2">Your Messages</h3>
                        <p className="text-gray-400">Select a conversation from the list to start chatting or find new matches to talk to.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
