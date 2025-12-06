'use client';

import { useEffect, useState, useRef } from 'react';

const Stats = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const stats = [
        { value: 2000000, suffix: '+', label: 'Active Users', prefix: '' },
        { value: 1.6, suffix: 'M', label: 'Messages Daily', prefix: '' },
        { value: 95, suffix: '%', label: 'Success Rate', prefix: '' },
        { value: 50, suffix: '+', label: 'Countries', prefix: '' }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );
        const currentRef = sectionRef.current;

        if (currentRef) {
            observer.observe(currentRef);
        }


        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const AnimatedCounter = ({ end, suffix, prefix }: { end: number; suffix: string; prefix: string }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (!isVisible) return;

            let startTime: number;
            const duration = 2000;

            const animate = (currentTime: number) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);

                setCount(Math.floor(progress * end));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }, [end]);

        const formatNumber = (num: number) => {
            if (end >= 1000000) {
                return (num / 1000000).toFixed(1);
            }
            return num.toLocaleString();
        };

        return (
            <span className="text-5xl sm:text-6xl font-bold bg-linear-to-r from-primary via-pink-400 to-purple-500 bg-clip-text text-transparent">
                {prefix}{formatNumber(count)}{suffix}
            </span>
        );
    };

    return (
        <section ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-r from-primary/20 to-purple-600/20 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="relative z-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center group"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                            </div>
                            <p className="text-lg text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Divider */}

                <div className="mt-16 flex items-center justify-center gap-2">
                    <div className="h-px w-32 bg-linear-to-r from-transparent to-white/20"></div>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <div className="h-px w-32 bg-linear-to-l from-transparent to-white/20"></div>
                </div>

            </div>
        </section>
    );
};

export default Stats;
