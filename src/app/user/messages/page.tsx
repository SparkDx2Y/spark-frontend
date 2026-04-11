'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getMatches, getMessages, sendMessage, markMessagesAsRead, getUnreadMessageCount, deleteMessage } from '@/services/messageService';
import { MatchResponse, MessageResponse } from '@/types/message/response';
import { getDateSuggestions } from '@/services/matchService';
import { useSocketContext } from '@/contexts/SocketContext';
import { useAppSelector } from '@/store/hooks';
import { Send, ArrowLeft, Plus, Image as ImageIcon, Mic, Video, Phone, MoreVertical, X, Camera, MessageSquare, Smile, Play, Pause, Trash2, Loader2, AlertTriangle, Lock, Search, MapPin, Star, ExternalLink, Coffee, Utensils, Music } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { uploadChatMedia } from '@/services/fileService';
import { useVideoCallContext } from '@/contexts/VideoCallContext';
import ReportModal from '@/components/user/ReportModal';
import { handleApiError } from '@/utils/toast';
import { getErrorMessage } from '@/utils/errors';
import { getCurrentPlan } from '@/services/subscriptionService';
import type { SubscriptionPlan } from '@/types/subscription';
import PremiumUpsellModal from '@/components/user/PremiumUpsellModal';

interface SocketMessageUpdate {
    type: 'message' | 'message_deleted';
    matchId: string;
    message?: MessageResponse;
    messageId?: string;
}

