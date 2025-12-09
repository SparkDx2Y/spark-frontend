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
    },[]);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-black/80 backdrop-blur-xl shadow-lg shadow-black/50'
            : 'bg-transparent'
            }`}>
                { children }
            </nav>
    )
}