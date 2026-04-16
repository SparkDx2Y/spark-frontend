'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; days: number } | null>(null);

    useEffect(() => {
        const calculate = () => {
            const target = new Date(targetDate).getTime();
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) return null;

            return {
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            };
        };

        const timer = setInterval(() => setTimeLeft(calculate()), 1000);
        setTimeLeft(calculate());
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        // Check if we are within 2 hours after the date
        const target = new Date(targetDate).getTime();
        const now = new Date().getTime();
        const diff = now - target;
        if (diff < 2 * 60 * 60 * 1000) {
            return <span className="text-primary font-black uppercase tracking-widest text-[10px] animate-pulse">Happening now! 🥂🥂</span>;
        }
        return <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Date Completed ✨</span>;
    }

    return (
        <div className="flex items-center gap-1 text-[10px] font-bold text-white uppercase tracking-wider">
            <Clock className="w-2.5 h-2.5 text-primary" />
            {timeLeft.days > 0 && <span>{timeLeft.days}D</span>}
            <span className="text-primary">{timeLeft.hours}H</span>
            <span>:</span>
            <span>{timeLeft.minutes}M</span>
            <span>:</span>
            <span className="text-gray-400">{timeLeft.seconds}S</span>
        </div>
    );
}
