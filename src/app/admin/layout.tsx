
export default function AdminRootLayout({children}: { children: React.ReactNode}) {
    
    return (
        <div className="min-h-screen bg-[#0a0a0b] relative overflow-hidden selection:bg-amber-500/30">

            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Subtle Radial Gradient to give depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1a1c,transparent_70%)]"></div>

                {/* Luxury Gold Accents */}
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full"></div>
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-yellow-600/5 blur-[100px] rounded-full animate-pulse-slow"></div>

                {/* Subtle Executive Lines */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 font-sans text-stone-300">
                {children}
            </div>

        </div>
    );
}
