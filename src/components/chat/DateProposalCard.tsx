'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Star, MapPin, Clock, ExternalLink, Check, Send } from 'lucide-react';
import { MessageResponse } from '@/types/message/response';
import CountdownTimer from './CountdownTimer';

interface DateProposalCardProps {
    msg: MessageResponse;
    isOwn: boolean;
    currentUserId: string;
    onRespond: (messageId: string, status: 'accepted' | 'declined' | 'suggested', newTime?: string) => Promise<void>;
    isSuggestingTime: boolean;
    onToggleSuggest: (id: string | null) => void;
    suggestedTimeValue: string;
    onTimeChange: (time: string) => void;
}

export default function DateProposalCard({
    msg,
    isOwn,
    currentUserId,
    onRespond,
    isSuggestingTime,
    onToggleSuggest,
    suggestedTimeValue,
    onTimeChange
}: DateProposalCardProps) {
    if (!msg.metadata) return null;

    return (
        <div className="w-56 md:w-64 bg-[#0a0a0a] rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group/card">
            {/* Premium Header */}
            <div className="bg-linear-to-r from-primary/20 to-purple-600/20 px-3 py-2 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Date Invitation</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>

            {msg.metadata.photo && (
                <div className="relative h-28 w-full overflow-hidden">
                    <Image
                        src={msg.metadata.photo.replace('YOUR_KEY', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '')}
                        alt={msg.metadata.name || 'Venue'}
                        fill
                        className="object-cover group-hover/card:scale-105 transition-transform duration-700"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded-md flex items-center gap-1 border border-white/10">
                        <Star className="w-2 h-2 text-yellow-400 fill-yellow-400" />
                        <span className="text-[9px] text-white font-bold">{msg.metadata.rating || 'N/A'}</span>
                    </div>
                </div>
            )}

            <div className="p-3 space-y-3">
                <div>
                    <h4 className="text-xs font-bold text-white truncate group-hover/card:text-primary transition-colors">{msg.metadata.name}</h4>
                    <p className="text-[9px] text-gray-500 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-2 h-2" />
                        {msg.metadata.address}
                    </p>
                </div>

                {/* Compact Scheduled Time */}
                {msg.metadata.scheduledAt && (
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-tight">When</p>
                            <p className="text-[10px] text-white font-medium truncate">
                                {new Date(msg.metadata.scheduledAt).toLocaleString([], {
                                    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                )}

                <div className="text-[10px] text-gray-400 leading-snug italic bg-white/5 p-2 rounded-lg border border-white/5">
                    "{msg.content}"
                </div>

                <div className="flex gap-2">
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(msg.metadata.name + ' ' + msg.metadata.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-white transition-all"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Maps
                    </a>
                </div>

                {/* Proposal Section */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                    {msg.metadata.proposalStatus === 'accepted' ? (
                        <div className="flex flex-col items-center justify-center p-2 bg-green-500/10 border border-green-500/20 rounded-lg gap-1.5 transition-all duration-700 animate-in zoom-in-95">
                            <div className="flex items-center gap-1.5 text-green-400 font-bold text-[9px] uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                Date Confirmed
                            </div>
                            <CountdownTimer targetDate={msg.metadata.scheduledAt || ''} />
                        </div>
                    ) : msg.metadata.proposalStatus === 'declined' ? (
                        <div className="text-center p-2 bg-red-400/5 border border-red-400/10 rounded-lg opacity-60">
                            <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Declined</p>
                        </div>
                    ) : (
                        <>
                            {/* Status Badge if suggested */}
                            {msg.metadata.proposalStatus === 'suggested' && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full w-fit mx-auto mb-1">
                                    <div className="w-1 h-1 rounded-full bg-primary" />
                                    <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Counter-Offer</span>
                                </div>
                            )}

                            {/* Decision Buttons */}
                            {((!msg.metadata.proposalStatus || msg.metadata.proposalStatus === 'pending') && !isOwn) ||
                                (msg.metadata.proposalStatus === 'suggested' && msg.metadata.lastSuggestedBy !== currentUserId) ? (
                                <div className="space-y-2">
                                    {isSuggestingTime ? (
                                        <div className="space-y-2 animate-in slide-in-from-bottom-1 duration-300">
                                            <input
                                                type="datetime-local"
                                                value={suggestedTimeValue}
                                                min={new Date(Date.now() + 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                                                onChange={(e) => onTimeChange(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white scheme-dark focus:border-primary/50 outline-hidden transition-colors"
                                                autoFocus
                                            />
                                            <div className="flex gap-1.5">
                                                <button onClick={() => onRespond(msg.id, 'suggested', suggestedTimeValue)} className="flex-1 py-1.5 bg-primary text-black font-black text-[10px] rounded-lg">Send</button>
                                                <button onClick={() => onToggleSuggest(null)} className="px-3 py-1.5 bg-white/5 text-white font-bold text-[10px] rounded-lg">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <button
                                                onClick={() => onRespond(msg.id, 'accepted')}
                                                className="py-2 bg-green-500 hover:bg-green-600 border border-green-500/20 rounded-lg flex items-center justify-center gap-1.5 text-[9px] font-black text-white transition-all shadow-lg shadow-green-500/10 active:scale-95"
                                            >
                                                <Check className="w-3 h-3" strokeWidth={3} />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onToggleSuggest(msg.id);
                                                    onTimeChange(new Date(new Date(msg.metadata?.scheduledAt || Date.now()).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
                                                }}
                                                className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center gap-1.5 text-[9px] font-black text-white transition-all active:scale-95"
                                            >
                                                <Clock className="w-3 h-3" />
                                                Suggest
                                            </button>
                                            <button
                                                onClick={() => onRespond(msg.id, 'declined')}
                                                className="col-span-2 py-1 text-gray-600 hover:text-red-400 font-bold text-[8px] uppercase tracking-widest transition-colors"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center p-3 bg-white/5 rounded-lg border border-dashed border-white/10">
                                    <div className="flex flex-col items-center gap-1 text-gray-500">
                                        <Clock className="w-3 h-3 text-primary/50 animate-spin-slow" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Waiting</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
