const Features = () => {
    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "Verified Profiles",
            description: "Every profile is verified to ensure authenticity and safety. Connect with real people looking for genuine connections."
        },

        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            title: "Instant Messaging",
            description: "Chat in real-time with your matches. Share photos, voice messages, and video calls to build deeper connections."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: "Location-Based",
            description: "Find people nearby or explore connections around the world. Distance is just a number when it comes to love."
        },
    ];

    return (
        <section id="features" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            {/* Section Header */}
            <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                    <span className="bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Why Choose Spark?
                    </span>
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Experience dating reimagined with features designed to help you find meaningful connections
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-primary to-pink-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/50">
                                <div className="text-white">
                                    {feature.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
