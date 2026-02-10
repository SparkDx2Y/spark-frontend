const HowItWorks = () => {
    return (
        <section className="relative w-full px-4 sm:px-6 pt-8 lg:pt-10 pb-6 lg:pb-8 bg-linear-to-b from-black via-gray-950 to-black overflow-hidden">

            {/* Header */}
            <div className="text-center mb-16 lg:mb-24 relative z-10">
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-mono tracking-tighter text-white mb-6">
                    HOW IT WORKS
                </h2>
                <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto">
                    Centralized connection. Decentralized possibilities.
                </p>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

                {/* Left Column: Steps 1 & 2 */}
                <div className="flex flex-col gap-12 lg:gap-24 w-full lg:w-1/3">

                    {/* Step 1 */}
                    <div className="group text-center lg:text-right">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 font-bold text-xl mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">01</div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Create Profile</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Sign up in seconds. Upload your best photos and write a killer bio.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="group text-center lg:text-right">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 font-bold text-xl mb-4 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">02</div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Smart Match</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Our AI analyzes your personality and preferences to find your match.
                        </p>
                    </div>

                </div>

                {/* Center: Phone Mockup / Visual Anchor */}
                <div className="relative w-full max-w-sm lg:max-w-md aspect-9/16 bg-black/40 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl shadow-pink-500/20 flex items-center justify-center  overflow-hidden z-20 group">

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

                                {/* Active Profile Card */}
                                <div className="absolute inset-0 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">

                                    {/* Profile Photo */}
                                    <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80")' }}>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>

                                        {/* NOPE Overlay (Left Swipe) */}
                                        <div className="absolute inset-0 bg-red-500/0 flex items-center justify-center pointer-events-none">
                                            <div className="border-4 border-red-500 rounded-2xl px-6 py-3 rotate-[-20deg] opacity-0">
                                                <span className="text-red-500 font-black text-4xl">NOPE</span>
                                            </div>
                                        </div>

                                        {/* LIKE Overlay (Right Swipe) */}
                                        <div className="absolute inset-0 bg-green-500/0 flex items-center justify-center pointer-events-none">
                                            <div className="border-4 border-green-500 rounded-2xl px-6 py-3 rotate-20 opacity-0">
                                                <span className="text-green-500 font-black text-4xl">LIKE</span>
                                            </div>
                                        </div>

                                        {/* Top Info Bar */}
                                        <div className="absolute top-0 left-0 right-0 p-6">
                                            <div className="flex gap-2">
                                                <div className="flex-1 h-1 bg-white rounded-full"></div>
                                                <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
                                                <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
                                                <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* Profile Info - Bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                                            <div>
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <h2 className="text-3xl font-bold text-white drop-shadow-2xl">Jessica</h2>
                                                    <span className="text-xl text-white/90 drop-shadow-lg">25</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/90 mb-3">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm drop-shadow-lg">5 kilometers away</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/30">
                                                    Photography
                                                </span>
                                                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/30">
                                                    Foodie
                                                </span>
                                                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/30">
                                                    Travel
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Reflection */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-white/5 to-transparent pointer-events-none"></div>
                </div>


                {/* Right Column: Steps 3 & 4 */}
                <div className="flex flex-col gap-12 lg:gap-24 w-full lg:w-1/3">

                    {/* Step 3 */}
                    <div className="group text-center lg:text-left">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/10 text-pink-400 font-bold text-xl mb-4 border border-pink-500/20 group-hover:scale-110 transition-transform duration-300">03</div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">Connect</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Start real conversations. Video chat, share moments instantly.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="group text-center lg:text-left">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 text-orange-400 font-bold text-xl mb-4 border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">04</div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">Meet Up</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Take the connection to the real world safely.
                        </p>
                    </div>

                </div>

            </div>

        </section>
    );
};

export default HowItWorks;
