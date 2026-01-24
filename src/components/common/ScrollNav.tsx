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
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4">
            <nav className={`transition-all duration-300 flex items-center justify-between border border-white/10 rounded-full backdrop-blur-3xl ${scrolled
                ? 'bg-black/50 shadow-lg shadow-primary/5 py-3 px-6 w-[90%] md:w-[70rem]'
                : 'bg-white/[0.02]  py-3 px-8 w-[95%] md:w-[80rem]'
                }`}>
                {children}
            </nav>
        </div>
    )
}