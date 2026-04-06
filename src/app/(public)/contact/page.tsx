import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-black text-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="z-10 flex flex-col items-center font-mono">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    Get in <span className="text-primary">Touch</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed">
                    Have questions? Our contact form is under construction and will be ready for your messages shortly.
                </p>
                
                <Link 
                    href="/" 
                    className="px-8 py-3 bg-white/5 border border-white/10 hover:border-primary/50 hover:text-white text-gray-300 rounded-full transition-all duration-300 font-medium tracking-wide shadow-[0_0_15px_-5px_rgba(255,75,125,0)] hover:shadow-[0_0_20px_-5px_rgba(255,75,125,0.4)]"
                >
                    Return Home
                </Link>
            </div>
            
            <div className='pointer-events-none absolute inset-0 z-0 opacity-50'>
                <div className='smoke smoke-dark-1' />
            </div>
        </div>
    );
}
