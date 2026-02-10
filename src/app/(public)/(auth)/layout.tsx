import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Auth Content Pill - Compact Height */}
            <div className="w-full pb-8 sm:pb-12">
                <div className="relative w-full min-h-[40vh] rounded-[40px] xs:rounded-[60px] sm:rounded-[80px] lg:rounded-[100px] xl:rounded-[120px] overflow-hidden bg-black shadow-2xl border border-white/10 shadow-pink-500/20 ">

                    {/* Background Image - Inside Auth Pill */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 opacity-15">
                            <Image
                                src="/BgImage.png"
                                alt="Background"
                                fill
                                className="object-cover"
                                style={{
                                    objectPosition: 'center 30%',
                                    filter: 'grayscale(30%) contrast(1.1) brightness(0.8)',
                                }}
                                priority
                            />
                        </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-gray-900/60 via-black/40 to-gray-900/60 pointer-events-none"></div>

                    {/* Auth Content - Positioned closer to top */}
                    <div className="relative z-10 h-full flex items-start justify-center px-4 sm:px-8 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-12">
                        <main className="w-full max-w-7xl">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </>
    )
}
