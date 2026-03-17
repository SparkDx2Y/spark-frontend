'use client'
import { useState, useEffect } from "react"

export default function ScrollNav({ children }: { children: React.ReactNode }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-5 md:pt-6 pointer-events-none">
            <nav className={`transition-all duration-300 flex items-center justify-between border border-white/10 rounded-full backdrop-blur-3xl pointer-events-auto ${scrolled
                ? 'bg-black/80 shadow-lg shadow-primary/10 py-2.5 sm:py-3 px-4 sm:px-6 md:px-8 w-[85%] sm:w-[75%] md:w-[65%] lg:w-[55%] xl:w-[45%]'
                : 'bg-black/60 py-3 sm:py-3.5 px-5 sm:px-7 md:px-9 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%]'
                } max-w-6xl`}>
                {children}
            </nav>
        </div>
    )
}
