"use client";

import Link from "next/link";
import Image from 'next/image'
import { motion } from "framer-motion";

export default function Footer() {

    return (

        <footer className='relative overflow-hidden bg-black pt-6 sm:pt-8'>

            <div className='pointer-events-none absolute inset-0 z-0'>
                <div className='smoke smoke-dark-1' />
                <div className='smoke smoke-dark-2' />
            </div>

            {/* Main Content */}
            <div className='relative z-10 w-full px-0 pb-0'>

                {/* Larger full-width pill-shaped container */}
                <div className="relative w-full min-h-[650px] sm:min-h-[750px] rounded-[80px] sm:rounded-[100px] lg:rounded-[120px] overflow-hidden bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-purple-600/5 pointer-events-none"></div>

                    <div className="relative z-10 h-full flex flex-col justify-between min-h-[650px] sm:min-h-[750px]">

                        {/* Top Section - Links and Social */}
                        <div className="px-8 sm:px-12 lg:px-16 xl:px-20 pt-12 sm:pt-16 lg:pt-20">
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-16 sm:gap-20 lg:gap-28 max-w-7xl mx-auto'>

                                {/* Left - Product Links */}
                                <div className='text-center md:text-left font-mono'>
                                    <h3 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl mb-8 tracking-tight">Product</h3>
                                    <ul className='space-y-5'>
                                        <li>
                                            <Link href='#features' className="text-gray-400 hover:text-primary transition-colors text-lg sm:text-xl font-medium tracking-wide">
                                                Features
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href='#how-it-works' className="text-gray-400 hover:text-primary transition-colors text-lg sm:text-xl font-medium tracking-wide">
                                                How It Works
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href='#' className="text-gray-400 hover:text-primary transition-colors text-lg sm:text-xl font-medium tracking-wide">
                                                Success
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                {/* Middle - Company Links */}
                                <div className='text-center md:text-left font-mono'>
                                    <h3 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl mb-8 tracking-tight">Company</h3>
                                    <ul className="space-y-5">
                                        <li>
                                            <Link href='/about' className='text-gray-400 hover:text-primary transition-colors text-lg sm:text-xl font-medium tracking-wide'>
                                                About Us
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href='/careers' className='text-gray-400 hover:text-primary transition-colors text-lg sm:text-xl font-medium tracking-wide'>
                                                Careers
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href='/contact' className='text-gray-400 hover:text-primary transition-colors text-lg sm:text-xl font-medium tracking-wide'>
                                                Contact
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                {/* Right - Social Icons */}
                                <div className="text-center md:text-right font-mono">
                                    <h3 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl mb-8 tracking-tight">Follow Us</h3>

                                    <div className="flex justify-center md:justify-end gap-4" style={{ perspective: "1000px" }}>
                                        {[
                                            { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                                            { label: "X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                                            { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" }
                                        ].map((social, index) => (
                                            <motion.a
                                                key={index}
                                                href="#"
                                                aria-label={social.label}
                                                initial={{ rotateY: 0 }}
                                                whileHover={{
                                                    rotateY: 180,
                                                    scale: 1.1,
                                                    borderColor: "rgba(255, 75, 125, 0.8)",
                                                    backgroundColor: "rgba(255, 75, 125, 0.1)",
                                                    boxShadow: "0px 0px 15px rgba(255, 75, 125, 0.5)"
                                                }}
                                                transition={{
                                                    duration: 0.4,
                                                    ease: "easeInOut"
                                                }}
                                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-primary transition-colors"
                                            >
                                                <motion.div
                                                    variants={{
                                                        hover: { rotateY: 180 }
                                                    }}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d={social.path} />
                                                    </svg>
                                                </motion.div>
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Center Section - Logo and Tagline */}
                        <div className="flex flex-col items-center justify-center px-8 font-mono mt-12 sm:mt-16 md:mt-0">
                            <Image src='/SparkLogo.png' alt='Spark' width={450} height={200} priority className="w-[320px] sm:w-[380px] md:w-[450px] h-auto opacity-90 mb-6" />
                            <p className="text-base sm:text-lg lg:text-xl text-gray-400 tracking-wider text-center font-light">Where meaningful connections begin</p>
                        </div>

                        {/* Bottom Section - Copyright Only */}
                        <div className="px-8 sm:px-12 lg:px-16 xl:px-20 pb-12 sm:pb-16 lg:pb-20">
                            <div className="max-w-7xl mx-auto text-center font-mono">
                                <p className="text-gray-500 text-sm sm:text-base tracking-wide font-light">© {new Date().getFullYear()} Spark. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
