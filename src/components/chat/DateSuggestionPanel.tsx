'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Calendar, Star, ExternalLink, Send } from 'lucide-react';
import { DateSuggestion } from '@/types/match/response';
import dayjs from 'dayjs';

interface DateSuggestionPanelProps {
    isOpen: boolean;
    onClose: () => void;
    isFetching: boolean;
    suggestions: DateSuggestion[];
    selectedCategory: string;
    onCategoryChange: (id: string) => void;
    proposalDateTimes: Record<string, string>;
    onTimeChange: (placeId: string, time: string) => void;
    onPropose: (place: DateSuggestion, time: string) => void;
}

export default function DateSuggestionPanel({
    isOpen,
    onClose,
    isFetching,
    suggestions,
    selectedCategory,
    onCategoryChange,
    proposalDateTimes,
    onTimeChange,
    onPropose
}: DateSuggestionPanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-998 bg-black/70 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-[380px] bg-[#0a0a0a] border-l border-white/8 z-999 flex flex-col shadow-[-8px_0_60px_rgba(0,0,0,0.8)]"
                    >
                        {/* ── Hero Header ── */}
                        <div className="relative overflow-hidden shrink-0">
                            {/* gradient bg */}
                            <div className="absolute inset-0 bg-linear-to-br from-primary/25 via-purple-600/15 to-transparent" />
                            <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#0a0a0a]" />
                            <div className="relative px-5 pt-6 pb-5 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/30">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-white tracking-tight">Meet in the Middle</h3>
                                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">Midpoint Spot Finder</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/12 text-gray-400 hover:text-white border border-white/8 transition-all duration-200"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* ── Category Tab Bar ── */}
                        <div className="px-4 pt-2 pb-3 shrink-0">
                            <div className="flex items-center bg-white/5 border border-white/8 rounded-2xl p-1 gap-0.5 overflow-x-auto no-scrollbar">
                                {[
                                    { id: 'cafe', label: 'Coffee', emoji: '☕' },
                                    { id: 'restaurant', label: 'Food', emoji: '🍽️' },
                                    { id: 'bar', label: 'Drinks', emoji: '🍸' },
                                    { id: 'movie_theater', label: 'Movies', emoji: '🎬' },
                                    { id: 'park', label: 'Parks', emoji: '🌿' },
                                ].map((cat) => {
                                    const isActive = selectedCategory === cat.id;
                                    return (
                                        <motion.button
                                            key={cat.id}
                                            whileTap={{ scale: 0.93 }}
                                            onClick={() => onCategoryChange(cat.id)}
                                            className={`flex-1 min-w-[64px] flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all duration-200 ${isActive
                                                    ? 'bg-linear-to-r from-primary to-purple-600 text-white border-transparent shadow-md shadow-primary/25'
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
                            {isFetching ? (
                                /* Loading State */
                                <div className="flex flex-col items-center justify-center h-full pb-10 space-y-5">
                                    <div className="relative w-16 h-16">
                                        <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/20 to-purple-600/20 blur-xl" />
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
                            ) : suggestions.length > 0 ? (
                                suggestions.map((place, idx) => (
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
                                                    src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                                                    alt={place.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/5 to-purple-600/5">
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
                                            <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-transparent to-transparent" />
                                            {/* Status badge */}
                                            <div className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 backdrop-blur-md rounded-lg border transition-all duration-300
                                                ${place.isOpenNow === true ? 'bg-green-500/20 border-green-500/20 text-green-400' :
                                                    place.isOpenNow === false ? 'bg-red-500/20 border-red-500/20 text-red-400' :
                                                        place.businessStatus === 'CLOSED_TEMPORARILY' ? 'bg-orange-500/20 border-orange-500/20 text-orange-400' :
                                                            'bg-white/5 border-white/10 text-gray-400'}`}>

                                                <div className={`w-1.5 h-1.5 rounded-full 
                                                    ${place.isOpenNow === true ? 'bg-green-500 animate-pulse' :
                                                        place.isOpenNow === false ? 'bg-red-500' :
                                                            place.businessStatus === 'CLOSED_TEMPORARILY' ? 'bg-orange-500' :
                                                                'bg-gray-500'}`} />

                                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                                    {place.isOpenNow === true ? 'Open Now' :
                                                        place.isOpenNow === false ? 'Closed' :
                                                            place.businessStatus === 'CLOSED_TEMPORARILY' ? 'Temp. Closed' :
                                                                place.businessStatus === 'CLOSED_PERMANENTLY' ? 'Perm. Closed' :
                                                                    'No hours listed'}
                                                </span>
                                            </div>
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

                                            {/* Date and Time Picker */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    Select Date & Time
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    value={proposalDateTimes[place.id] || ''}
                                                    min={dayjs().add(1, 'hour').format('YYYY-MM-DDTHH:mm')}
                                                    onChange={(e) => onTimeChange(place.id, e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-primary/50 transition-colors scheme-dark"
                                                />
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
                                                    onClick={() => onPropose(place, dayjs(proposalDateTimes[place.id]).utc().toISOString())}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-linear-to-r from-primary to-purple-600 text-white text-xs font-bold shadow-md shadow-primary/20 hover:shadow-primary/40 hover:opacity-90 transition-all duration-200"
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
                        <div className="px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:pb-4 bg-linear-to-t from-black to-transparent border-t border-white/5 shrink-0">
                            <p className="text-[10px] text-gray-600 leading-relaxed text-center">
                                ✦ Spark finds the geographic midpoint between you and your match
                            </p>
                        </div>
                    </motion.div>
                    <style jsx global>{`
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        .no-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>
                </>
            )}
        </AnimatePresence>
    );
}
