'use client';

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Heart, X, Info } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ProfileResponse } from "@/types/profile/response";

interface SwipeCardProps {
    profile: ProfileResponse;
    onSwipe: (direction: "left" | "right") => void;
    active: boolean;
}

export default function SwipeCard({ profile, onSwipe, active }: SwipeCardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
    const likeOpacity = useTransform(x, [50, 150], [0, 1]);
    const passOpacity = useTransform(x, [-50, -150], [0, 1]);

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe("right");
        } else if (info.offset.x < -100) {
            onSwipe("left");
        }
    };

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (profile.photos && currentPhotoIndex < profile.photos.length - 1) {
            setCurrentPhotoIndex(prev => prev + 1);
        }
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex(prev => prev - 1);
        }
    };

    if (!active) return null;

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
            whileTap={{ scale: 0.98 }}
        >
            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
                {/* Profile Photo */}
                <Image
                    src={profile.photos?.[currentPhotoIndex] || "/placeholder-user.png"}
                    alt={profile.name}
                    fill
                    className="object-cover pointer-events-none"
                    unoptimized
                />

                {/* Overlay Gradients */}
                <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />


                {/* Photo Navigation Indicators */}
                {profile.photos && profile.photos.length > 1 && (
                    <div className="absolute top-4 inset-x-4 flex gap-1.5 z-20">
                        {profile.photos.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i === currentPhotoIndex ? "bg-white shadow-sm" : "bg-white/30"
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Photo Clickable Areas */}
                <div className="absolute inset-0 flex z-10">
                    <div className="w-1/2 h-full" onClick={prevPhoto} />
                    <div className="w-1/2 h-full" onClick={nextPhoto} />
                </div>

                {/* Like/Pass Visual Cues */}
                <motion.div
                    style={{ opacity: likeOpacity }}
                    className="absolute top-12 left-8 border-4 border-green-500 rounded-xl px-4 py-2 rotate-[-15deg] z-20 pointer-events-none"
                >
                    <span className="text-green-500 text-4xl font-black uppercase tracking-widest">LIKE</span>
                </motion.div>

                <motion.div
                    style={{ opacity: passOpacity }}
                    className="absolute top-12 right-8 border-4 border-red-500 rounded-xl px-4 py-2 rotate-[15deg] z-20 pointer-events-none"
                >
                    <span className="text-red-500 text-4xl font-black uppercase tracking-widest">PASS</span>
                </motion.div>

                {/* Info Section */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 pointer-events-none">
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <h2 className="text-4xl font-bold text-white flex items-center gap-3 drop-shadow-lg">
                                {profile.name}, <span className="font-medium opacity-90">{profile.age}</span>
                            </h2>
                            <p className="text-gray-200 text-lg flex items-center gap-2 font-medium drop-shadow-md capitalize">
                                <Info size={18} className="text-primary" />
                                {profile.gender}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
