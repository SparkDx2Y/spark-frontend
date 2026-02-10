const Features = () => {
    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            title: "Smart Matching",
            description: "Our AI algorithm learns your preferences and suggests compatible matches based on shared interests and values."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: "Privacy First",
            description: "Your data is encrypted and secure. Control who sees your profile and personal information at all times."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            title: "Real-time Chat",
            description: "Connect instantly with matches through our seamless messaging platform. Share photos, videos, and more."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "Verified Profiles",
            description: "Every profile is verified to ensure authenticity. Meet real people looking for genuine connections."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: "Location Based",
            description: "Find matches nearby or expand your search globally. Distance is just a number when it comes to love."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            title: "Success Stories",
            description: "Join thousands of happy couples who found their perfect match. Your love story could be next!"
        }
    ];

    return (
        <section className="relative w-full px-4 sm:px-6 pt-4 sm:pt-6 lg:pt-8 pb-10 sm:pb-12 lg:pb-14 bg-linear-to-b from-black via-gray-950 to-black">

            {/* Large Container - Matches the reference image shape */}
            <div className="relative w-full rounded-[40px] sm:rounded-[60px] md:rounded-[80px] lg:rounded-[100px] overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 p-8 sm:p-12 lg:p-20 shadow-2xl">

                {/* Header Section - Title Left, Description Right */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-16 lg:mb-20">
                    <div className="max-w-xl">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono tracking-tight text-white mb-2">
                            FEATURES
                        </h2>
                    </div>
                    <div className="max-w-md lg:text-right">
                        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                            Everything you need to find meaningful connections.
                            Built with precision, security, and user experience in mind.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-[30px] p-8 sm:p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                        >
                            {/* Icon */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-mono tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-light">
                                {feature.description}
                            </p>

                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 rounded-[30px] bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default Features;
