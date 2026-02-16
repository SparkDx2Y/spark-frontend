'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const profiles = [
    {
        id: 5,
        name: "Charu",
        image: "https://i.pinimg.com/1200x/3d/22/5b/3d225bf7eeb230b1f90d17425e4ee188.jpg",
        age: 22,
        distance: "6 kilometers away",
        tags: ["Modeling", "Fitness", "Travel"]
    },
    {
        id: 2,
        name: "Achu",
        age: 24,
        image: "https://i.pinimg.com/736x/82/de/11/82de11d5d57d7b69692045a392ce3a13.jpg",
        distance: "12 kilometers away",
        tags: ["Hiking", "Music", "Coffee"]
    },
    {
        id: 4,
        name: "Mrunal",
        age: 26,
        image: "https://i.pinimg.com/1200x/d0/a5/73/d0a573613481ae06e8b5d9ee96757b2b.jpg",
        distance: "8 kilometers away",
        tags: ["Movies", "Dancing", "Fashion"]
    },
    {
        id: 1,
        name: "Jessica",
        age: 25,
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
        distance: "5 kilometers away",
        tags: ["Photography", "Foodie", "Travel"]
    },
    {
        id: 3,
        name: "Sarah",
        image: "https://i.pinimg.com/1200x/a8/b3/12/a8b312fe7a2dbe0789ac530cb775e2e1.jpg",
        age: 23,
        distance: "3 kilometers away",
        tags: ["Art", "Yoga", "Reading"]
    }
];

const HowItWorks = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.3 });

    useEffect(() => {
        if (!isInView) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % profiles.length);
        }, 2000);

        return () => clearInterval(timer);
    }, [isInView]);

    return (
        <section ref={containerRef} className="relative w-full px-4 sm:px-6 pt-8 lg:pt-10 pb-6 lg:pb-8 bg-linear-to-b from-black via-gray-950 to-black overflow-hidden">

            {/* Header */}
            <motion.div
                className="text-center mb-16 lg:mb-24 relative z-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-mono tracking-tighter text-white mb-6">
                    HOW IT WORKS
                </h2>
                <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto">
                    Centralized connection. Decentralized possibilities.
                </p>
            </motion.div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

                {/* Left Column: Steps 1 & 2 */}
                <div className="flex flex-col gap-12 lg:gap-24 w-full lg:w-1/3">

                    {/* Step 1 */}
                    <motion.div
                        className="group text-center lg:text-right"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 font-bold text-xl mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">01</div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Create Profile</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Sign up in seconds. Upload your best photos and write a killer bio.
                        </p>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div
                        className="group text-center lg:text-right"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 font-bold text-xl mb-4 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">02</div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Smart Match</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Our AI analyzes your personality and preferences to find your match.
                        </p>
                    </motion.div>

                </div>

                {/* Center: Phone Mockup / Visual Anchor */}
                <motion.div
                    className="relative w-full max-w-[300px] xs:max-w-[340px] lg:max-w-[400px] aspect-9/16 bg-black/40 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl shadow-pink-500/20 flex items-center justify-center  overflow-hidden z-20 group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >

                    {/* Inner subtle glow border (Like Login Component) */}
                    <div className="absolute inset-0 rounded-[3rem] border border-pink-500/30 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity duration-500"></div>

                    {/* Screen Content: "It's a Spark" Match Moment */}
                    <div className="absolute inset-3 bg-gray-900 rounded-[2.5rem] overflow-hidden flex flex-col">

                        {/* Dynamic Background */}
                        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-pink-900/40 to-black z-0"></div>
                        <div className="absolute top-[-50%] left-[-50%] right-[-50%] bottom-[-50%] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent animate-spin-slow opacity-50 z-0"></div>

                        {/* Status Bar */}
                        <div className="h-8 w-full flex justify-between items-center px-6 mt-2 relative z-10">
                            <div className="text-[10px] text-white font-mono">0:01</div>
                            <div className="flex gap-1.5">
                                <div className="w-4 h-2.5 bg-white rounded-sm"></div>
                                <div className="w-0.5 h-2.5 bg-white/30 rounded-full"></div>
                            </div>
                        </div>

                        {/* Main Content - Swipe Deck */}
                        <div className="flex-1 flex flex-col relative z-10 p-4">

                            {/* Card Stack Area */}
                            <div className="flex-1 relative">

                                {/* Background Cards (Stack Effect) */}
                                <div className="absolute inset-0 top-6 bg-gray-800/40 rounded-3xl transform scale-95 blur-sm"></div>
                                <div className="absolute inset-0 top-3 bg-gray-800/60 rounded-3xl transform scale-[0.97]"></div>

                                {/* Dynamic Swiping Cards */}
                                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                                    <AnimatePresence mode="popLayout">
                                        <motion.div
                                            key={profiles[currentIndex].id}
                                            className="absolute inset-0 bg-gray-900"
                                            initial={{ opacity: 0, x: 200, rotate: 20 }}
                                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                                            exit={{ opacity: 0, x: -200, rotate: -20 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                        >
                                            {/* Profile Photo */}
                                            <div
                                                className="absolute inset-0 bg-center bg-cover"
                                                style={{ backgroundImage: `url(${profiles[currentIndex].image})` }}
                                            >
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>

                                                {/* Profile Info - Bottom */}
                                                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                                                    <div>
                                                        <div className="flex items-baseline gap-2 mb-2">
                                                            <h2 className="text-3xl font-bold text-white drop-shadow-2xl">
                                                                {profiles[currentIndex].name}
                                                            </h2>
                                                            <span className="text-xl text-white/90 drop-shadow-lg">
                                                                {profiles[currentIndex].age}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-white/90 mb-3">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-sm drop-shadow-lg">{profiles[currentIndex].distance}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {profiles[currentIndex].tags.map((tag, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/30">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Reflection */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-white/5 to-transparent pointer-events-none"></div>
                </motion.div>


                {/* Right Column: Steps 3 & 4 */}
                <div className="flex flex-col gap-12 lg:gap-24 w-full lg:w-1/3">

                    {/* Step 3 */}
                    <motion.div
                        className="group text-center lg:text-left"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 text-pink-400 font-bold text-xl mb-4 border border-pink-500/20 group-hover:scale-110 transition-transform duration-300">03</div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">Connect</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Start real conversations. Video chat, share moments instantly.
                        </p>
                    </motion.div>

                    {/* Step 4 */}
                    <motion.div
                        className="group text-center lg:text-left"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 text-orange-400 font-bold text-xl mb-4 border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">04</div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">Meet Up</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Take the connection to the real world safely.
                        </p>
                    </motion.div>

                </div>

            </div>

        </section>
    );
};

export default HowItWorks;
