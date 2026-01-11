
const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            title: "Create Your Profile",
            description: "Sign up in seconds and build your profile with photos and interests. Show the world who you really are.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            number: "02",
            title: "Get Smart Matches",
            description: "Our AI algorithm analyzes your preferences and suggests compatible matches based on shared values and interests.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            )
        },
        {
            number: "03",
            title: "Start Connecting",
            description: "Like profiles that catch your eye. When there's a mutual match, start chatting and see where it goes!",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        },
        {
            number: "04",
            title: "Find Your Match",
            description: "Build meaningful connections through conversations, video calls, and shared experiences. Your story starts here.",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            )
        }
    ];

    return (
        <section id="how-it-works" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            {/* Section Header */}
            <div className="text-center mb-20">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                    <span className="bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        How It Works
                    </span>
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Finding love has never been easier. Just four simple steps to your perfect match.
                </p>
            </div>

            {/* Steps */}
            <div className="relative">
                {/* Connection Line - Hidden on mobile */}
                <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-primary/20 via-pink-500/40 to-purple-600/20 -translate-y-1/2"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="relative group"
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            {/* Card */}
                            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 h-full">
                                {/* Step Number - Corner Ribbon Badge */}
                                <div className="absolute -top-2 -right-2 w-16 h-16 group-hover:scale-110 transition-all duration-300">
                                    <div className="relative w-full h-full">
                                        {/* Ribbon shape */}
                                        <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id={`ribbon-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#ff4b7d" />
                                                    <stop offset="100%" stopColor="#ec4899" />
                                                </linearGradient>
                                            </defs>
                                            {/* Main ribbon */}
                                            <path d="M0 0L64 0L64 64L0 0Z" fill={`url(#ribbon-gradient-${index})`} />
                                            {/* Folded corner effect */}
                                            <path d="M0 0L20 0L0 20L0 0Z" fill="rgba(0,0,0,0.2)" />
                                            {/* Highlight */}
                                            <path d="M0 0L64 0L32 32L0 0Z" fill="rgba(255,255,255,0.15)" />
                                        </svg>
                                        {/* Number text */}
                                        <span className="absolute top-1 right-1 text-lg font-extrabold text-white drop-shadow-md z-10">
                                            {step.number}
                                        </span>
                                    </div>
                                </div>

                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary/20 to-purple-600/20 rounded-2xl mb-6 text-primary group-hover:text-pink-400 transition-colors duration-300">
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Arrow - Hidden on mobile and last item */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                                    <svg className="w-6 h-6 text-primary animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default HowItWorks;






