'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax effect: background moves slower than content
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.5]);
  return (
    <section
      ref={ref}
      className="relative w-full h-auto flex flex-col items-center justify-center overflow-hidden bg-black pb-6 pt-1 sm:pt-1"
    >

      {/* Full-width pill-shaped container */}
      <motion.div
        className="relative w-full h-auto min-h-[550px] sm:min-h-[600px] lg:h-screen rounded-[40px] xs:rounded-[60px] sm:rounded-[80px] lg:rounded-[100px] xl:rounded-[120px] overflow-hidden bg-black border border-white/10 shadow-[0_10px_40px_-10px_rgba(236,72,153,0.3)] flex flex-col justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >

        {/* Background Image - Fully Responsive with Parallax */}
        <motion.div
          className="absolute inset-0 opacity-35 xs:opacity-40 sm:opacity-45 md:opacity-50"
          style={{ y: backgroundY, opacity }}
        >
          <div
            className="absolute inset-0 bg-no-repeat bg-cover"
            style={{
              backgroundImage: 'url(/BgImage.png)',
              filter: 'grayscale(30%) contrast(1.1) brightness(0.8)',
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%', // Focus on upper-center for better faces visibility
            }}
          />
          {/* Additional gradient for better text contrast on mobile */}
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/30 sm:opacity-50"></div>
        </motion.div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-900/60 via-black/40 to-gray-900/60"></div>

        {/* Centered Content */}
        <div className="relative h-full flex items-center justify-center px-4 xs:px-6 sm:px-10 md:px-12 lg:px-16 pb-8 xs:pb-12 sm:pb-16 pt-28 xs:pt-36 sm:pt-44 md:pt-32 lg:pt-40">

          {/* Content Container - Centered */}
          <div className="flex flex-col items-center justify-center text-center space-y-5 xs:space-y-6 sm:space-y-7 md:space-y-8 lg:space-y-10 max-w-4xl mx-auto">

            {/* Main Heading - Centered & Responsive */}
            <motion.h1
              className="text-3xl xs:text-4xl sm:text-[2.75rem] md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight px-2 sm:px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-white">
                Your one in a million
              </span>
              <br />
              <span className="bg-linear-to-r from-primary via-pink-400 to-purple-500 bg-clip-text text-transparent animate-gradient-shift">
                might be closer than you think.
              </span>
            </motion.h1>

            {/* Subheading - Responsive */}
            <motion.p
              className="text-base xs:text-lg sm:text-xl md:text-2xl text-white px-2 sm:px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="font-bold text-primary">1.6 million</span> messages sent daily.
            </motion.p>
            <motion.p
              className="text-sm xs:text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed px-4 sm:px-6 md:px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Connect with like-minded people who share your values, interests, and dreams.
            </motion.p>

            {/* CTA Button - Responsive */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 md:pt-6 w-full sm:w-auto px-4 sm:px-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <button className="group relative bg-linear-to-r from-primary to-pink-600 text-white rounded-full px-8 xs:px-10 sm:px-12 py-3 xs:py-4 font-semibold text-base xs:text-lg shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/70 transition-all duration-300 hover:scale-105 overflow-hidden w-full sm:w-auto">
                <span className="relative z-10">CREATE ACCOUNT</span>
                <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </motion.div>

            {/* Trust Indicators - Responsive */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-3.5 md:gap-4 pt-3 sm:pt-4 md:pt-6 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-1.5 xs:gap-2 bg-white/10 backdrop-blur-sm px-3 xs:px-4 py-1.5 xs:py-2 rounded-full border border-white/20 shadow-sm">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs xs:text-sm font-medium text-white whitespace-nowrap">100% Verified</span>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2 bg-white/10 backdrop-blur-sm px-3 xs:px-4 py-1.5 xs:py-2 rounded-full border border-white/20 shadow-sm">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs xs:text-sm font-medium text-white whitespace-nowrap">Safe & Secure</span>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2 bg-white/10 backdrop-blur-sm px-3 xs:px-4 py-1.5 xs:py-2 rounded-full border border-white/20 shadow-sm">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs xs:text-sm font-medium text-white whitespace-nowrap">4.8/5 Rating</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
