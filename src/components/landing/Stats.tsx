"use client";

import { useEffect, useState } from "react";
import { motion } from 'framer-motion';

const Stats = () => {
    const [counts, setCounts] = useState({ users: 0, matches: 0, messages: 0, success: 0 });

    useEffect(() => {
        const targets = { users: 2000000, matches: 500000, messages: 1600000, success: 95 };
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setCounts({
                users: Math.floor(targets.users * progress),
                matches: Math.floor(targets.matches * progress),
                messages: Math.floor(targets.messages * progress),
                success: Math.floor(targets.success * progress),
            });

            if (currentStep >= steps) {
                clearInterval(timer);
                setCounts(targets);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
        return num.toString();
    };

    const stats = [
        {
            value: formatNumber(counts.users),
            label: "Active Users",
            description: "Growing community of people seeking meaningful connections worldwide"
        },
        {
            value: formatNumber(counts.matches),
            label: "Matches Made",
            description: "Successful matches created through our intelligent matching algorithm"
        },
        {
            value: formatNumber(counts.messages),
            label: "Messages Daily",
            description: "Real conversations happening every day between matched users"
        },
        {
            value: `${counts.success}%`,
            label: "Success Rate",
            description: "Users who found meaningful connections within their first month"
        }
    ];

    return (
        <section id="success" className="relative w-full pt-6 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 bg-linear-to-b from-black via-gray-950 to-black">

            {/* Section Title */}
            <motion.div
                className="text-center mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto px-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 font-mono tracking-tight">
                    <span className="text-white">
                        MILESTONES
                    </span>
                </h2>
                <p className="text-sm xs:text-base sm:text-lg text-gray-400 font-light leading-relaxed px-2">
                    Join millions of users who have found their perfect match
                </p>
            </motion.div>

            {/* Stats Grid - 2 columns on tablet and up */}
            <div className="w-full px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="group relative"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            {/* Pill-shaped card */}
                            <div className="relative h-full rounded-[40px] xs:rounded-[50px] sm:rounded-[60px] lg:rounded-[80px] overflow-hidden bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6 xs:p-8 sm:p-10 lg:p-12 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/20">

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center justify-center text-center h-full min-h-[220px] xs:min-h-[260px] sm:min-h-[300px]">

                                    {/* Large Number */}
                                    <div className="mb-4 xs:mb-6 sm:mb-8">
                                        <div className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-mono tracking-tighter bg-linear-to-r from-pink-400 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent transition-all duration-500 leading-none">
                                            {stat.value}
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <div className="mb-3 sm:mb-4">
                                        <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-gray-300 font-mono tracking-wide">
                                            {stat.label}
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <div className="max-w-md px-2">
                                        <p className="text-xs xs:text-sm sm:text-base text-gray-500 leading-relaxed font-light">
                                            {stat.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Decorative corner accents - Hidden on very small screens */}
                                <div className="hidden xs:block absolute top-3 sm:top-4 right-3 sm:right-4 w-12 sm:w-16 h-12 sm:h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="hidden xs:block absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-12 sm:w-16 h-12 sm:h-16 border-b-2 border-l-2 border-purple-500/20 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default Stats;