function AudioMessage({ src, isOwn, isUploading }: { src: string; isOwn: boolean; isUploading?: boolean }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current || isUploading) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        // Simple duration handling
        const onLoadedMetadata = () => setDuration(audio.duration);

        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`flex items-center gap-3 min-w-[200px] py-1 ${isUploading ? 'opacity-80' : ''}`}>
            <button
                onClick={togglePlay}
                disabled={isUploading}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isOwn ? 'bg-white/20 hover:bg-white/30' : 'bg-primary/20 hover:bg-primary/30'} transition-colors ${isUploading ? 'cursor-not-allowed' : ''}`}
            >
                {isUploading ? (
                    <Loader2 className={`w-5 h-5 animate-spin ${isOwn ? 'text-white' : 'text-primary'}`} />
                ) : isPlaying ? (
                    <Pause className={`w-5 h-5 ${isOwn ? 'text-white' : 'text-primary'}`} />
                ) : (
                    <Play className={`w-5 h-5 ${isOwn ? 'text-white' : 'text-primary'}`} />
                )}
            </button>
            <div className="flex-1 space-y-2">
                <div className={`h-1.5 w-full rounded-full ${isOwn ? 'bg-white/20' : 'bg-white/10'}`}>
                    <div
                        className={`h-full rounded-full ${isOwn ? 'bg-white' : 'bg-primary'} transition-all`}
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] opacity-70">
                    <span>{formatTime(currentTime)}</span>
                    <span>{isUploading ? 'Sending...' : formatTime(duration)}</span>
                </div>
            </div>
            <audio ref={audioRef} src={src} className="hidden" preload="metadata" />
        </div>
    );
}

export default function MessagesPage() {
    const searchParams = useSearchParams();
    const matchIdFromUrl = searchParams.get('matchId');

    const [matches, setMatches] = useState<MatchResponse[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<MatchResponse | null>(null);
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showAttachments, setShowAttachments] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const shouldSendAfterStopRef = useRef(false);
    const [isPaused, setIsPaused] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [upsellModal, setUpsellModal] = useState<{ isOpen: boolean, title: string, desc: string }>({ isOpen: false, title: '', desc: '' });
    const [dateSuggestions, setDateSuggestions] = useState<any[]>([]);
    const [isFetchingDate, setIsFetchingDate] = useState(false);
    const [showDatePanel, setShowDatePanel] = useState(false);
    const [selectedDateCategory, setSelectedDateCategory] = useState('cafe');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { socket, emitTyping, onlineUsers, typingUsers, setUnreadMessageCount, joinChat, leaveChat } = useSocketContext();
    const { startCall } = useVideoCallContext();

    const currentUser = useAppSelector((state) => state.auth.user);


    // Load matches
    useEffect(() => {
        const timer = setTimeout(() => {
            loadMatches(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Auto-select match from URL
    useEffect(() => {
        if (matchIdFromUrl && matches.length > 0) {
            const match = matches.find(m => m.id === matchIdFromUrl);
            if (match) {
                handleSelectMatch(match);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchIdFromUrl, matches]);

    // Join/Leave chat room
    useEffect(() => {
        if (selectedMatch) {
            joinChat(selectedMatch.id);
            return () => {
                emitTyping(selectedMatch.id, false);
                leaveChat(selectedMatch.id);
            };
        }
    }, [selectedMatch, joinChat, leaveChat, emitTyping]);

    // Helper to move active chat to top
    const updateMatchList = (matchId: string, content: string, createdAt: string, type: 'text' | 'image' | 'audio' | 'video_call' | 'date_proposal' = 'text') => {
        setMatches(prev => {
            const index = prev.findIndex(m => m.id === matchId);
            if (index === -1) return prev;

            const updatedMatch = {
                ...prev[index],
                lastMessage: type === 'date_proposal' ? 'Proposed a date 📍' : content,
                lastMessageAt: createdAt,
                lastMessageType: type
            };
            const newMatches = [...prev];
            newMatches.splice(index, 1);
            newMatches.unshift(updatedMatch);
            return newMatches;
        });
    };

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data: SocketMessageUpdate) => {
            // Handle Message Deletion
            if (data.type === 'message_deleted') {
                if (selectedMatch && data.matchId === selectedMatch.id) {
                    setMessages(prev => prev.filter(m => m.id !== data.messageId));
                }

                if (data.matchId) {
                    loadMatches();
                }
                return;
            }

            // 1. Update Messages Area (if chat is open)
            if (selectedMatch && data.matchId === selectedMatch.id && data.message) {
                const newMessage = data.message;
                setMessages(prev => [...prev, newMessage]);
                scrollToBottom();

                // Mark as read
                markMessagesAsRead(selectedMatch.id).then(async () => {
                    const response = await getUnreadMessageCount();
                    setUnreadMessageCount(response.data.count);
                });
            }

            if (data.message) {
                updateMatchList(data.matchId, data.message.content, data.message.createdAt, data.message.type);
            }
        };

        socket.on('message', handleNewMessage);

        return () => {
            socket.off('message', handleNewMessage);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selectedMatch]);

    // Handle delete message
    const handleDeleteMessage = async (messageId: string) => {
        setMessages(prev => prev.filter(m => m.id !== messageId));

        try {
            await deleteMessage(messageId);

            loadMatches();

            if (selectedMatch) {
                const response = await getMessages(selectedMatch.id, 50);
                setMessages(response.data);
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
            if (selectedMatch) {
                const response = await getMessages(selectedMatch.id, 50);
                setMessages(response.data);
            }
        }
    };

    // Auto-scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load matches
    const loadMatches = async (search?: string) => {
        try {
            const [response, planRes] = await Promise.all([
                getMatches(1, 50, search),
                getCurrentPlan()
            ]);
            setCurrentPlan(planRes.plan);
            // Sort by lastMessageAt descending (newest first)
            const sortedData = response.data.sort((a, b) => {
                const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
                const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
                return dateB - dateA;
            });
            setMatches(sortedData);
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
        setShowAttachments(false);
        setNewMessage('');
        deleteRecording();

        try {
            const response = await getMessages(match.id, 50);
            setMessages(response.data);
            await markMessagesAsRead(match.id);
            const countResponse = await getUnreadMessageCount();
            setUnreadMessageCount(countResponse.data.count);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    // Handle send message for messages page
    const handleSendMessage = async (
        customContent?: string, 
        type: 'text' | 'image' | 'audio' | 'date_proposal' = 'text', 
        metadata?: {
            placeId?: string;
            name?: string;
            address?: string;
            rating?: number;
            photo?: string;
        }
    ) => {
        const content = customContent || newMessage.trim();
        if (!content || !selectedMatch || sending) return;

        let tempId: string | null = null;

        if (type === 'text') {
            setNewMessage('');
            if (inputRef.current) inputRef.current.style.height = '44px';
            emitTyping(selectedMatch.id, false);

            tempId = `temp-${Date.now()}`;
            const optimisticMessage: MessageResponse = {
                id: tempId,
                matchId: selectedMatch.id,
                senderId: currentUser?.id || '',
                content: content,
                type: 'text',
                isRead: false,
                createdAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, optimisticMessage]);
        }

        setSending(true);
        try {
            const response = await sendMessage({
                matchId: selectedMatch.id,
                content: content,
                type: type,
                metadata: metadata
            });
            const message = response.data;

            if (tempId) {
                setMessages(prev => prev.map(m => m.id === tempId ? message : m));
            } else {
                setMessages(prev => [...prev, message]);
            }

            updateMatchList(selectedMatch.id, message.content, message.createdAt, message.type);

        } catch (error) {
            console.error('Failed to send message:', error);

            const msg = getErrorMessage(error);
            if (msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('upgrade') || msg.toLowerCase().includes('premium')) {
                setUpsellModal({
                    isOpen: true,
                    title: 'Limit Reached ',
                    desc: msg
                });
            } else {
                handleApiError(error, 'Failed to send message');
            }

            if (tempId) {

                setMessages(prev => prev.filter(m => m.id !== tempId));
                setNewMessage(content); // Restore content?
            }
        } finally {
            setSending(false);
        }
    };

    // Handle typing for messages page
    const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);
        setShowAttachments(false);

        // Auto-resize textarea
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }

        if (selectedMatch) {
            emitTyping(selectedMatch.id, e.target.value.length > 0);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedMatch) return;

        setShowAttachments(false);

        const tempId = `temp-${Date.now()}`;
        const blobUrl = URL.createObjectURL(file);

        const optimisticMessage: MessageResponse = {
            id: tempId,
            matchId: selectedMatch.id,
            senderId: currentUser?.id || '',
            content: blobUrl,
            type: 'image',
            isRead: false,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, optimisticMessage]);

        setUploading(true);
        try {
            const url = await uploadChatMedia(file, 'image');
            const response = await sendMessage({
                matchId: selectedMatch.id,
                content: url,
                type: 'image'
            });
            const message = response.data;

            setMessages(prev => prev.map(m => m.id === tempId ? message : m));
            updateMatchList(selectedMatch.id, message.content, message.createdAt, 'image');
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Failed to upload image:', error);
            const msg = getErrorMessage(error);
            if (msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('upgrade') || msg.toLowerCase().includes('premium')) {
                setUpsellModal({ isOpen: true, title: 'Limit Reached ', desc: msg });
            } else {
                handleApiError(error, 'Failed to send image');
            }
            setMessages(prev => prev.filter(m => m.id !== tempId));

        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedMatch) return;

        setShowAttachments(false);

        const tempId = `temp-${Date.now()}`;
        const blobUrl = URL.createObjectURL(file);

        const optimisticMessage: MessageResponse = {
            id: tempId,
            matchId: selectedMatch.id,
            senderId: currentUser?.id || '',
            content: blobUrl,
            type: 'audio',
            isRead: false,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, optimisticMessage]);

        setUploading(true);
        try {
            const url = await uploadChatMedia(file, 'audio');
            const response = await sendMessage({
                matchId: selectedMatch.id,
                content: url,
                type: 'audio'
            });
            const message = response.data;

            setMessages(prev => prev.map(m => m.id === tempId ? message : m));
            updateMatchList(selectedMatch.id, message.content, message.createdAt, 'audio');
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Failed to upload audio:', error);
            const msg = getErrorMessage(error);
            if (msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('upgrade') || msg.toLowerCase().includes('premium')) {
                setUpsellModal({ isOpen: true, title: 'Limit Reached ', desc: msg });
            } else {
                handleApiError(error, 'Failed to send audio');
            }
            setMessages(prev => prev.filter(m => m.id !== tempId));

        } finally {
            setUploading(false);
            if (audioInputRef.current) audioInputRef.current.value = '';
        }
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji);
        // Focus the textarea after selecting an emoji
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Audio Recording Functions
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(audioBlob);
                stream.getTracks().forEach(track => track.stop());
                setIsPaused(false);

                if (shouldSendAfterStopRef.current) {
                    handleAudioSend(audioBlob);
                    shouldSendAfterStopRef.current = false;
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setIsPaused(false);
            shouldSendAfterStopRef.current = false;
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                if (!shouldSendAfterStopRef.current) {
                    setRecordingTime(prev => prev + 1);
                }
            }, 1000);
        } catch (error) {
            console.error('Error starting recording:', error);

        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && isRecording && !isPaused) {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current && isRecording && isPaused) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
    };

    const sendRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            shouldSendAfterStopRef.current = true;
            stopRecording();
        } else if (audioBlob) {
            handleAudioSend(audioBlob);
        }
    };

    const deleteRecording = () => {
        if (isRecording && mediaRecorderRef.current) {
            mediaRecorderRef.current.onstop = null;
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
        setAudioBlob(null);
        setRecordingTime(0);
    };

    const handleAudioSend = async (blobToSend?: Blob) => {
        const blob = blobToSend || audioBlob;
        if (!blob || !selectedMatch) return;

        // Optimistic Update
        const tempId = `temp-${Date.now()}`;
        const localUrl = URL.createObjectURL(blob);
        const optimisticMessage: MessageResponse = {
            id: tempId,
            matchId: selectedMatch.id,
            senderId: currentUser?.id || '',
            content: localUrl,
            type: 'audio',
            isRead: false,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setAudioBlob(null);
        setRecordingTime(0);

        setUploading(true);
        try {
            const url = await uploadChatMedia(blob, 'audio');
            const response = await sendMessage({
                matchId: selectedMatch.id,
                content: url,
                type: 'audio'
            });
            const message = response.data;


            setMessages(prev => prev.map(m => m.id === tempId ? message : m));

            updateMatchList(selectedMatch.id, message.content, message.createdAt, 'audio');

            URL.revokeObjectURL(localUrl);
        } catch (error) {
            console.error('Failed to send audio:', error);
            handleApiError(error, 'Failed to send audio');
            setMessages(prev => prev.filter(m => m.id !== tempId));
        } finally {
            setUploading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFetchDateSuggestions = async (categoryOverride?: any) => {
        if (!selectedMatch) return;
        
       
        const category = typeof categoryOverride === 'string' ? categoryOverride : selectedDateCategory;
        
        setIsFetchingDate(true);
        setShowDatePanel(true);
        try {
            const response = await getDateSuggestions(selectedMatch.id, category);
            setDateSuggestions(response.data);
        } catch (error) {
            console.error('Failed to get date suggestions:', error);
            handleApiError(error, 'Could not calculate midpoint or find spots');
            setShowDatePanel(false);
        } finally {
            setIsFetchingDate(false);
        }
    };

    // Refetch when category changes while panel is open
    useEffect(() => {
        if (showDatePanel && selectedMatch) {
            handleFetchDateSuggestions(selectedDateCategory);
        }
    }, [selectedDateCategory]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-black text-white p-4">
                <div className="w-80 h-full border-r border-white/10 p-4 space-y-4 animate-pulse hidden md:block">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-white/10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-white/10 rounded w-1/2" />
                                <div className="h-3 bg-white/10 rounded w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex-1 h-full p-4 space-y-4 animate-pulse">
                    <div className="h-16 bg-white/10 rounded-xl w-full mb-8" />
                    <div className="space-y-6">
                        <div className="h-10 bg-white/10 rounded-xl w-1/3" />
                        <div className="h-10 bg-white/10 rounded-xl w-1/2 ml-auto" />
                        <div className="h-20 bg-white/10 rounded-xl w-1/3" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 md:relative md:h-screen md:inset-auto flex bg-black overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Matches List - Sidebar */}
            <div className={`${selectedMatch ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-85 lg:w-96 border-r border-white/5 bg-black/40 backdrop-blur-xl shrink-0 z-10 transition-all duration-300 h-full`}>
                <div className="p-6 pb-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">Messages</h2>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <span className="text-xs font-bold text-primary">{matches.length}</span>
                        </div>
                    </div>
                    {/* Search Bar Placeholder for future */}
                    <div className="relative mb-4 group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-gray-200 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 scrollbar-hide space-y-1 pb-4">
                    {(() => {
                        const displayMatches = matches.filter(match => {
                            const otherUser = match.users.find(u => u.userId !== currentUser?.id) || match.users[0];
                            return !otherUser.isBlocked;
                        });

                        if (displayMatches.length === 0) {
                            return (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <MessageSquare className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-400 font-medium">No active matches</p>
                                    <p className="text-xs text-gray-600 mt-2">Start matching to find your spark!</p>
                                </div>
                            );
                        }

                        return displayMatches.map((match) => {
                            const otherUser = match.users.find(u => u.userId !== currentUser?.id) || match.users[0];
                            const isSelected = selectedMatch?.id === match.id;
                            const isOnline = onlineUsers.includes(otherUser.userId);

                            return (
                                <motion.button
                                    key={match.id}
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSelectMatch(match)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group ${isSelected ? 'bg-white/10 border border-white/5 shadow-lg' : 'hover:bg-white/5 border border-transparent'}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className={`relative w-14 h-14 rounded-full p-[2px] ${isSelected ? 'bg-linear-to-tr from-primary to-purple-500' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                            <Image
                                                src={otherUser.profilePhoto || '/default-avatar.png'}
                                                alt={otherUser.name}
                                                fill
                                                className="rounded-full object-cover border-2 border-black"
                                                unoptimized
                                            />
                                        </div>
                                        {isOnline && (
                                            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className={`font-semibold text-base truncate ${isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                                                {otherUser.name}
                                            </h3>
                                            {match.lastMessageAt && (
                                                <span className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                                    {new Date(match.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm truncate ${isSelected ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                            {match.lastMessageType === 'text' ? match.lastMessage :
                                                match.lastMessageType === 'image' ? 'Sent an image' :
                                                    match.lastMessageType === 'audio' ? 'Sent an audio' :
                                                        match.lastMessageType === 'date_proposal' ? 'Proposed a date 📍' :
                                                            match.lastMessageType === 'video_call' ? match.lastMessage :
                                                                match.lastMessage || 'Start a conversation'}
                                        </p>
                                    </div>
                                </motion.button>
                            );
                        });
                    })()}
                </div>
            </div>

            {/* Chat Area - Right Side */}
            {selectedMatch ? (
                <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 bg-black">
                    {/* Modern Glass Chat Header - Fixed */}
                    <div className="h-16 md:h-20 px-4 md:px-6 border-b border-white/5 flex items-center justify-between bg-black shrink-0 z-20">
                        <div className="flex items-center gap-3 md:gap-4">
                            <button
                                onClick={() => setSelectedMatch(null)}
                                className="md:hidden p-2 -ml-2 hover:bg-white/10 rounded-full text-gray-300 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            {(() => {
                                const otherUser = selectedMatch.users.find(u => u.userId !== currentUser?.id) || selectedMatch.users[0];
                                const isOnline = onlineUsers.includes(otherUser.userId);

                                return (
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="relative group cursor-pointer">
                                            <div className="absolute -inset-0.5 bg-linear-to-r from-primary to-purple-600 rounded-full opacity-0 group-hover:opacity-70 blur-sm transition duration-300"></div>
                                            <div className="relative w-10 h-10 md:w-11 md:h-11 overflow-hidden">
                                                <Image
                                                    src={otherUser.profilePhoto || '/default-avatar.png'}
                                                    alt={otherUser.name}
                                                    fill
                                                    className="rounded-full object-cover border-2 border-black"
                                                    unoptimized
                                                />
                                            </div>
                                            {isOnline && (
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-black rounded-full" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base md:text-lg text-white leading-tight">{otherUser.name}</h3>
                                            {isOnline && (
                                                <p className="text-[10px] md:text-xs text-green-400 font-medium flex items-center gap-1.5">
                                                    Online
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center gap-1 md:gap-3">
                            <button
                                onClick={() => {
                                    setUpsellModal({
                                        isOpen: true,
                                        title: 'Voice Calls Locked ',
                                        desc: 'Voice calls are not enabled in your current plan.\nUpgrade to Premium to use this feature!'
                                    });
                                }}
                                className="p-2 md:p-2.5 rounded-full text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                            >
                                {currentPlan && !currentPlan.features.audioEnabled ? (
                                    <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                                ) : (
                                    <Phone className="w-4 h-4 md:w-5 md:h-5" />
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    if (!selectedMatch) return;
                                    if (currentPlan && !currentPlan.features.videoCallEnabled) {
                                        setUpsellModal({
                                            isOpen: true,
                                            title: 'Video Calls Locked ',
                                            desc: 'Video calling is not enabled in your current plan.\nUpgrade to unlock face-to-face dates!'
                                        });
                                        return;
                                    }
                                    const otherUser = selectedMatch.users.find(u => u.userId !== currentUser?.id) || selectedMatch.users[0];
                                    startCall({
                                        id: otherUser.userId,
                                        name: otherUser.name,
                                        profilePhoto: otherUser.profilePhoto
                                    });
                                }}
                                className="p-2 md:p-2.5 rounded-full text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-300"
                            >
                                {currentPlan && !currentPlan.features.videoCallEnabled ? (
                                    <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                                ) : (
                                    <Video className="w-4 h-4 md:w-5 md:h-5" />
                                )}
                            </button>
                            <button
                                onClick={handleFetchDateSuggestions}
                                className="p-2 md:p-2.5 rounded-full text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all duration-300 relative group"
                                title="Find a midway date spot"
                            >
                                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Midway Date
                                </span>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-2 md:p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 relative z-30"
                                >
                                    <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <AnimatePresence>
                                    {showMenu && (
                                        <>
                                            <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-30 origin-top-right backdrop-blur-xl"
                                            >
                                                <button
                                                    onClick={() => {
                                                        setShowMenu(false);
                                                        setReportModalOpen(true);
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors"
                                                >
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Report User
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>


                    {/* Messages Area */}
                    <div
                        className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                        onClick={() => {
                            setShowAttachments(false);
                            setShowEmojiPicker(false);
                        }}
                    >
                        {messages.map((msg, index) => {
                            const isOwn = msg.senderId === currentUser?.id;
                            const isConsecutive = index > 0 && messages[index - 1].senderId === msg.senderId;

                           
                            const date = new Date(msg.createdAt);
                            const prevDate = index > 0 ? new Date(messages[index - 1].createdAt) : null;

                            const showDateSeparator = !prevDate || date.toDateString() !== prevDate.toDateString();

                            let dateLabel = '';
                            if (showDateSeparator) {
                                const today = new Date();
                                const yesterday = new Date();
                                yesterday.setDate(today.getDate() - 1);

                                if (date.toDateString() === today.toDateString()) {
                                    dateLabel = 'Today';
                                } else if (date.toDateString() === yesterday.toDateString()) {
                                    dateLabel = 'Yesterday';
                                } else {
                                    dateLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
                                }
                            }

                            const isEmoji = msg.type === 'text' && /^[\p{Extended_Pictographic}\p{Emoji_Presentation}\s]+$/u.test(msg.content);
                            const isImage = msg.type === 'image';
                            const isDateProposal = msg.type === 'date_proposal';

                            return (
                                <div key={msg.id}>
                                    {showDateSeparator && (
                                        <div className="flex justify-center my-6">
                                            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-gray-500 font-medium uppercase tracking-widest border border-white/5">
                                                {dateLabel}
                                            </span>
                                        </div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group mb-6 relative`}
                                    >
                                        {/* Actions for Own Messages */}
                                        {isOwn && !msg.id.startsWith('temp-') && (
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center mr-2">
                                                <button
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white/5 rounded-full transition-colors"
                                                    title="Delete message"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        <div className={`max-w-[70%] sm:max-w-[60%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                                            <div
                                                className={`
                                                    relative selection:bg-black/30 selection:text-white
                                                    ${isEmoji
                                                        ? 'bg-transparent text-7xl md:text-8xl p-0 shadow-none border-none leading-none' /* Emoji Style - Fixed large size */
                                                        : `text-sm md:text-base ${isImage || isDateProposal
                                                            ? `p-1.5 shadow-md backdrop-blur-sm ${ // Card/Image Style
                                                            isOwn
                                                                ? `bg-transparent ${isConsecutive ? 'rounded-2xl' : 'rounded-2xl rounded-tr-none'}`
                                                                : `bg-[#1a1a1a] border border-white/5 ${isConsecutive ? 'rounded-2xl' : 'rounded-2xl rounded-tl-none'}`
                                                            }`
                                                            : `px-5 py-3 shadow-md backdrop-blur-sm ${ // Standard Text Style
                                                            isOwn
                                                                ? `bg-linear-to-br from-primary via-primary/90 to-purple-600 text-white ${isConsecutive ? 'rounded-2xl' : 'rounded-2xl rounded-tr-none'}`
                                                                : `bg-[#1a1a1a] text-gray-100 border border-white/5 ${isConsecutive ? 'rounded-2xl' : 'rounded-2xl rounded-tl-none'}`
                                                            }`
                                                        }`
                                                    }
                                                `}
                                            >
                                                {msg.type === 'text' && (
                                                    <p className={`leading-relaxed whitespace-pre-wrap wrap-break-word break-all ${isEmoji ? 'leading-normal' : ''}`}>{msg.content}</p>
                                                )}
                                                {msg.type === 'image' && (
                                                    <div className="relative group">
                                                        <div className="relative w-64 md:w-80 h-60 md:h-80 group overflow-hidden rounded-xl bg-white/5 border border-white/10">
                                                            <Image
                                                                src={msg.content}
                                                                alt="Message attachment"
                                                                fill
                                                                className={`object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity ${msg.id.startsWith('temp-') ? 'opacity-50' : ''}`}
                                                                onClick={() => !msg.id.startsWith('temp-') && setLightboxImage(msg.content)}
                                                                unoptimized
                                                            />
                                                        </div>
                                                        {msg.id.startsWith('temp-') && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {msg.type === 'audio' && (
                                                    <AudioMessage
                                                        src={msg.content}
                                                        isOwn={isOwn}
                                                        isUploading={msg.id.startsWith('temp-')}
                                                    />
                                                )}
                                                {msg.type === 'video_call' && (
                                                    <div className={`flex items-center gap-2 py-1 px-1 ${isOwn ? 'text-white' : 'text-primary'}`}>
                                                        <Video className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{msg.content}</span>
                                                    </div>
                                                )}
                                                {msg.type === 'date_proposal' && msg.metadata && (
                                                    <div className="w-64 md:w-72 bg-[#0d0d0d] rounded-xl overflow-hidden shadow-2xl border border-white/5">
                                                        {msg.metadata.photo && (
                                                            <div className="relative h-32 w-full">
                                                                <Image
                                                                    src={msg.metadata.photo}
                                                                    alt={msg.metadata.name || 'Venue'}
                                                                    fill
                                                                    className="object-cover"
                                                                    unoptimized
                                                                />
                                                                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-1">
                                                                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                                                                    <span className="text-[10px] text-white font-bold">{msg.metadata.rating || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="p-4">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-sm font-bold text-white truncate">{msg.metadata.name}</h4>
                                                                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{msg.metadata.address}</p>
                                                                </div>
                                                                <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                                                                    <MapPin className="w-4 h-4 text-green-400" />
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="mt-3 text-xs text-gray-300 leading-relaxed italic bg-white/5 p-2 rounded-lg border border-white/5">
                                                                "{msg.content}"
                                                            </div>

                                                            <a
                                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(msg.metadata.name + ' ' + msg.metadata.address)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white transition-all"
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                                View in Maps
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {!isEmoji && !msg.id.startsWith('temp-') && (
                                                <p className={`text-[10px] mt-1.5 font-medium px-1 ${isOwn ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}

                        {/* Typing Indicator */}
                        {(() => {
                            if (!selectedMatch) return null;
                            const otherUser = selectedMatch.users.find(u => u.userId !== currentUser?.id) || selectedMatch.users[0];
                            const isTyping = typingUsers[selectedMatch.id]?.includes(otherUser.userId);

                            if (!isTyping) return null;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start mb-6"
                                >
                                    <div className="bg-[#1a1a1a] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                                        <div className="flex gap-1">
                                            {[0, 0.15, 0.3].map((delay, i) => (
                                                <motion.span
                                                    key={i}
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                                                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Enhanced Message Input Area */}
                    <div className="p-3 pb-24 md:p-6 md:pb-6 bg-black border-t border-white/5 shrink-0 z-30">
                        <div className="max-w-4xl mx-auto relative flex items-end gap-2 md:gap-3">
                            {/* ... Attachment Menu ... */}
                            <AnimatePresence>
                                {showAttachments && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: -8, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full left-0 mb-2 p-1.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl flex items-center gap-1 z-50 origin-bottom-left"
                                    >
                                        {[
                                            {
                                                icon: currentPlan && !currentPlan.features.mediaSharingEnabled ? Lock : ImageIcon, color: "text-blue-400", label: "Media", bg: "hover:bg-blue-400/20",
                                                onClick: () => {
                                                    if (currentPlan && !currentPlan.features.mediaSharingEnabled) {
                                                        setUpsellModal({
                                                            isOpen: true,
                                                            title: 'Media Sharing Locked 📸',
                                                            desc: 'Media sharing is not enabled in your current plan.\nUpgrade to Premium to share photos and express yourself!'
                                                        });
                                                    } else {
                                                        fileInputRef.current?.click();
                                                    }
                                                }
                                            },
                                            { icon: Camera, color: "text-purple-400", label: "Camera", bg: "hover:bg-purple-400/20" },
                                            {
                                                icon: currentPlan && !currentPlan.features.audioEnabled ? Lock : Mic, color: "text-red-400", label: "Audio", bg: "hover:bg-red-400/20",
                                                onClick: () => {
                                                    if (currentPlan && !currentPlan.features.audioEnabled) {
                                                        setUpsellModal({
                                                            isOpen: true,
                                                            title: 'Audio Notes Locked 🎤',
                                                            desc: 'Audio messaging is not enabled in your current plan.\nUpgrade to Premium to send voice notes!'
                                                        });
                                                    } else {
                                                        audioInputRef.current?.click();
                                                    }
                                                }
                                            },
                                        ].map((item, idx) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={item.onClick}
                                                className={`p-3 rounded-full transition-all duration-200 ${item.bg} group relative`}
                                            >
                                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                    {item.label}
                                                </span>
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <input
                                type="file"
                                ref={audioInputRef}
                                onChange={handleAudioUpload}
                                accept="audio/*"
                                className="hidden"
                            />

                            {/* Attachment Toggle Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowAttachments(!showAttachments)}
                                className={`p-2.5 md:p-3.5 rounded-full transition-all duration-300 shrink-0 ${showAttachments ? 'bg-black/20 text-white rotate-45' : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/15'}`}
                            >
                                <Plus className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.button>

                            {/* Text Input */}
                            {/* Text Input / Blocked Notice */}
                            <div className="flex-1 bg-white/5 border border-white/10 focus-within:border-primary/50 focus-within:bg-white/10 rounded-[20px] md:rounded-[28px] transition-all duration-300 flex flex-col min-h-[44px] relative">
                                {(() => {
                                    const otherUser = selectedMatch?.users.find(u => u.userId !== currentUser?.id) || selectedMatch?.users[0];
                                    if (otherUser?.isBlocked) {
                                        return (
                                            <div className="flex flex-1 items-center justify-center p-3 text-red-400 text-sm font-medium gap-2">
                                                <AlertTriangle className="w-4 h-4" />
                                                This account is no longer available
                                            </div>
                                        );
                                    }

                                    return (
                                        <>
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-[20px] md:rounded-[28px] flex items-center justify-center z-20">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                        <span className="text-xs text-white">Sending media...</span>
                                                    </div>
                                                </div>
                                            )}

                                            {isRecording && (
                                                <div className="absolute inset-0 bg-black rounded-[20px] md:rounded-[28px] flex items-center justify-between px-4 z-40">
                                                    <button
                                                        onClick={deleteRecording}
                                                        className="p-2 hover:bg-white/10 rounded-full text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>

                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
                                                            <span className="text-sm font-mono text-white">{formatTime(recordingTime)}</span>
                                                        </div>

                                                        <button
                                                            onClick={isPaused ? resumeRecording : pauseRecording}
                                                            className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
                                                        >
                                                            {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {audioBlob && (
                                                <div className="absolute inset-0 bg-black rounded-[20px] md:rounded-[28px] flex items-center justify-between px-4 z-40">
                                                    <button
                                                        onClick={deleteRecording}
                                                        className="p-2 hover:bg-white/10 rounded-full text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                        <span className="text-sm font-mono text-white">Audio Recorded</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-end pr-2">
                                                <textarea
                                                    ref={inputRef}
                                                    value={newMessage}
                                                    onChange={handleTyping}
                                                    onFocus={() => {
                                                        setShowAttachments(false);
                                                        setShowEmojiPicker(false);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            if (newMessage.trim()) {
                                                                handleSendMessage();
                                                            }
                                                        }
                                                    }}
                                                    placeholder="Message..."
                                                    rows={1}
                                                    className="flex-1 w-full min-w-0 bg-transparent border-none outline-none focus:outline-none focus:ring-0 px-4 py-3 text-sm md:text-base text-white placeholder:text-gray-500 resize-none max-h-32 mb-px scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                                                    style={{ minHeight: '44px' }}
                                                    disabled={sending || uploading}
                                                />
                                                <button
                                                    onClick={() => {
                                                        setShowEmojiPicker(!showEmojiPicker);
                                                        setShowAttachments(false);
                                                    }}
                                                    className={`p-2 mb-1.5 rounded-full transition-colors shrink-0 ${showEmojiPicker ? 'text-yellow-400 bg-white/5' : 'text-gray-400 hover:text-yellow-400 hover:bg-white/5'}`}
                                                >
                                                    <Smile className="w-5 h-5 md:w-6 md:h-6" />
                                                </button>
                                            </div>
                                        </>
                                    );
                                })()}

                                {/* Emoji Picker Popup */}
                                <AnimatePresence>
                                    {showEmojiPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: -10 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute bottom-full right-0 z-50 origin-bottom-right"
                                        >
                                            <div className="shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                                                <EmojiPicker
                                                    onEmojiClick={handleEmojiClick}
                                                    theme={Theme.DARK}
                                                    autoFocusSearch={false}
                                                    searchPlaceHolder="Search emojis..."
                                                    width={320}
                                                    height={400}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Dynamic Send / Mic Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (isRecording || audioBlob) {
                                        sendRecording();
                                    } else if (newMessage.trim()) {
                                        handleSendMessage();
                                    } else {
                                        if (currentPlan && !currentPlan.features.audioEnabled) {
                                            setUpsellModal({
                                                isOpen: true,
                                                title: 'Audio Notes Locked ',
                                                desc: 'Audio messaging is not enabled in your current plan.\nUpgrade to Premium to send voice notes!'
                                            });
                                        } else {
                                            startRecording();
                                        }
                                    }
                                }}
                                disabled={sending || (selectedMatch?.users.find(u => u.userId !== currentUser?.id) || selectedMatch?.users[0])?.isBlocked}
                                className={`
                                    p-2.5 md:p-3.5 rounded-full shadow-lg shrink-0 flex items-center justify-center transition-all duration-500
                                    ${newMessage.trim() || isRecording || audioBlob
                                        ? 'bg-linear-to-r from-primary to-purple-600 text-white shadow-primary/25 translate-y-0'
                                        : 'bg-white/10 text-white hover:bg-white/20' // Mic style
                                    }
                                    ${(!newMessage.trim() && sending) || (selectedMatch?.users.find(u => u.userId !== currentUser?.id) || selectedMatch?.users[0])?.isBlocked ? 'opacity-50' : ''}
                                `}
                            >
                                <AnimatePresence mode="wait">
                                    {(newMessage.trim() || isRecording || audioBlob) ? (
                                        <motion.div
                                            key="send"
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 45 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Send className="w-4 h-4 md:w-5 md:h-5 ml-0.5" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="mic"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {currentPlan && !currentPlan.features.audioEnabled ? (
                                                <Lock className="w-5 h-5 md:w-6 md:h-6" />
                                            ) : (
                                                <Mic className="w-5 h-5 md:w-6 md:h-6" />
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 bg-black/80 backdrop-blur-sm relative z-0">
                    <div className="w-[400px] h-[400px] absolute bg-primary/20 blur-[150px] rounded-full opacity-30 animate-pulse pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl max-w-sm"
                    >
                        <div className="w-20 h-20 bg-linear-to-tr from-primary/20 to-purple-500/20 rounded-full mx-auto mb-6 flex items-center justify-center border border-white/10 shadow-lg shadow-primary/10">
                            <Send className="w-9 h-9 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Your Messages</h3>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            Select a match from the sidebar to start a conversation, or explore more profiles to find your spark.
                        </p>
                        <button className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
                            Find Matches
                        </button>
                    </motion.div>
                </div>
            )}

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxImage(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
                    >
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors pointer-events-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxImage(null);
                            }}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={lightboxImage}
                            alt="Full screen view"
                            className="max-w-full max-h-screen object-contain pointer-events-auto cursor-default shadow-2xl rounded-sm"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                reportedUserId={selectedMatch ? (selectedMatch.users.find(u => u.userId !== currentUser?.id)?.userId || selectedMatch.users[0]?.userId) : null}
            />

            <PremiumUpsellModal
                isOpen={upsellModal.isOpen}
                onClose={() => setUpsellModal({ ...upsellModal, isOpen: false })}
                title={upsellModal.title}
                description={upsellModal.desc}
            />

            {/* Date Suggestions Overlay */}
            <AnimatePresence>
                {showDatePanel && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDatePanel(false)}
                            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-[380px] bg-[#0a0a0a] border-l border-white/8 z-50 flex flex-col shadow-[−8px_0_60px_rgba(0,0,0,0.8)]"
                        >
                            {/* ── Hero Header ── */}
                            <div className="relative overflow-hidden shrink-0">
                                {/* gradient bg */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-purple-600/15 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
                                <div className="relative px-5 pt-6 pb-5 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/30">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base text-white tracking-tight">Meet in the Middle</h3>
                                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">Midpoint Spot Finder</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowDatePanel(false)}
                                        className="mt-0.5 p-2 rounded-full bg-white/5 hover:bg-white/12 text-gray-400 hover:text-white border border-white/8 transition-all duration-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* ── Category Tab Bar ── */}
                            <div className="px-4 pt-2 pb-3 shrink-0">
                                <div className="flex items-center bg-white/5 border border-white/8 rounded-2xl p-1 gap-0.5">
                                    {[
                                        { id: 'cafe',          label: 'Coffee',  emoji: '☕' },
                                        { id: 'restaurant',    label: 'Food',    emoji: '🍽️' },
                                        { id: 'bar',           label: 'Drinks',  emoji: '🍸' },
                                        { id: 'movie_theater', label: 'Movies',  emoji: '🎬' },
                                        { id: 'park',          label: 'Parks',   emoji: '🌿' },
                                    ].map((cat) => {
                                        const isActive = selectedDateCategory === cat.id;
                                        return (
                                            <motion.button
                                                key={cat.id}
                                                whileTap={{ scale: 0.93 }}
                                                onClick={() => setSelectedDateCategory(cat.id)}
                                                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white border-transparent shadow-md shadow-primary/25'
                                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                                }`}
                                            >
                                                <span className="text-base leading-none">{cat.emoji}</span>
                                                <span className="text-[9px] font-semibold tracking-wide">{cat.label}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>


                            {/* ── Content Area ── */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {isFetchingDate ? (
                                    /* Loading State */
                                    <div className="flex flex-col items-center justify-center h-full pb-10 space-y-5">
                                        <div className="relative w-16 h-16">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 blur-xl" />
                                            <div className="relative w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                                    className="absolute inset-1 rounded-full border-2 border-transparent border-t-primary"
                                                />
                                                <MapPin className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-sm font-semibold text-white">Finding the perfect spot…</p>
                                            <p className="text-xs text-gray-500">Calculating the fair midpoint between you two</p>
                                        </div>
                                    </div>
                                ) : dateSuggestions.length > 0 ? (
                                    dateSuggestions.map((place, idx) => (
                                        <motion.div
                                            key={place.id}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.07, duration: 0.35 }}
                                            className="group relative bg-[#141414] border border-white/8 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                                        >
                                            {/* Place Image / Placeholder */}
                                            <div className="relative h-36 w-full bg-[#1a1a1a] overflow-hidden">
                                                {place.photo_reference ? (
                                                    <Image
                                                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photo_reference}&key=YOUR_KEY`}
                                                        alt={place.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-purple-600/5">
                                                        <div className="text-4xl opacity-30">
                                                            {place.types?.includes('cafe') ? '☕' :
                                                             place.types?.includes('restaurant') ? '🍽️' :
                                                             place.types?.includes('movie_theater') ? '🎬' :
                                                             place.types?.includes('park') ? '🌿' :
                                                             place.types?.includes('bar') ? '🍸' : '📍'}
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Dark gradient overlay at bottom */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                                                {/* Rating badge */}
                                                {place.rating && (
                                                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-md rounded-lg border border-white/10">
                                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                        <span className="text-xs text-white font-bold">{place.rating}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Place Info */}
                                            <div className="px-4 pt-3 pb-4 space-y-3">
                                                <div>
                                                    <h4 className="font-bold text-sm text-white leading-snug group-hover:text-primary transition-colors truncate">{place.name}</h4>
                                                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 flex items-center gap-1">
                                                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                                                        {place.address}
                                                    </p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 pt-1">
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}&query_place_id=${place.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 text-xs font-medium transition-all duration-200"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        Maps
                                                    </a>
                                                    <button
                                                        onClick={() => {
                                                            if (!selectedMatch) return;
                                                            const message = `Check out this spot: ${place.name}! It's exactly midway between us.`;
                                                            const metadata = {
                                                                placeId: place.id,
                                                                name: place.name,
                                                                address: place.address,
                                                                rating: place.rating,
                                                                photo: place.photo_reference
                                                                    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photo_reference}&key=YOUR_KEY`
                                                                    : undefined
                                                            };
                                                            handleSendMessage(message, 'date_proposal', metadata);
                                                            setShowDatePanel(false);
                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold shadow-md shadow-primary/20 hover:shadow-primary/40 hover:opacity-90 transition-all duration-200"
                                                    >
                                                        <Send className="w-3.5 h-3.5" />
                                                        Propose Date ✨
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    /* Empty State */
                                    <div className="flex flex-col items-center justify-center h-full pb-10 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
                                            🗺️
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-sm font-semibold text-gray-300">No spots found nearby</p>
                                            <p className="text-xs text-gray-600 px-6 leading-relaxed">Try a different category or check that both profiles have a location set.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Footer ── */}
                            <div className="px-5 py-4 bg-gradient-to-t from-black to-transparent border-t border-white/5 shrink-0">
                                <p className="text-[10px] text-gray-600 leading-relaxed text-center">
                                    ✦ Spark finds the geographic midpoint between you and your match
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
