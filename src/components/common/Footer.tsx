import Link from "next/link";
import Image from 'next/image'


export default function Footer() {

    return (

        <footer className='relative overflow-hidden bg-black'>

            <div className='pointer-events-none absolute inset-0 z-0'>
                <div className='smoke smoke-dark-1' />
                <div className='smoke smoke-dark-2' />
            </div>

            {/* Main Content */}
            <div className='relative z-10 max-w-[1600px] mx-auto px-6 sm:px-8 pt-24 sm:pt-32 md:pt-40 pb-24 sm:pb-28 md:pb-36'>

                {/* Grid layer */}
                <div className='grid grid-cols-1 md:grid-cols-[260px_1fr_260px] gap-16 items-start'>

                    {/* left section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-center md:text-left self-start translate-y-2 md:-translate-y-6 lg:-translate-y-8">

                        {/* Product section */}
                        <div className='space-y-4'>
                            <h3 className="text-white font-semibold text-sm">Product</h3>
                            <ul className='space-y-3'>
                                <li>
                                    <Link href='#features' className="text-gray-400 hover:text-primary transition-colors">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link href='#how-it-works' className="text-gray-400 hover:text-primary transition-colors">
                                        How It Works
                                    </Link>
                                </li>
                                <li>
                                    <Link href='#' className="text-gray-400 hover:text-primary transition-colors">
                                        Success
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div className='space-y-4'>
                            <h3 className="text-white font-semibold text-sm">Company</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href='/about' className='text-grey-400 hover:text-primary transition-colors'>
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href='/carreers' className='text-grey-400 hover:text-primary transition-colors'>
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href='/contact' className='text-grey-400 hover:text-primary transition-colors'>
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/*  center section the logo  */}
                    <div className="flex flex-col items-center self-center translate-y-8 md:translate-y-15">

                        <Image src='/SparkLogo.png' alt='Spark' width={360} height={160} priority className="w-[260px] sm:w-[300px] md:w-[360px] opacity-90" />

                        <div className='mt-8 flex flex-wrap justify-center gap-4 text-[11px] tracking-wide text-gray-500'>
                            <p className="text-sm sm:text-base text-gray-400 tracking-wide text-center">Where meaningful connections begin</p>
                        </div>
                    </div>

                    {/* Right Section the Icons */}
                    <div className="space-y-4 text-center md:text-right self-start translate-y-0 md:-translate-y-10">
                        <h3 className="text-white font-semibold text-sm">Follow Us</h3>

                        <div className="flex justify-center md:justify-end gap-3">

                            {/* Facebook */}
                            <a href='#' aria-label="Facebook"
                                className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400
                            hover:text-pink-400 hover:bg-white/10 hover:border-pink-400/50 hover:scale-110 transition-all duration-300">
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>

                            {/* X */}
                            <a href='#' aria-label="X"
                                className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400
                            hover:text-pink-400 hover:bg-white/10 hover:border-pink-400/50 hover:scale-110 transition-all duration-300">
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a href='#' aria-label="Instagram"
                                className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400
                            hover:text-pink-400 hover:bg-white/10 hover:border-pink-400/50 hover:scale-110 transition-all duration-300">
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Last / Bottom Section  */}
                <div className='absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 text-center md:text-left w-full md:w-auto px-4'>
                    <p className="text-gray-500 text-xs sm:text-sm">© {new Date().getFullYear()} Spark. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}